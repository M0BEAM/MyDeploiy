import axios from 'axios';
import { set } from 'lodash';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

interface PostHookParams {
    category?: string;
    branch?: string;
    buildCommand?: string;
    data?: string;
    deployPath?: string;
    installCommand?: string;
    runtime?: string;
    method?: string;
    project?: string;
    siteTitle?: string;
    userId?: string;
    auth?: string;
    env:any
}
interface ResponseData {
    message: string;
    success: boolean;
    id: string;
}
export function useDeployStatic() {
    const [response, setResponse] = useState<ResponseData>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const [status, setStatus] = useState('pending');

    const deployStatic = async (params: PostHookParams): Promise<any> => {
        const data: Record<string, any> = {
            branch: params.branch || "",
            method: params.method || "",  // ✅ Keep method explicitly
            projectId: params.project || null,
            subdomain: params.siteTitle || "",
            [params.method || "gitUrl"]: params.data || "",
            auth: params.auth || "",
            type: "static",
            env:params.env || null,
            runtime:"html/css/js"
        };

        setLoading(true);
        setError(null);

        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_USER+"/users/"+ params.userId + "/deploy", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await resp.json();
            console.log(result)
            return result

        } catch (err: any) {
            console.error('Error posting to /deploy:', err.message);
            setError(err.message);
        }
    };

    const getStaticDeploy = async (deployId: string, userId: string) => {
        setLoading(true);
        setError(null);

        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_USER+"/users/"+ deployId + "/deployments/" + userId + "/user", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await resp.json();
            return result
        } catch (err:any) {
            console.error('Error fetching from /deploy:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const updateStatic = async (id: string, params: PostHookParams) => {
        const data = {
            branch: params.branch || "",
            buildCommand: params.buildCommand || "",
            data: params.data || "",
            deployPath: params.deployPath || "",
            installCommand: params.installCommand || "",
            language: params.runtime || "",
            method: params.method || "",
            project: params.project || "",
            siteTitle: params.siteTitle || "",
            type: "web"
        };

        setLoading(true);
        setError(null);

        try {
            const resp = await axios.put(`/users/deploy/${id}`, data);
            setResponse(resp.data);
        } catch (err) {
            console.error('Error updating /deploy:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteStatic = async (id: string) => {
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


    const getUserDeployRole = async (deployId: string, userId: string) => {
        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_USER+"/projects/getUserDeployRole/" + deployId + "/" + userId, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const result = await resp.json();
            return result
        } catch (err) {
            console.error('Error fetching from /deploy:', err);
        } finally {
        }
    };

    const updateDeployStatus = async (deployId: string, status: string) => {
        await fetch(process.env.NEXT_PUBLIC_API_URL_USER+"/users/updateStatus/" + deployId + "/" + status, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }
        });

    };


    const blockSite = async (subdomain: string): Promise<any> => {

        setLoading(true);
        setError(null);

        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_DEPLOY+"/api/block-subdomain", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subdomain }),
            });
            const result = await resp.json();
            return result

        } catch (err: any) {
            console.error('Error posting to /deploy:', err.message);
            setError(err.message);
        }
    };

    const deleteBlockSite = async (subdomain: string): Promise<any> => {

        setLoading(true);
        setError(null);

        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_DEPLOY+"/api/block-subdomain", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subdomain }),
            });
            const result = await resp.json();
            return result

        } catch (err: any) {
            console.error('Error posting to /deploy:', err.message);
            setError(err.message);
        }
    };

    return { deployStatic, getStaticDeploy, status, updateDeployStatus, getUserDeployRole, setLoading, updateStatic, deleteStatic, response, loading, error, blockSite, deleteBlockSite };
}
