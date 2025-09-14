import axios from 'axios';
import { useState } from 'react';

interface PostHookParams {
    category?: string;
    branch?: string;
    buildCommand?: string;
    data?: string;
    deployPath?: string;
    startCommand?: string;
    runtime?: string;
    method?: string;
    project?: string;
    siteTitle?: string;
    userId?: string,
    env:any
}
interface ResponseData {
    message: string;
    success: boolean;
    id: string;
}
export function useDeployWebService() {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const deployWebService = async (params: PostHookParams): Promise<any> => {
        const data = {
            branch: params.branch || "",
            buildCommand: params.buildCommand || "",
            [params.method || "gitUrl"]: params.data || "",
            deployPath: params.deployPath || "",
            startCommand: params.startCommand || "",
            runtime: params.runtime || "",
            method: params.method || "",
            project: params.project || "",
            subdomain: params.siteTitle || "",
            type: "webservice",
            category: params.category, //params.category ||,
            userId: params.userId,
            env : params.env
        };

        setLoading(true);
        setError(null);

        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_USER+"/users/"+data.userId+"/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await resp.json();
            return result
        } catch (err) {
            console.error("❌ Error posting to /deploy:", error.response?.data || error.message);
            setError(error.message);
            setLoading(false)
        }
    };

    const fetchWebService = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const resp = await axios.get(`/deploy/${id}`);
            setResponse(resp.data);
        } catch (err) {
            console.error('Error fetching from /deploy:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const updateWebService = async (id: string, params: PostHookParams) => {
        const data = {
            branch: params.branch || "",
            buildCommand: params.buildCommand || "",
            data: params.data || "",
            deployPath: params.deployPath || "",
            startCommand: params.startCommand || "",
            runtime: params.runtime || "",
            method: params.method || "",
            project: params.project || "",
            siteTitle: params.siteTitle || "",
            type: "web"
        };

        setLoading(true);
        setError(null);

        try {
            const resp = await axios.put(`/deploy/${id}`, data);
            setResponse(resp.data);
        } catch (err) {
            console.error('Error updating /deploy:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteWebService = async (id: string) => {
        setLoading(true);
        setError(null);

        try {
            const resp = await axios.delete(`/deploy/${id}`);
            setResponse(resp.data);
        } catch (err) {
            console.error('Error deleting from /deploy:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    return { deployWebService, fetchWebService, updateWebService, deleteWebService, response, loading, setLoading, error };
}
