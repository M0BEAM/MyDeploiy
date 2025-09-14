"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import Spinner from "../../main/spinner";

interface MetricData {
  cpu: number;
  memory: number;
  network: number;
  timestamp: string;
}

interface TimeMetric {
  time: string;
  value: number;
}

type MetricType = "cpu" | "memory" | "network";

const ApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div className="text-gray-500">Loading chart...</div>,
});

const SingleLineChart: React.FC<{
  data: TimeMetric[];
  label: string;
  unit: string;
  color: string;
}> = ({ data, label, unit, color }) => {
  const [chartOptions, setChartOptions] = useState<ApexOptions | null>(null);

  useEffect(() => {
    const options: ApexOptions = {
      chart: {
        type: "line",
        height: 250,
        toolbar: { show: false },
        zoom: { enabled: false },
        foreColor: "#6b7280",
      },
      colors: [color],
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: 2 },
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
      xaxis: {
        type: "datetime",
        labels: {
          format: "HH:mm:ss",
          datetimeUTC: false,
        },
        categories: data.map(d => new Date(d.time).getTime()),
      },
      yaxis: {
        labels: {
          formatter: (val) => `${val}${unit}`,
        }
      },
      tooltip: {
        x: {
          format: "HH:mm:ss"
        },
        y: {
          formatter: (val) => `${val.toFixed(2)} ${unit}`,
        }
      },
    };

    setChartOptions(options);
  }, [data, unit, color]);

  return (
    <div className="h-[250px]">
      {chartOptions ? (
        <ApexCharts
          options={chartOptions}
          series={[{
            name: label,
            data: data.map(d => d.value)
          }]}
          type="line"
          height="100%"
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          Loading chart...
        </div>
      )}
    </div>
  );
};

const MetricsDesign = ({ deployId }: { deployId: string }) => {
  const [metrics, setMetrics] = useState<{
    cpu: TimeMetric[];
    memory: TimeMetric[];
    network: TimeMetric[];
  }>({ cpu: [], memory: [], network: [] });

  const [loading, setLoading] = useState(true);

  const [currentMetrics, setCurrentMetrics] = useState<MetricData>({
    cpu: 0,
    memory: 0,
    network: 0,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    const eventSource = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL_DEPLOY}/api/metrics/` + deployId
    );

 
    eventSource.onmessage = (event) => {
      try {
        const data: MetricData = JSON.parse(event.data);

        setCurrentMetrics(data);
        setMetrics(prev => ({
          cpu: [...prev.cpu.slice(-29), {
            time: data.timestamp,
            value: data.cpu
          }],
          memory: [...prev.memory.slice(-29), {
            time: data.timestamp,
            value: data.memory
          }],
          network: [...prev.network.slice(-29), {
            time: data.timestamp,
            value: data.network
          }]
          
        }));
             setLoading(false)
      } catch (error) {
        console.error("Error processing metrics:", error);
        setLoading(false)
      }
    };

    return () => eventSource.close();
  }, [deployId]);

  const getStatusColor = (value: number, type: MetricType): string => {
    // Temporary debug logs
    console.log(`Checking ${type} status:`, { value, type });

    const thresholds = {
      cpu: { warn: 50, critical: 80 },       // Percentage
      memory: { warn: 512, critical: 1024 }, // MB (1GB)
      network: { warn: 100, critical: 200 }  // MB
    };

    const result = value >= thresholds[type].critical ? "bg-red-500" :
      value >= thresholds[type].warn ? "bg-yellow-500" : "bg-gray-400";

    console.log(`Color result for ${type}:`, result);
    return result;
  };

  if (loading)
    return <Spinner />


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Server Metrics</h1>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* CPU Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-600 font-medium">CPU Usage</h3>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(currentMetrics.cpu, "cpu")
              }`} />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {currentMetrics.cpu.toFixed(1)}%
          </div>
        </div>

        {/* Memory Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-600 font-medium">Memory Usage</h3>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(currentMetrics.memory, "memory")
              }`} />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {currentMetrics.memory.toFixed(1)} MB
          </div>
        </div>

        {/* Network Card */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-gray-600 font-medium">Network Usage</h3>
            <div className={`w-3 h-3 rounded-full ${getStatusColor(currentMetrics.network, "network")
              }`} />
          </div>
          <div className="text-2xl font-bold text-gray-800">
            {currentMetrics.network.toFixed(1)} MB
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">CPU Usage History</h3>
          <SingleLineChart
            data={metrics.cpu}
            label="CPU"
            unit="%"
            color="#3b82f6"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Memory Usage History</h3>
          <SingleLineChart
            data={metrics.memory}
            label="Memory"
            unit="MB"
            color="#10b981"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-700 font-medium mb-4">Network Usage History</h3>
          <SingleLineChart
            data={metrics.network}
            label="Network"
            unit="MB"
            color="#8b5cf6"
          />
        </div>
      </div>
    </div>
  );
};

export default MetricsDesign;