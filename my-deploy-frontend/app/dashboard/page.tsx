'use client';
import ProjectList from "@/components/dashboard/main/projectList";
import ServiceList from "@/components/dashboard/main/serviceList";
import Spinner from "@/components/dashboard/main/spinner";
import ApplicationUiDashboard from "@/components/layout/applicationDashboard";
import { useUser } from "@/contexts/UserContext";


export default function Dashboard() {
    const { loading } = useUser()

    return (

        <ApplicationUiDashboard>
            {!loading ? (
                <>
                    <ProjectList />
                    <ServiceList />
                </>
            ) : (
               <div className="flex justify-center items-center" >
                <Spinner />
               </div>
            )}

        </ApplicationUiDashboard>
    );
}
