import FooterNavigation from "@/components/Navigation/FooterNavigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

export default function QuizResultPage() {
  const { data: session, status } = useSession();
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const { data: leaderboardData, isLoading: leaderboardLoading } =
    useSWR("/api/users");
  const [submittedAnswers, setSubmittedAnswers] = useLocalStorageState(
    "quizAnswers",
    { defaultValue: {} }
  );

  useEffect(() => {
    if (!prompts || !session?.user?.id) return;

    let count = 0;
    prompts.forEach((prompt) => {
      const userAnswer = submittedAnswers[prompt._id] || "";
      const isCorrect =
        userAnswer.trim().toLowerCase() === prompt.answer.trim().toLowerCase();
      if (isCorrect) {
        count++;
      }
    });

    async function saveNewHighScore() {
      try {
        await fetch(`/api/users/${session.user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newScore: count,
          }),
        });
      } catch (error) {
        console.error("Failed to save highscore:", error);
      }
    }

    saveNewHighScore();
  }, [session, prompts, submittedAnswers]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;
  if (leaderboardLoading) return <p>Loading Leaderboard data...</p>;

  let count = 0;
  const results = prompts.map((prompt) => {
    const userAnswer = submittedAnswers[prompt._id] || "";
    const isCorrect =
      userAnswer.trim().toLowerCase() === prompt.answer.trim().toLowerCase();

    if (isCorrect) {
      count++;
    }

    return {
      question: prompt.question,
      correctAnswer: prompt.answer,
      userAnswer,
      isCorrect,
    };
  });

  const total = prompts.length;
  const incorrect = total - count;

  return (
    <PageContainer>
      <Header>QUIZ RESULT</Header>

      <ContentWrapper>
        <ResultsGrid>
          <ResultBox>
            <BoxTitle>SUMMARY</BoxTitle>
            <StatsList>
              <StatItem>CORRECT: {count}</StatItem>
              <StatItem>INCORRECT: {incorrect}</StatItem>
              <StatItem>TOTAL: {total}</StatItem>
            </StatsList>
          </ResultBox>

          <ResultBox>
            <BoxTitle>LEADERBOARD</BoxTitle>
            <LeaderboardList>
              {leaderboardData?.slice(0, 5).map((user, index) => (
                <LeaderboardItem key={user._id}>
                  <Position>{index + 1}.</Position>
                  <Name>{user.name}</Name>
                  <Score>
                    {user.highscore} / {total}
                  </Score>
                </LeaderboardItem>
              ))}
            </LeaderboardList>
          </ResultBox>
        </ResultsGrid>

        <PlayAgainButton href="/quiz">PLAY AGAIN</PlayAgainButton>
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
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 1rem;
  }
`;

const ResultsGrid = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const ResultBox = styled.div`
  flex: 1;
  border: 3px solid black;
  background-color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    border: 2px solid black;
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
    margin: 0 0 1rem 0;
  }
`;

const StatsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const StatItem = styled.p`
  font-size: 1rem;
  margin: 0;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const LeaderboardList = styled.ol`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.75rem;
  }
`;

const LeaderboardItem = styled.li`
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    gap: 0.375rem;
  }
`;

const Position = styled.span`
  font-weight: bold;
  min-width: 30px;

  @media (max-width: 480px) {
    min-width: 25px;
  }
`;

const Name = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Score = styled.span`
  font-weight: bold;
  white-space: nowrap;
`;

const PlayAgainButton = styled(Link)`
  padding: 1rem 3rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  color: black;
  cursor: pointer;
  display: inline-block;
  text-align: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.875rem 2.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    width: 100%;
    max-width: 300px;
  }
`;
