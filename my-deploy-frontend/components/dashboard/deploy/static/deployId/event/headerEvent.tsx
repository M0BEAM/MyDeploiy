'use client';

import { useUser } from "@/contexts/UserContext";
import { useDeployStatic } from "@/hook/deploy/static/useDeployStatic";
import { useEffect, useState, ChangeEvent } from "react";
import DeploymentStatus from "./DeploymentStatus";
import { toast, ToastContainer } from "react-toastify";

interface DeployData {
  userRole: string;
  status: string;
  blocked: boolean;
  subdomain: string;
  type: string;
  runtime: string;
  branch?: string;
  projectId: string;
  userId: string;
}

export default function HeaderEvent({ deployId }: { deployId: string }) {
  const [, setRole] = useState<string>("");
  const { user } = useUser();
  const [status, setStatus] = useState<string>("pending");
  const { getStaticDeploy, blockSite, deleteBlockSite } = useDeployStatic();
  const [deploy, setDeploy] = useState<DeployData>({
    userRole: "",
    status: "",
    blocked: false,
    subdomain: "",
    type: "",
    runtime: "",
    branch: "",
    projectId: "",
    userId: ""
  });
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        try {
          const deploys: DeployData = await getStaticDeploy(deployId, user.userId);
          setDeploy(deploys);
          setRole(deploys.userRole);
          setStatus(deploys.status);
          setSelectedStatus(deploys.blocked ? "shutdown" : "live");
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("An unknown error occurred.");
          }
        }
      }
    };
    fetch();
  }, [deployId, user]);

  const serviceStatus = async (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "shutdown" && deploy.status.toUpperCase() === "SUCCESS") {
      await blockSite(deploy.subdomain);
    } else {
      await deleteBlockSite(deploy.subdomain);
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

      <div className="p-6 bg-white rounded-lg shadow-lg flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 items-center md:items-end">
            <div className="text-center md:text-left">
              <h1 className="text-lg font-bold text-gray-800">
                {deploy.type === "static" ? "Static site" : "Web service"}
              </h1>
              <h2 className="text-2xl font-semibold text-gray-900">{deploy.subdomain}</h2>
            </div>
            <div className="flex space-x-3 justify-center md:justify-start">
              <p className="text-gray-800 bg-gray-200 p-2 rounded">{deploy.runtime}</p>
              {
                deploy.projectId !== null && deploy.userId === user?.userId ? (
                  <button className="text-white bg-purple-500 p-2 rounded">Upgrade your instance</button>
                ) : deploy.projectId !== null && deploy.userId !== user?.userId ? (
                  <></>
                ) : deploy.projectId === null ? (
                  <button className="text-white bg-purple-500 p-2 rounded">Upgrade your instance</button>
                ) : (
                  <></>
                )}
            </div>
          </div>

          <div className="flex space-x-3 justify-center md:justify-start">
            <div className="inline-block relative">
              <select
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  serviceStatus(e);
                }}
                className="appearance-none bg-gray-100 px-3 py-2 pr-8 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ border: "none" }}
                value={selectedStatus}
              >
                <option value="live">⚡ Live</option>
                <option value="shutdown">🔌 Shutdown</option>
              </select>

              <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3 items-center md:items-start">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-3 text-center md:text-left">
            <p className="text-gray-800">Mydeploy / {deploy.subdomain}</p>
            <p className="text-gray-800">{deploy.branch || "main"}</p>
          </div>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`http://${deploy.subdomain}.localhost:3001/`}
            className="text-blue-600 hover:underline"
          >
            <DeploymentStatus deployId={deployId} status={status} setStatus={setStatus} />{" "}
            {deploy.type === "static" ? `http://${deploy.subdomain}.localhost:3001/` : `http://${deploy.subdomain}.localhost:5555/`}
          </a>
        </div>
      </div>
    </>
  );
}
