import { useUser } from "@/contexts/UserContext";
import { useProject } from "@/hook/project/useProject";
import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    inputsName: string[];
    buttonTitle: string;
  };
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, data }) => {
    const { createProjectByUserId } = useProject();
  const { user } = useUser();
  
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name") as string,
      envirement: formData.get("environment") as string,
      ownerId: user?.userId as string,
    };

    try {
      await createProjectByUserId(payload);
      alert("Registration successful!");
    } catch (err) {
      alert("Error: " + (err as Error).message);
    }
  };

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-10"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-30 w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{data.title}</h2>
          <button onClick={onClose} className="text-gray-600 text-xl" aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block mb-1 text-sm font-medium">
              {data.inputsName[0]}
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Project name"
              required
            />
          </div>
          <div>
            <label htmlFor="environment" className="block mb-1 text-sm font-medium">
              {data.inputsName[1]}
            </label>
            <input
              id="environment"
              name="environment"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="💻 Dev"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue text-white py-2 rounded hover:bg-blue-700"
          >
            {data.buttonTitle}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
