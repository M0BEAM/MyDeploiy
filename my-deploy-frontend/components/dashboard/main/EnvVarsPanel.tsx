import { useState } from "react";

type EnvVar = {
  key: string;
  value: string;
};

interface EnvVarsPanelProps {
  envs: EnvVar[];
  setEnvs: (envs: EnvVar[]) => void;
}

export default function EnvVarsPanel({ envs, setEnvs }: EnvVarsPanelProps) {
  const [showInputs, setShowInputs] = useState(false);

  const handleStart = () => {
    setShowInputs(true);
  };

  const handleAddMore = () => {
    setEnvs([...envs, { key: "", value: "" }]);
  };

  const handleInputChange = (index: number, field: "key" | "value", value: string) => {
    const updated = [...envs];
    updated[index][field] = value;
    setEnvs(updated);
  };

  return (
    <div className="border p-12 border-gray-200 rounded-lg bg-white dark:bg-gray-800">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Environment Variables</h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Set environment-specific config (such as API keys), then read those values from your code.
      </p>

      {!showInputs ? (
        <button
          onClick={handleStart}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          ➕ Add Environment Variable
        </button>
      ) : (
        <>
          <div className="space-y-4 mb-4">
            {envs.map((env, index) => (
              <div key={index} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Name (e.g. API_KEY)"
                  value={env.key}
                  onChange={(e) => handleInputChange(index, "key", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={env.value}
                  onChange={(e) => handleInputChange(index, "value", e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            ))}
          </div>

          <span
            onClick={handleAddMore}
            className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            ➕ Add More
          </span>
        </>
      )}
    </div>
  );
}
