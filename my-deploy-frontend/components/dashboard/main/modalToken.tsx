import React from "react";

interface GetData {
  data: string; // Replace unknown with a specific type if you know the shape of this data
}

interface SourceData {
  method: string;
  data: string; // Replace unknown with specific type if possible
  auth?: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    title: string;
    inputsName: string[];
    buttonTitle: string;
  };
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setSourceData: React.Dispatch<React.SetStateAction<SourceData>>;
  getData: GetData;
}

const ModalToken: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  data,
  setToken,
  setSourceData,
  getData,
}) => {
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get("token") as string;

    setToken(token);
    setSourceData({
      method: "gitUrl",
      data: getData.data,
      auth: token,
    });

    onClose();
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
      ></div>

      {/* Modal content */}
      <div className="relative z-30 w-full max-w-md sm:max-w-lg bg-white rounded-2xl shadow-xl p-6 animate-fadeIn scale-95 sm:scale-100 transition-transform duration-300 ease-out">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{data.title}</h2>
          <button onClick={onClose} className="text-gray-600 text-xl">
            &times;
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium" htmlFor="token">
              {data.inputsName[0]}
            </label>
            <input
              id="token"
              name="token"
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="Token"
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

export default ModalToken;
