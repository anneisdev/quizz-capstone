import FooterNavigation from "@/components/FooterNavigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

export default function QuizResultPage() {
  const { data: session, status } = useSession();
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const [submittedAnswers, setSubmittedAnswers] = useLocalStorageState(
    "quizAnswers",
    { defaultValue: {} }
  );
  const [correctCount, setCorrectCount] = useState(0);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  let count = 0
  const results = prompts.map((prompt) => {
    const userAnswer = submittedAnswers[prompt._id];
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

  useEffect(() => {

    setCorrectCount(count)
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
  }, [session, count]);


  return (
    <>
      <p>
        Result:{count} / {results.length}
      </p>
      <FooterNavigation />
    </>
  );
}
