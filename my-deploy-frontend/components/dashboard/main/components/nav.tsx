'use client'

import { useEffect } from "react";
import MenuWithIcon from "@/components/menu/menuWithIcon";
import { useUser } from "@/contexts/UserContext";

export default function Nav() {
  const { user, refreshUser } = useUser();

  useEffect(() => {
    refreshUser();
  }, []); // Runs once on mount to fetch user info

  return (
    <div className="px-6 py-4 grid gap-3 md:flex md:justify-between md:items-center border-b border-gray-200 dark:border-neutral-700">
      {/* Title + Description */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-neutral-200">
          Overview - User: {user?.name ?? "Loading..."}
        </h2>
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Keys you have generated to connect with third-party clients or access the{" "}
          <a
            className="inline-flex items-center gap-x-1.5 text-blue-600 decoration-2 hover:underline focus:outline-none focus:underline font-medium dark:text-blue-500"
            href="#"
          >
            Deploy API.
          </a>
        </p>
      </div>

      {/* Right menu */}
      <div className="inline-flex gap-x-2">
        <MenuWithIcon />
      </div>
    </div>
  );
}
