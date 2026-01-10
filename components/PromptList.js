import Link from "next/link";
import styled from "styled-components";
import useSWR from "swr";

export default function PromptList({ handleBookmark }) {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  console.log(prompts);

  return (
    <>
      {prompts.map((prompt) => (
        <PromptLi key={prompt._id}>
          <p>{prompt.question}</p>
          <p>{prompt.answer}</p>

          {prompt.categories.map((category) => (
            <p key={category._id}>{category.name}</p>
          ))}
          <Link href={`/prompts/${prompt._id}`}>To Detail</Link>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            onClick={handleBookmark}
          >
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
          </svg>
        </PromptLi>
      ))}
    </>
  );
}

const PromptLi = styled.li`
  border: 5px solid black;
`;
