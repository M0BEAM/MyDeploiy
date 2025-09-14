import { useProject } from "@/hook/project/useProject";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type Project = {
  id: string;
  name: string;
  description?: string;
};

type ModalListProjectsProps = {
  isOpen: boolean;
  userId: string;
  onClose: () => void;
};

export default function ModalListProjects({ userId, isOpen, onClose }: ModalListProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const { getProjectsByModeratorId, loading } = useProject();

  useEffect(() => {
    const fetchProjects = async () => {
      if (userId && isOpen) {
        try {
          const res = await getProjectsByModeratorId(userId);
          setProjects(res);
        } catch (error) {
          console.error("Failed to fetch moderator projects", error);
        }
      }
    };

    fetchProjects();
  }, [userId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 transition"
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Projects You Moderate
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-400">
            You haven’t joined any projects yet.
          </div>
        ) : (
          <ul className="space-y-4 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent pr-2">
            {projects.map((project) => (
              <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                <li className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl p-4 shadow-sm transition">
                  <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                  {project.description && (
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                  )}
                </li>
              </Link>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
