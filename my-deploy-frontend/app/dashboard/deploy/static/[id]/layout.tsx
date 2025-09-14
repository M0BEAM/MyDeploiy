import ApplicationUiDeployStatic from "@/components/layout/applicationUiDeployStatic";
import { ReactNode } from 'react';
interface LayoutProps {
  children: ReactNode;
}
export default function Layout ({children}:LayoutProps){
    return (
        <ApplicationUiDeployStatic>
            {children}
        </ApplicationUiDeployStatic>
    )
}