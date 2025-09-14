'use client'
import FormLayoutWeb from "@/components/dashboard/deploy/static/formLayoutWeb";
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
      <TabsStatic type="web" setSourceData={setSourceData} />
      <Suspense fallback={<div>Loading...</div>}>
        <FormLayoutWeb sourceData={sourceData} />
      </Suspense>
    </NavBar>
  );
}