import FooterNavigation from "@/components/Navigation/FooterNavigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
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

  return (
    <>
      <p>Total: {results.length}</p>
      <p>Correct: {count}</p>
      <p>Incorrect: {results.length - count}</p>
      <p>leaderboard:</p>
      <ul>
        {leaderboardData?.map((user, index) => (
          <li key={user._id}>
            {index + 1}. {user.name}: {user.highscore}{" "}
          </li>
        ))}
      </ul>
      <FooterNavigation />
    </>
  );
}
