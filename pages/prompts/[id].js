import { useRouter } from "next/router";
import useSWR from "swr";

export default function PromptDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: prompt, isLoading, error } = useSWR(`/api/prompts/${id}`);

  if (isLoading) return <p>Loading...</p>;
  if (error) return error.message;
  if (!prompt) return null;

  async function handleDeletePrompt(id) {
    const response = await fetch(`/api/prompts/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      router.push("/?deleted=true");
    } else {
      return alert("Failed to delete prompt. Please try again.");
    }
  }

  async function handleEditPrompt(id) {}

  return (
    <>
      <p>{prompt.question}</p>
      <p>{prompt.answer}</p>
      {prompt.categories.map((category) => (
        <p key={category._id}>{category.name}</p>
      ))}
      <button onClick={() => handleDeletePrompt(prompt._id)}>DELETE</button>
      <button onClick={() => handleEditPrompt(prompt._id)}>EDIT</button>
    </>
  );
}
