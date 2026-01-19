import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import PromptList from "../Prompts/PromptList";

export default function Account() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const { data: prompts } = useSWR("/api/prompts");
  const { data: userData } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}` : null
  );
  const [bookmarks, setBookmarks] = useState([]);
  const [showPrompts, setShowPrompts] = useState(false);

  useEffect(() => {
    if (!session) return;

    fetch(`/api/users/${session.user.id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [session]);

  useEffect(() => {
    if (userData?.bookmarks) {
      setBookmarks(userData.bookmarks);
    }
  }, [userData]);

  if (status === "loading") return <LoadingText>Loading session…</LoadingText>;
  if (!session) return <LoadingText>Please log in</LoadingText>;
  if (!user) return <LoadingText>Loading user…</LoadingText>;

  const userPrompts = prompts?.filter(
    (prompt) => prompt.owner === user.authProviderId
  );

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

  return (
    <Container>
      <ContentWrapper>
        <Box>
          <BoxTitle>SUMMARY</BoxTitle>
          <InfoList>
            <InfoItem>
              HIGHSCORE: {user?.highscore} / {prompts?.length}
            </InfoItem>
            <InfoItem>BOOKMARKS: {user?.bookmarks.length}</InfoItem>
            <InfoItem>MY PROMPTS: {userPrompts?.length || 0}</InfoItem>
            <InfoItem>USERNAME: {session?.user.name}</InfoItem>
          </InfoList>
        </Box>

        <PromptsSection>
          <SectionHeader>
            <SectionTitle>MY PROMPTS</SectionTitle>
            <ToggleButton onClick={() => setShowPrompts(!showPrompts)}>
              {showPrompts ? "HIDE" : "SHOW"}
            </ToggleButton>
          </SectionHeader>

          {showPrompts && (
            <>
              {userPrompts?.length > 0 ? (
                <PromptList
                  handleBookmark={handleBookmark}
                  prompts={userPrompts}
                  bookmarks={bookmarks}
                />
              ) : (
                <NoPrompts>You haven´t created any prompts yet.</NoPrompts>
              )}
            </>
          )}
        </PromptsSection>
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 0 2rem 2rem 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem 1rem 1rem;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  width: 100%;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Box = styled.div`
  border: 3px solid black;
  background-color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border: 2px solid black;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

const BoxTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin: 0 0 1.5rem 0;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin: 0 0 1.25rem 0;
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.875rem;
  }
`;

const InfoItem = styled.p`
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const PromptsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: relative;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
    flex-direction: column;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ToggleButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 1.25rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    width: 100%;
    max-width: 200px;
  }
`;

const NoPrompts = styled.p`
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

const LoadingText = styled.p`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 1rem;
  }
`;
