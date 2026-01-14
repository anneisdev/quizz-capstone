import FooterNavigation from "@/components/FooterNavigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

export default function QuizResultPage() {
  const { data: session, status } = useSession();
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const [submittedAnswers, setSubmittedAnswers] = useLocalStorageState(
    "quizAnswers",
    { defaultValue: {} }
  );

  useEffect(() => {
    async function saveNewHighScore() {
      try {
        await fetch(`/api/users/${session.user.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newScore: correctCount,
          }),
        });
      } catch (error) {
        console.error("Failed to save highscore:", error);
      }
    }

    saveNewHighScore();
  }, [session, correctCount]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  let correctCount = 0;
  const results = prompts.map((prompt) => {
    const userAnswer = submittedAnswers[prompt._id];
    const isCorrect =
      userAnswer.trim().toLowerCase() === prompt.answer.trim().toLowerCase();

    if (isCorrect) {
      correctCount++;
    }

    return {
      question: prompt.question,
      correctAnswer: prompt.answer,
      userAnswer,
      isCorrect,
    };
  });

  return (
    <>
      <p>
        Result:{correctCount} / {results.length}
      </p>
      <FooterNavigation />
    </>
  );
}
