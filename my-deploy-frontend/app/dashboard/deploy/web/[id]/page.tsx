import ContentEvent from "@/components/dashboard/deploy/static/deployId/event/contentEvent";
import HeaderEvent from "@/components/dashboard/deploy/static/deployId/event/headerEvent";

export default async function DeployEvent({ params }: { params: Promise<{ id: string }> }) {
const { id } = await params;

    return (
        <>
            <HeaderEvent deployId={id} />
            <ContentEvent />
        </>
    )
}