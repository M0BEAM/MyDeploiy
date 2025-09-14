"use client"
import ProjectTable from "@/components/dashboard/main/components/projectTable";
import { useProject } from "@/hook/project/useProject";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface projectType {
    id: string;
    name: string;
    ownerId: string;
}
export default function Projects() {
    const params = useParams();
    const [project, setProject] = useState<projectType>()
    const { getProjectById } = useProject()
    const id = params?.id as string;

    useEffect(() => {
        const fetchProject = async () => {
            const project = await getProjectById(id)
            setProject(project)
        }
        fetchProject()
    }, [id])
    
    return (
        <>
            <ProjectTable name={project?.name ?? ""} id={id} ownerId={project?.ownerId ?? ""} />
        </>
    );
}
