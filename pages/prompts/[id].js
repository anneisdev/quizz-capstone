import PromptDetail from "@/components/PromptDetail";
import PromptForm from "@/components/PromptForm";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

  function handleBookmark() {
    console.log("bookmarked detail");
  }

  return (
    <>
      {errorMessage && <p>{errorMessage}</p>}
      {editSucces && <p>{editSucces}</p>}
      {!isEiditing && (
        <PromptDetail
          data={prompt}
          onDelete={() => handleDeletePrompt(prompt._id)}
          onEdit={() => setIsEditing(true)}
          onBookmark={handleBookmark}
        />
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
