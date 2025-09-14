"use client";
import { useUser } from '@/contexts/UserContext';
import { useDeployWebService } from '@/hook/deploy/web/useDeployWeb';
import { useProject } from '@/hook/project/useProject';
import {  useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EnvVarsPanel from '../../main/EnvVarsPanel';
import { toast, ToastContainer } from 'react-toastify';

interface SourceData {
  method: string;
  data: string;
}

interface Project {
  id: string;
  name: string;
}

interface EnvVar {
  key: string;
  value: string;
}

interface DeployResponse {
  success: boolean;
  id: string;
}

export default function FormLayoutWeb({ sourceData }: { sourceData: SourceData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [envs, setEnvs] = useState<EnvVar[]>([{ key: "", value: "" }]);
  const [, setSelectProject] = useState<string>("");
  const { getProjects } = useProject();
  const { deployWebService, loading, error, setLoading } = useDeployWebService();
  const { user } = useUser();

  useEffect(() => {

    const loadProjects = async () => {
      if (user) {
        const data = await getProjects(user.userId);
        setProjects(data);
      }
    };
    loadProjects();
  }, [user]);

  const handleDeploy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const response: DeployResponse = await deployWebService({
      ...data,
      ...sourceData,
      userId: user?.userId,
      env: envs,
    });

    if (response.success && !error) {
      setLoading(false);
      router.push(`/dashboard/deploy/web/${response.id}/?subdomain=${data.siteTitle}`);
    } else {
      toast.error(error || "An error occurred during deployment.");
    }
  };

  return (
    <>
      <ToastContainer
        containerId="containerA"
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div className="w-full p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Web Service Configuration</h1>

        <form className="space-y-6" onSubmit={handleDeploy}>
          {/* Site Title */}
          <div className="flex items-center">
            <label htmlFor="siteTitle" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Site Title
              <p className="text-xs text-gray-500 dark:text-gray-400">Enter the title of your web service.</p>
            </label>
            <input
              required
              type="text"
              id="siteTitle"
              name="siteTitle"
              className="w-2/3 mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>

          {/* Project */}
          <div className="flex items-center">
            <label htmlFor="project" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Project (Optional)
              <p className="text-xs text-gray-500 dark:text-gray-400">Add this to a project.</p>
            </label>
            <div className="w-2/3">
              <select
                disabled={loading}
                name="project"
                id="project"
                onChange={(e) => setSelectProject(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            value={projectId??""}
            >
                <option value="">Select Project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Runtime */}
          <div className="flex items-center">
            <label htmlFor="runtime" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Runtime
              <p className="text-xs text-gray-500 dark:text-gray-400">Choose runtime for this web service</p>
            </label>
            <div className="w-2/3">
              <select
                required
                name="runtime"
                id="runtime"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              >
                <option value="">Choose</option>
                <option value="nodejs">Node.js</option>
                <option value="docker">Docker</option>
              </select>
            </div>
          </div>

          {/* Category */}
          <div className="flex items-center">
            <label htmlFor="category" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Category
              <p className="text-xs text-gray-500 dark:text-gray-400">Pick a category for your service</p>
            </label>
            <div className="w-2/3">
              <select
                required
                name="category"
                id="category"
                className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:outline-none dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
              >
                <option value="">Choose</option>
                <option value="frontend">FrontEnd</option>
                <option value="backend">Backend</option>
              </select>
            </div>
          </div>

          {/* Deploy Path */}
          <div className="flex items-center">
            <label htmlFor="deployPath" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Publish Directory
              <p className="text-xs text-gray-500 dark:text-gray-400">Examples: ./, ./build, dist, frontend/build</p>
            </label>
            <input
              type="text"
              id="deployPath"
              name="deployPath"
              className="w-2/3 mt-1 block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>

          {/* Build Command */}
          <div className="flex items-center">
            <label htmlFor="buildCommand" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Build Command
              <p className="text-xs text-gray-500 dark:text-gray-400">Command to build your app</p>
            </label>
            <input
              required
              type="text"
              id="buildCommand"
              name="buildCommand"
              className="w-2/3 mt-1 block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>

          {/* Start Command */}
          <div className="flex items-center">
            <label htmlFor="startCommand" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
              Start Command
              <p className="text-xs text-gray-500 dark:text-gray-400">Command to start your app</p>
            </label>
            <input
              required
              type="text"
              id="startCommand"
              name="startCommand"
              className="w-2/3 mt-1 block px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-white"
            />
          </div>

          {/* Env Variables */}
          <EnvVarsPanel setEnvs={setEnvs} envs={envs} />

          {/* Submit Button */}
          <button
            disabled={loading}
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue hover:bg-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {loading ? "Deploying..." : "Deploy Web Service"}
          </button>
        </form>
      </div>
    </>
  );
}
