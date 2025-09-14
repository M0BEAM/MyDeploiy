import ApplicationUiDeployWeb from "@/components/layout/applicationUiDeployWeb";
import { ReactNode } from 'react';
interface LayoutProps {
  children: ReactNode;
}
export default function Layout ({children}:LayoutProps){
    return (
        <ApplicationUiDeployWeb>
            {children}
        </ApplicationUiDeployWeb>
    )
}