"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// If you also need lodash (_), ensure it is exposed as well:
import _ from "lodash";
if (typeof window !== "undefined") {
  window._ = _;
}

import { IStaticMethods } from "preline/preline";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

export default function PrelineScript() {
  const path = usePathname();

  useEffect(() => {
    const loadPreline = async () => {
      await import("preline/preline");
      window.HSStaticMethods.autoInit();
    };

    loadPreline();
  }, [path]);

  return null;
}
