'use client'
import FormLayoutStatic from "@/components/dashboard/deploy/static/formLayoutStatic";
import TabsStatic from "@/components/dashboard/deploy/static/tabsStatic";
import NavBar from "@/components/layout/navBar";
import { Suspense, useState } from "react";


interface Data {
  method: string;
  data: string;
}


export default function Static() {
  const [sourceData, setSourceData] = useState<Data>({ method: "", data: "" });

  return (
    <NavBar>
      <TabsStatic setSourceData={setSourceData} type="static" />
      <Suspense  fallback={<div>Loading...</div>}>
        <FormLayoutStatic sourceData={sourceData} />
      </Suspense>
    </NavBar>
  );
}