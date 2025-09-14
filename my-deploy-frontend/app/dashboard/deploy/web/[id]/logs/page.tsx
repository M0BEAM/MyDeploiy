import HeaderEvent from "@/components/dashboard/deploy/static/deployId/event/headerEvent";
import LogDesing from "@/components/dashboard/deploy/webservice/logDesign";
export default async function WebLogs({params}: {params: Promise<{ id: string }>}) {
const { id } = await params;
  return (
    <>
      <HeaderEvent deployId={id} />
      <LogDesing deployId={id} />
    </>
  )
}