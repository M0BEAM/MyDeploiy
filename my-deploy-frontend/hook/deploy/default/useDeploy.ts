import axios from 'axios';
import { useState } from 'react';

interface PostHookParams {
    category?: string;
    branch?: string;
    buildCommand?: string;
    data?: string;
    deployPath?: string;
    installCommand?: string;
    language?: string;
    method?: string;
    project?: string;
    siteTitle?: string;
    type: string
}
interface ResponseData {
    message: string;
    success: boolean;
    id: string;
}
export function useDeploy() {
    const [response, setResponse] = useState<ResponseData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const fetchDeploy = async (id: string) => {
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

    const updateDeploy = async (id: string, params: PostHookParams) => {
        const data = {
            branch: params.branch || "",
            buildCommand: params.buildCommand || "",
            data: params.data || "",
            deployPath: params.deployPath || "",
            installCommand: params.installCommand || "",
            language: params.language || "",
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

    const deleteDeploy = async (id: string) => {
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


    const getDeployementsByUserId = async (userId: string) => {
        setLoading(true);
        setError(null);

        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_USER+"/users/" + userId + "/deployments/all", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await resp.json();
            return result
        } catch (err) {
            console.error('Error fetching from /deploy:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    return { fetchDeploy, getDeployementsByUserId, updateDeploy, deleteDeploy, response, loading, error };
}
