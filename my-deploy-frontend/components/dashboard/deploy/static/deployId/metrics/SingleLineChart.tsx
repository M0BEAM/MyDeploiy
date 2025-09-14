"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const ApexCharts = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div>Loading chart...</div>,
});

interface ChartProps {
  data: { time: string; value: number }[];
  label: string;
  unit: string;
}

const SingleLineChart: React.FC<ChartProps> = ({ data, label, unit }) => {
  const [chartOptions, setChartOptions] = useState<ApexOptions | null>(null);

  useEffect(() => {
    const options: ApexOptions = {
      chart: {
        type: "line",
        height: 250,
        toolbar: { show: false },
        zoom: { enabled: false },
        parentHeightOffset: 0,
      },
      xaxis: {
        type: "category",
        // Ensure categories is always defined—even if data is empty
        categories: data?.length ? data.map((point) => point.time) : [],
        title: { text: "Time" },
      },
      yaxis: {
        title: { text: `${label} (${unit})` },
      },
      tooltip: {
        // Remove custom x tooltip configuration if it's causing issues
        y: {
          formatter: (value: number) => `${value} ${unit}`,
        },
      },
      stroke: {
        curve: "smooth",
      },
      markers: {
        size: 0,
      },
    };

    setChartOptions(options);
  }, [data, label, unit]);

  return (
    <>
      {chartOptions ? (
        <ApexCharts 
          options={chartOptions} 
          series={[{ name: label, data: data.map((point) => point.value) }]} 
          type="line" 
          height={250} 
        />
      ) : (
        <div>Loading chart...</div>
      )}
    </>
  );
};

export default SingleLineChart;
