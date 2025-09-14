"use client";

import { useUser } from '@/contexts/UserContext';
import { useDeployStatic } from '@/hook/deploy/static/useDeployStatic';
import { useProject } from '@/hook/project/useProject';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import EnvVarsPanel from '../../main/EnvVarsPanel';

interface SourceData {
  method: string;
  data: string;
}
type EnvVar = {
  key: string;
  value: string;
};

interface Project {
  id: string;
  name: string;
}

interface DeployResponse {
  success: boolean;
  id: string;
}

export default function FormLayoutStatic({ sourceData }: { sourceData: SourceData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [projects, setProjects] = useState<Project[]>([]);
  const [envs, setEnvs] = useState<EnvVar[]>([{ key: "", value: "" }]);
  const [, setSelectProject] = useState<string>("");

  const { getProjects } = useProject();
  const { deployStatic, loading, setLoading } = useDeployStatic();
  const { user } = useUser();


  useEffect(() => {
    const loadProjects = async () => {
      if (user) {
        const data: Project[] = await getProjects(user.userId);
        setProjects(data);
      }
    };
    loadProjects();
  }, [user]);

  const handleDeploy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const response: DeployResponse | undefined = await deployStatic({
      ...data,
      ...sourceData,
      userId: user?.userId,
      env: envs,
    });

    if (response?.success) {
      setLoading(false);
      router.push(`/dashboard/deploy/static/${response.id}/?subdomain=${data.siteTitle}`);
    }
  };

  return (
    <div className="w-full p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Static site Configuration
      </h1>

      <form className="space-y-6" onSubmit={handleDeploy}>
        <div className="flex items-center">
          <label htmlFor="siteTitle" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
            Site Title
            <p className="text-xs text-gray-500 dark:text-gray-400">Enter the subdomain of your site.</p>
          </label>
          <input
            required
            type="text"
            id="siteTitle"
            name="siteTitle"
            className="w-2/3 mt-1 block px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-700 dark:border-neutral-600 dark:placeholder-gray-400 dark:text-white"
          />
        </div>

        <div className="flex items-center">
          <label htmlFor="project" className="w-1/3 text-lg font-medium text-gray-700 dark:text-gray-300">
            Project (Optional)
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add this static site to a project once it’s created.
            </p>
          </label>
          <div className="w-2/3">
            <select
              disabled={loading}
              name="project"
              id="project"
              onChange={(e) => {
                setSelectProject(e.target.value);
                setSelectProject("");
              }}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:outline-none"
             value={projectId ?? ''}
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

        <EnvVarsPanel setEnvs={setEnvs} envs={envs} />

        <button
          disabled={loading}
          data-testid="deploy-btn"
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {loading ? "Deploying..." : "Deploy static site"}
        </button>
      </form>
    </div>
  );
}
