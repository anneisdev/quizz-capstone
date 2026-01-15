import FooterNavigation from "@/components/FooterNavigation";
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
      <StyledWrapper>
        <button onClick={handleResetQuiz}>Play</button>
      </StyledWrapper>
      <FooterNavigation />
    </>
  );
}

const StyledLink = styled(Link)`
  font-size: 28px;
`;

const StyledWrapper = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  border: 3px solid black;
`;
