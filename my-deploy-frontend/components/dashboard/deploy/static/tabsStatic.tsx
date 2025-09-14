'use client';

import PublicGitRepo from './publicGitRepo';
import DockerRepo from './deployId/dockerRepo';

interface Data {
  method: string;
  data: string;
  auth?: string;
}

interface TabsStaticProps {
  setSourceData: React.Dispatch<React.SetStateAction<Data>>;
  type: string;
}

export default function TabsStatic({ setSourceData, type }: TabsStaticProps) {
  return (
    <div className="flex justify-between">
      <div className="w-1/4 p-4">
        <h2 className="text-xl font-bold text-gray-800 dark:text-neutral-200">Source Code</h2>
      </div>

      <div className="w-2/3">
        <div className="flex">
          <div className="flex bg-gray-100 hover:bg-gray-200 rounded-lg transition p-1 dark:bg-neutral-700 dark:hover:bg-neutral-600">
            <nav
              className="flex gap-x-1"
              aria-label="Tabs"
              role="tablist"
              aria-orientation="horizontal"
            >
              <button
                type="button"
                className="hs-tab-active:bg-white hs-tab-active:text-gray-700 hs-tab-active:dark:bg-neutral-800 hs-tab-active:dark:text-neutral-400 dark:hs-tab-active:bg-gray-800 py-3 px-4 inline-flex items-center gap-x-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 focus:outline-none font-medium rounded-lg dark:text-neutral-400 dark:hover:text-white"
                id="segment-item-1"
                aria-selected="true"
                data-hs-tab="#segment-1"
                aria-controls="segment-1"
                role="tab"
              >
                Git Repository URL
              </button>

              {type !== "static" && (
                <button
                  type="button"
                  className="hs-tab-active:bg-white hs-tab-active:text-gray-700 hs-tab-active:dark:bg-neutral-800 hs-tab-active:dark:text-neutral-400 dark:hs-tab-active:bg-gray-800 py-3 px-4 inline-flex items-center gap-x-2 bg-transparent text-sm text-gray-500 hover:text-gray-700 focus:outline-none font-medium rounded-lg dark:text-neutral-400 dark:hover:text-white"
                  id="segment-item-2"
                  aria-selected="false"
                  data-hs-tab="#segment-2"
                  aria-controls="segment-2"
                  role="tab"
                >
                  Docker Repository URL
                </button>
              )}
            </nav>
          </div>
        </div>

        <div className="mt-3">
          <div id="segment-1" role="tabpanel" aria-labelledby="segment-item-1">
            <PublicGitRepo setSourceData={setSourceData} />
          </div>
          <div id="segment-2" className="hidden" role="tabpanel" aria-labelledby="segment-item-2">
            <DockerRepo setSourceData={setSourceData} />
          </div>
        </div>
      </div>
    </div>
  );
}
