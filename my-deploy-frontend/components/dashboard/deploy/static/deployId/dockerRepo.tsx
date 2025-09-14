'use client'

import { useState } from "react";

interface Data {
    method: string;
    data: string;
}
interface TabsStaticProps {
    setSourceData: React.Dispatch<React.SetStateAction<Data>>;
}
export default function DockerRepo({ setSourceData = () => { } }: TabsStaticProps) {
    const [getData,setData] = useState<Data>({method:"",data:""})
    return (
        <>
            <div className="p-4  rounded-lg ">
                {/* Removed the title input */}
                <div className="mb-4">
                    <label htmlFor="link" className="block text-sm font-medium text-gray-700">Docker URL:</label>
                    <input
                        onChange={(e) => {
                            e.preventDefault();
                            const data = e.target.value;
                            setSourceData({ method: 'dockerUrl', data })
                            setData({ method: 'dockerUrl', data });
                        }} type="text"
                        id="link"
                        name="repo"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <button onClick={()=>setSourceData(getData)} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    Connect
                </button>
            </div>
        </>
    )
}