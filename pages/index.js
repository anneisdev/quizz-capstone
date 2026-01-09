import PromptForm from "@/components/PromptForm";
import PromptList from "@/components/PromptList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function HomePage() {
  const { mutate } = useSWR("/api/prompts");
  const router = useRouter();
  const { deleted } = router.query;
  const { data: session, status } = useSession();
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");

  useEffect(() => {
    if (deleted === "true") {
      setDeleteSuccessMessage("Successfully deleted.");
      router.replace("/");
    }
  }, [deleted, router]);

  useEffect(() => {
    if (deleteSuccessMessage) {
      const timer = setTimeout(() => {}, 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccessMessage]);

  async function handleCreatePrompt(promptData) {
    const response = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptData),
    });

    if (response.ok) {
      mutate();
      return true;
    }
    return false;
  }

  if (status !== "authenticated") {
    return <h2>Access denied!</h2>;
  }
  return (
    <div>
      <PromptForm onSubmit={handleCreatePrompt} />
      {deleteSuccessMessage && <p>{deleteSuccessMessage}</p>}
      <PromptList />
    </div>
  );
}
