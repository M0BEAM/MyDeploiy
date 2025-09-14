import { useUser } from "@/contexts/UserContext";
import { useProject } from "@/hook/project/useProject";
import React, { useEffect, useState } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: { title: string; inputsName: string[]; buttonTitle: string };
  projectId: string;
}

interface Moderator {
  id: string;
  userId: string;
  projectId: string;
  user: {
    userId: string;
    name: string;
    email: string;
    role: string;
  };
}

const ModeratorModal: React.FC<ModalProps> = ({ isOpen, onClose, data, projectId }) => {
  const { user } = useUser();
  const [moderators, setModerators] = useState<Moderator[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { getModeratorsByIdProject, addModeratorToProject, deleteModerator } = useProject();

  const fetchModerators = async () => {
    try {
      const fetched = await getModeratorsByIdProject({ projectId });
      setModerators(fetched);
    } catch (err) {
      console.error("Failed to fetch moderators:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchModerators();
    }
  }, [isOpen]);

  const handleAddModerator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.userId) return;

    try {
      setLoading(true);
      await addModeratorToProject({
        adminId: user.userId,
        projectId,
        userEmail: newEmail,
      });
      setNewEmail("");
      await fetchModerators();
    } catch (err) {
      console.error("Failed to add moderator:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (userEmail: string) => {
    try {
      await deleteModerator({ projectId, userEmail });
      setModerators((prev) => prev.filter((mod) => mod.user.email !== userEmail));
    } catch (err) {
      console.error("Failed to remove moderator:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={onClose}></div>

      <div className="relative z-30 w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{data.title}</h2>
          <button onClick={onClose} className="text-gray-600 text-xl">&times;</button>
        </div>

        {/* Moderators List */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Moderators:</h3>
          {moderators.length === 0 ? (
            <p className="text-gray-500 italic">No moderators yet.</p>
          ) : (
            <ul className="space-y-2">
              {moderators.map((mod) => (
                <li key={mod.id} className="flex justify-between items-center border-b pb-1">
                  <span>{mod.user.name || mod.user.email}</span>
                  <button
                    onClick={() => handleRemove(mod.user.email)}
                    className="text-red-600 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add moderator */}
        <form onSubmit={handleAddModerator} className="space-y-4">
          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="Moderator email"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue text-white py-2 rounded hover:bg-blue-700"
          >
            {loading ? "Adding..." : data.buttonTitle}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModeratorModal;
