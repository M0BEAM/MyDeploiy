import axios from 'axios';
import { useState } from 'react';

interface PostHookParams {
    branch?: string;
    buildCommand?: string;
    data?: string;
    deployPath?: string;
    installCommand?: string;
    language?: string;
    method?: string;
    project?: string;
    siteTitle?: string;
    type:string
}

export function useDeployBackend() {
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);

    const deployBackend = async (params: PostHookParams) => {
        const data = {
            branch: params.branch || "",
            buildCommand: params.buildCommand || "",
            repoUrl: params.data || "",
            deployPath: params.deployPath || "",
            installCommand: params.installCommand || "",
            language: params.language || "",
            method: params.method || "",
            project: params.project || "",
            subdomain: params.siteTitle || "",
            type: "webservice",
            category:"backend", 
        };

        setLoading(true);
        setError(null);

        try {
            const resp = await axios.post('/api/deploy', data);
            setResponse(resp.data);
        } catch (err) {
            console.error('Error posting to /deploy:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchBackend = async (id: string) => {
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

    const updateBackend = async (id: string, params: PostHookParams) => {
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

    const deleteBackend = async (id: string) => {
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

    return { deployBackend, fetchBackend, updateBackend, deleteBackend, response, loading, error };
}
