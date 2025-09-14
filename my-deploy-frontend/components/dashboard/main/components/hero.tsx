'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Modal from '../modal';
import ModalListProjects from '../modalListProjects';
import { useProject } from '@/hook/project/useProject';
import { useUser } from '@/contexts/UserContext';

interface Project {
  id: string;
  name: string;
  envirement?: string;
}

const ProjectsOverview = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showModalListProjects, setShowModalListProjects] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const { getProjects, loading } = useProject();
  const { user } = useUser();

  useEffect(() => {
    const fetchProjects = async () => {
      if (user?.userId) {
        const result = await getProjects(user.userId);
        console.log(result);
        setProjects(result || []);
      }
    };
    fetchProjects();
  }, [user]);

  return (
    <>
      <ModalListProjects
        userId={user?.userId as string}
        isOpen={showModalListProjects}
        onClose={() => setShowModalListProjects(false)}
      />
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        data={{ title: 'Create Project', inputsName: ['Project Name', 'Environment'], buttonTitle: 'Create' }}
      />

      <div className="mx-6">
        <div className="flex justify-between items-center mt-6">
          <h2 className="text-lg font-semibold">Projects</h2>
          <button
            onClick={() => setShowModalListProjects(true)}
            type="button"
            className="py-3 px-4 flex justify-center items-center text-sm font-medium rounded-lg"
          >
            <span className="self-end">Team Space</span>
            <svg
              className="w-[28px] h-[28px] text-gray-800 dark:text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M17 10v1.126c.367.095.714.24 1.032.428l.796-.797 1.415 1.415-.797.796c.188.318.333.665.428 1.032H21v2h-1.126c-.095.367-.24.714-.428 1.032l.797.796-1.415 1.415-.796-.797a3.979 3.979 0 0 1-1.032.428V20h-2v-1.126a3.977 3.977 0 0 1-1.032-.428l-.796.797-1.415-1.415.797-.796A3.975 3.975 0 0 1 12.126 16H11v-2h1.126c.095-.367.24-.714.428-1.032l-.797-.796 1.415-1.415.796.797A3.977 3.977 0 0 1 15 11.126V10h2Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {showBanner ? (
          <div className="bg-gray-100 p-16 rounded-lg mt-4 flex items-center justify-between">
            <div className="flex space-x-4">
              <div className="text-purple-600 text-2xl">⚙️</div>
              <div>
                <h3 className="text-lg font-semibold">Get organized with Projects</h3>
                <p className="text-gray-600">
                  An easier way to organize your resources and collaborate with team members.
                </p>
                <div className="mt-3 flex space-x-4">
                  <button onClick={() => setShowModal(true)} className="bg-black text-white px-4 py-2 rounded">
                    + Create your first project
                  </button>
                  <button className="text-purple-600 hover:underline">Learn more</button>
                </div>
              </div>
            </div>
            <button onClick={() => setShowBanner(false)} className="text-gray-400 hover:text-gray-600">
              ✖
            </button>
          </div>
        ) : (
          <div className="my-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {loading ? (
                <p>Loading...</p>
              ) : projects.length === 0 ? (
                <p className="text-gray-500 col-span-full">No projects found.</p>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="border p-4 rounded-lg shadow-sm">
                    <Link href={`/dashboard/projects/${project.id}`}>
                      <h3 className="font-semibold text-lg hover:underline">{project.name}</h3>
                    </Link>
                    <span className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded mt-2 inline-block">
                      {project.envirement || '💻 Dev'}
                    </span>
                  </div>
                ))
              )}

              {/* Add New Project Button */}
              <div
                className="border-dashed border-2 border-gray-300 p-4 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 transition"
                onClick={() => setShowModal(true)}
              >
                <span className="text-gray-600 text-lg font-medium">+ Create new project</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectsOverview;
