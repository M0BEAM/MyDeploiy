import { useState } from "react";

export function useProject() {
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null);
    const getProjects = async (userId: string) => {
        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/projects/' + userId,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            const projects = await resp.json();
            setLoading(false)
            return projects
        } catch (error: any) {
            console.error('Error signing in:', error);
            setLoading(false)
            setError(error.message)

        }
    }
    const getProjectsByModeratorId = async (userId: string) => {
        try {
            const resp = await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/projects/moderatorProjects/' + userId,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
            const projects = await resp.json();
            setLoading(false)
            return projects
        } catch (error) {
            console.error('Error signing in:', error);
            setLoading(false)

        }
    }
    const createProjectByUserId = async (data: { name: string, envirement: string, ownerId: string }) => {
        try {
            await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/projects',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data }),
                });
            setLoading(false)
        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }
    const addModeratorToProject = async (data: { adminId: string, projectId: string, userEmail: string }) => {
        try {
            await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/projects/addModerator',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...data }),
                });
            setLoading(false)
        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }
    const getModeratorsByIdProject = async (data: { projectId: string }) => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/projects/getModerators/' + data.projectId,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const moderators = await res.json();
            setLoading(false)
            console.log("moderators", moderators)
            if (moderators.length > 0)
                return moderators
            else
                return []

        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }
    const deleteModerator = async (data: { projectId: string, userEmail: string }) => {
        try {
            await fetch(process.env.NEXT_PUBLIC_API_URL_USER + `/projects/deleteModerators/${data.projectId}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userEmail: data.userEmail }),
            });
            setLoading(false)
        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }

    const getDeploysByProjectId = async (data: { projectId: string }) => {
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL_USER + '/projects/getDeploysByProjectId/' + data.projectId,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );
            const deploys = await res.json();
            setLoading(false)
            if (deploys.length > 0)
                return deploys
            else
                return []

        } catch (error: any) {
            setError(error.message)
            setLoading(false)
        }
    }

    const getProjectById = async (projectId: string) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL_USER}/projects/details/${projectId}`, {
                cache: "no-store", // Disable caching for fresh data
            });

            const project = await response.json()
             setLoading(false)
            return project
        } catch (error) {
             setLoading(false)
            console.error("Error fetching project details:", error);
        }

    }

    return { getProjects,getProjectById, deleteModerator, getDeploysByProjectId, createProjectByUserId, getProjectsByModeratorId, addModeratorToProject, getModeratorsByIdProject, error, loading };
}
