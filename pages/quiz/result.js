import useSWR from "swr";
import useLocalStorageState from "use-local-storage-state";

export default function QuizResultPage() {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const [submittedAnswers, setSubmittedAnswers] = useLocalStorageState(
    "quizAnswers",
    { defaultValue: {} }
  );

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

  console.log(localStorage);
  console.log(results);

  return (
    <>
      <p>
        Result:{correctCount} / {results.length}
      </p>
    </>
  );
}



//wenn correctcount größer als user highscore ist, dann correctcount = userhighscore