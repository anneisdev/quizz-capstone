import PromptForm from "@/components/PromptForm";
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
    <div>
      <PromptForm onSubmit={handleCreatePrompt} />
    </div>
  );
}
