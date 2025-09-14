"use client";
import ContentEvent from "@/components/dashboard/deploy/static/deployId/event/contentEvent";
import HeaderEvent from "@/components/dashboard/deploy/static/deployId/event/headerEvent";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DeployEvent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  useEffect(() => {
    if (!id) {
      console.error("ID is missing from params");
      router.push("/not-found");
    }
  }, [id, router]);

  if (!id) {
    return null; // Optional: Add loading spinner
  }

  try {
    return (
      <>
        <HeaderEvent deployId={id} />
        <ContentEvent />
      </>
    );
  } catch (error) {
    console.error("Fetch Error:", error);
    return notFound();
  }
}
