import FooterNavigation from "@/components/Navigation/FooterNavigation";
import PromptList from "@/components/Prompts/PromptList";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export default function BookmarkPage() {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const { data: session, status } = useSession();
  const { data: userData } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}` : null
  );
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (userData?.bookmarks) {
      setBookmarks(userData.bookmarks);
    }
  }, [userData]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

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

  const bookmarkedPrompts = prompts.filter((prompt) =>
    bookmarks.includes(prompt._id)
  );

  return (
    <PageContainer>
      <Header>MY BOOKMARKS</Header>

      <ContentWrapper>
        {bookmarkedPrompts.length === 0 ? (
          <NoBookmarks>You haven´t bookmarked any prompts yet.</NoBookmarks>
        ) : (
          <PromptList
            handleBookmark={handleBookmark}
            prompts={bookmarkedPrompts}
            bookmarks={bookmarks}
          />
        )}
      </ContentWrapper>

      <FooterNavigation />
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding-bottom: 60px;

  @media (max-width: 768px) {
    padding-bottom: 55px;
  }

  @media (max-width: 480px) {
    padding-bottom: 50px;
  }
`;

const Header = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  padding: 2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 0 2rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem 1rem 1rem;
  }
`;

const NoBookmarks = styled.p`
  text-align: center;
  font-size: 1.1rem;
  color: #666;
  padding: 2rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    padding: 1rem;
  }
`;
