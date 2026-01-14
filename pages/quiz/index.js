import FooterNavigation from "@/components/FooterNavigation";
import HomeNavigation from "@/components/HomeNavigation";
import Link from "next/link";
import styled from "styled-components";
import useSWR from "swr";

export default function QuizPage() {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  function handleResetQuiz() {
    localStorage.removeItem("quizAnswers");
  }

  console.log(localStorage);
  return (
    <>
      <StyledWrapper>
        <StyledLink href={`/quiz/${prompts[0]._id}`} onClick={handleResetQuiz}>
          Play
        </StyledLink>
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
  height: 200px;
  border: 3px solid green;
`;
