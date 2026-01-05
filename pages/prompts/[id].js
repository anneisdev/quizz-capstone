import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function PromptDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: prompt, isLoading, error } = useSWR(`/api/prompts/${id}`);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

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
      setErrorMessage("Failed to delete. Please try again.");
    }
  }

  async function handleEditPrompt(id) {}

  return (
    <>
      {errorMessage && <p>{errorMessage}</p>}
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
