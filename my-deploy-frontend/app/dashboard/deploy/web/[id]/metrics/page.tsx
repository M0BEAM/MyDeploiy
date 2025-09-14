import MetricsDesign from "@/components/dashboard/deploy/webservice/metricDesign";
import React from "react";

const MetricsDashboard = async({params}: {params: Promise<{ id: string }>}) => {
const { id } = await params;
  return (
    <>
      <MetricsDesign deployId={id} />
    </>
  );
};

export default MetricsDashboard;
