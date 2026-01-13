import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
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

  const promptIndex = prompts.findIndex((p) => p._id === id);
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

  function handleAnswerChange(event) {
    setCurrentAnswer(event.target.value);
  }

  console.log(currentAnswer);

  return (
    <>
      <Link href={"/quiz"}>Home </Link>
      <form onSubmit={handleSubmitAnswer}>
        <p>{prompt.question}</p>
        <input
          type="text"
          value={currentAnswer}
          onChange={handleAnswerChange}
          required
        ></input>
        <button type="submit">{lastI ? "Finish" : "Submit & Next"}</button>
      </form>
      <br></br>
      {prevI && <Link href={`/quiz/${prevI}`}>Previous</Link>}
    </>
  );
}

export async function getServerSideProps() {
  return { props: {} };
}
