'use client'

import { useState } from "react";
import ModalToken from "../../main/modalToken";

interface Data {
    method: string;
    data: string;
    auth?: string 
}
interface TabsStaticProps {
  setSourceData: React.Dispatch<React.SetStateAction<Data>>;
}
export default function PublicGitRepo({ setSourceData = () => { } }: TabsStaticProps) {
    const [getData, setData] = useState<Data>({ method: "", data: "",auth: "" });
    const [showModal, setShowModal] = useState(false);
    const [token, setToken] = useState('');

    return (
        <>
            <ModalToken isOpen={showModal} setSourceData={setSourceData} getData={getData}  setToken={setToken} onClose={() => setShowModal(false)} data={{ title: 'Add token', inputsName: ['Token', 'Environment'], buttonTitle: 'save' }} />

            <div className="p-4  rounded-lg ">
                {/* Removed the title input */}
                <div className="mb-4">
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">GitHub Link:</label>
                    <input
                        onChange={(e) => {
                            e.preventDefault();
                            const data = e.target.value;
                            console.log('GitHub URL:', data); // Debugging log
                            setSourceData({ method: 'gitUrl', data,auth:token })
                            setData({ method: 'gitUrl', data,auth:token });
                        }} type="text"
                        id="link"
                        name="repo"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Add Token
                </button>
            </div>
        </>
    )
}