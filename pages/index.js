import PromptForm from "@/components/PromptForm";
import PromptList from "@/components/PromptList";
import useSWR from "swr";

export default function HomePage() {
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
      <PromptList />
    </div>
  );
}
