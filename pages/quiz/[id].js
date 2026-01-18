import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

export default function QuizCardPage() {
  const router = useRouter();
  const { id } = router.query;
  const { data: prompts } = useSWR("/api/prompts");
  const { data: prompt, isLoading, error } = useSWR(`/api/prompts/${id}`);
  const [submittedAnswers, setSubmittedAnswers] = useLocalStorageState(
    "quizAnswers",
    { defaultValue: {} }
  );
  //if || "" isnt used, react error appears = attempt to change undefined to defined
  const [currentAnswer, setCurrentAnswer] = useState(
    submittedAnswers[id] || ""
  );

  //had to use useeffect, as previously submitted answer wouldnt be displayed otherwise
  useEffect(() => {
    setCurrentAnswer(submittedAnswers[id] || "");
  }, [id, submittedAnswers]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompt) return null;

  const promptIndex = prompts?.findIndex((p) => p._id === id);
  const nextI = prompts[promptIndex + 1]?._id;
  const prevI = prompts[promptIndex - 1]?._id;
  const lastI = promptIndex === prompts.length - 1;

  function handleSubmitAnswer(event) {
    event.preventDefault();
    setSubmittedAnswers({
      ...submittedAnswers,
      [id]: currentAnswer,
    });

    if (lastI) {
      router.push("/quiz/result");
    }
    if (nextI) {
      setCurrentAnswer("");
      router.push(`/quiz/${nextI}`);
    }
  }

  return (
    <PageContainer>
      <TopBar>
        <HomeButton href="/quiz">Home</HomeButton>
      </TopBar>

      <Header>QUIZ GAME</Header>

      <PageWrapper>
        <OuterBox>
          <Question>{prompt.question}</Question>

          <Form onSubmit={handleSubmitAnswer}>
            <AnswerInput
              type="text"
              value={currentAnswer}
              onChange={(event) => setCurrentAnswer(event.target.value)}
              placeholder="Your answer..."
              required
            />

            <ButtonRow>
              {prevI && (
                <NavButton as={Link} href={`/quiz/${prevI}`}>
                  PREVIOUS
                </NavButton>
              )}

              <SubmitButton type="submit">
                {lastI ? "FINISH" : "SUBMIT & NEXT"}
              </SubmitButton>
            </ButtonRow>
          </Form>
        </OuterBox>
      </PageWrapper>

      <Pagination>
        {promptIndex + 1} / {prompts.length}
      </Pagination>
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  position: relative;
`;

const TopBar = styled.div`
  position: absolute;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 10;

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
  }

  @media (max-width: 480px) {
    top: 0.75rem;
    left: 0.75rem;
  }
`;

const HomeButton = styled(Link)`
  border: 2px solid black;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: black;
  font-size: 1rem;
  background-color: white;
  display: inline-block;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.85rem;
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
    font-size: 1.5rem;
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
  width: 70%;
  max-width: 600px;
  border: 3px solid black;
  padding: 2rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (max-width: 768px) {
    width: 85%;
    padding: 1.5rem;
    gap: 1.25rem;
  }

  @media (max-width: 480px) {
    width: 95%;
    padding: 1rem;
    gap: 1rem;
    border: 2px solid black;
  }
`;

const Question = styled.p`
  font-size: 1.5rem;
  text-align: center;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.875rem;
  }
`;

const AnswerInput = styled.input`
  height: 50px;
  border: 2px solid black;
  font-size: 1.1rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    height: 48px;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    height: 45px;
    font-size: 0.95rem;
    padding: 0 0.75rem;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.75rem;
    flex-direction: column;
  }
`;

const NavButton = styled.button`
  flex: 1;
  height: 55px;
  border: 2px solid black;
  background: white;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: black;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    height: 50px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    height: 48px;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }
`;

const SubmitButton = styled.button`
  flex: 2;
  height: 55px;
  border: 2px solid black;
  background: white;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    height: 50px;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    flex: 1;
    height: 48px;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
  }
`;

const Pagination = styled.p`
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  padding: 2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 1rem;
  }
`;
