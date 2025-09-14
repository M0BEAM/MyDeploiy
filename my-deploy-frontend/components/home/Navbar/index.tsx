"use client";

import React, { useEffect } from "react";
import Navbar from "./Navbar";

const Navbarin: React.FC = () => {
  useEffect(() => {
    // Debounce function typed properly without 'any'
    const debounce = <T extends (...args: unknown[]) => void>(fn: T): T => {
      let frame: number;
      return ((...args: Parameters<T>): void => {
        if (frame) cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => fn(...args));
      }) as T;
    };

    // Store scroll position in data attribute
    const storeScroll = (): void => {
      document.documentElement.dataset.scroll = window.scrollY.toString();
    };

    const debouncedStoreScroll = debounce(storeScroll);

    document.addEventListener("scroll", debouncedStoreScroll, { passive: true });
    storeScroll();

    return () => {
      document.removeEventListener("scroll", debouncedStoreScroll);
    };
  }, []);

  return <Navbar />;
};

export default Navbarin;
