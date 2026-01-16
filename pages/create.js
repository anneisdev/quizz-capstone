import FooterNavigation from "@/components/Navigation/FooterNavigation";
import PromptForm from "@/components/Prompts/PromptForm";
import useSWR from "swr";

export default function CreatePage() {
  const { mutate } = useSWR("/api/prompts");

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

  return (
    <>
      <PromptForm onSubmit={handleCreatePrompt} />
      <FooterNavigation />
    </>
  );
}
