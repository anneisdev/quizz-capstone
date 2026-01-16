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
    <>
      <TopNav>
        <StyledLink href="/quiz">Home</StyledLink>
      </TopNav>

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
      <p>
        {promptIndex + 1} / {prompts.length}
      </p>
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
  border: 3px solid black;
  padding: 30px;

  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Question = styled.p`
  font-size: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const AnswerInput = styled.input`
  height: 50px;
  border: 2px solid black;
  font-size: 18px;
  padding: 0 10px;
`;

const TopNav = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
`;

const NavButton = styled.button`
  flex: 1;
  height: 55px;

  border: 2px solid black;
  background: none;

  font-size: 16px;
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
`;

const SubmitButton = styled.button`
  flex: 2; /* Submit etwas wichtiger */
  height: 55px;

  border: 2px solid black;
  background: none;

  font-size: 18px;
  letter-spacing: 1px;
  cursor: pointer;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const StyledLink = styled(Link)`
  border: 2px solid black;
  padding: 6px 12px;
  text-decoration: none;
  color: black;
  font-size: 14px;

  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;
