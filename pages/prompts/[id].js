import PromptForm from "@/components/PromptForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export default function PromptDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const {
    data: prompt,
    isLoading,
    error,
    mutate,
  } = useSWR(`/api/prompts/${id}`);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEiditing, setIsEditing] = useState(false);
  const [editSucces, setEditSuccess] = useState("");

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

  async function handleEditPrompt(prompt) {
    const response = await fetch(`/api/prompts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(prompt),
    });

    if (response.ok) {
      await mutate();
      setIsEditing(false);
      setEditSuccess("Changes saved!");
      return true;
    }

    return false;
  }

  return (
    <>
      {errorMessage && <p>{errorMessage}</p>}
      {editSucces && <p>{editSucces}</p>}
      {!isEiditing && (
        <>
          <p>{prompt.question}</p>
          <p>{prompt.answer}</p>
          {prompt.categories.map((category) => (
            <p key={category._id}>{category.name}</p>
          ))}
          <button onClick={() => handleDeletePrompt(prompt._id)}>DELETE</button>
          <button onClick={() => setIsEditing(true)}>EDIT</button>
        </>
      )}

      {isEiditing && (
        <PromptForm
          initialData={prompt}
          onSubmit={handleEditPrompt}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </>
  );
}

