import FooterNavigation from "@/components/FooterNavigation";
import HomeNavigation from "@/components/HomeNavigation";
import Link from "next/link";
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
      <Link href={`/quiz/${prompts[0]._id}`} onClick={handleResetQuiz}>
        Play
      </Link>
      <FooterNavigation />
    </>
  );
}
