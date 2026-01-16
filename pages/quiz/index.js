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
    <>
      <PageWrapper>
        <OuterBox>
          <PlayButton onClick={handleResetQuiz}>PLAY</PlayButton>
        </OuterBox>
      </PageWrapper>
      <FooterNavigation />
    </>
  );
}

const PageWrapper = styled.div`
  height: calc(100vh - 70px);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OuterBox = styled.div`
  width: 70%;
  max-width: 600px;
  height: 250px;
  border: 3px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PlayButton = styled.button`
  width: 80%;
  height: 60px;

  border: 2px solid black;
  background: none;

  font-size: 24px;
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
`;
