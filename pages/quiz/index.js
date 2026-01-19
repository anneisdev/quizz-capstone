import FooterNavigation from "@/components/Navigation/FooterNavigation";
import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import useSWR from "swr";

export default function QuizPage() {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const router = useRouter();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  function handleResetQuiz() {
    router.push(`/quiz/${prompts[0]._id}`);
    localStorage.removeItem("quizAnswers");
  }

  return (
    <PageContainer>
      <StyledHeading>QUIZ GAME</StyledHeading>
      <PageWrapper>
        <OuterBox>
          <PlayButton onClick={handleResetQuiz}>PLAY</PlayButton>
        </OuterBox>
      </PageWrapper>
      <FooterNavigation />
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const StyledHeading = styled.h1`
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

const PageWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const OuterBox = styled.div`
  width: 100%;
  max-width: 600px;
  height: 250px;
  border: 3px solid black;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;

  @media (max-width: 768px) {
    height: 220px;
    max-width: 500px;
  }

  @media (max-width: 480px) {
    height: 180px;
    border: 2px solid black;
    padding: 0.75rem;
  }
`;

const PlayButton = styled.button`
  width: 80%;
  height: 60px;
  border: 2px solid black;
  background: white;
  font-size: 1.5rem;
  font-weight: bold;
  letter-spacing: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 1.3rem;
    height: 55px;
    width: 85%;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    height: 50px;
    width: 90%;
    letter-spacing: 1px;
  }
`;
