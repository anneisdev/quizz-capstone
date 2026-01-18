import PromptDetail from "@/components/Prompts/PromptDetail";
import PromptForm from "@/components/Prompts/PromptForm";
import { useSession } from "next-auth/react";
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
  const { data: session } = useSession();
  const { data: userData } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}` : null
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [isEiditing, setIsEditing] = useState(false);
  const [editSucces, setEditSuccess] = useState("");
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (userData?.bookmarks) {
      setBookmarks(userData.bookmarks);
    }
  }, [userData]);

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
      router.push("/collection");
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

  async function handleBookmark(promptId) {
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: promptId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  }

  const isBookmarked = bookmarks.includes(prompt._id);

  return (
    <PageContainer>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      {editSucces && <SuccessMessage>{editSucces}</SuccessMessage>}

      {!isEiditing ? (
        <PromptDetail
          data={prompt}
          onDelete={() => handleDeletePrompt(prompt._id)}
          onEdit={() => setIsEditing(true)}
          onBookmark={() => handleBookmark(prompt._id)}
          isBookmarked={isBookmarked}
        />
      ) : (
        <PromptForm
          initialData={prompt}
          onSubmit={handleEditPrompt}
          onCancel={() => setIsEditing(false)}
        />
      )}
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const LoadingText = styled.p`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const ErrorText = styled.p`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  color: red;

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.p`
  text-align: center;
  color: red;
  font-weight: bold;
  margin: 1rem 0;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin: 0.75rem 0;
  }
`;

const SuccessMessage = styled.p`
  text-align: center;
  color: green;
  font-weight: bold;
  margin: 1rem 0;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin: 0.75rem 0;
  }
`;
