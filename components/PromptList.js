import Link from "next/link";
import styled from "styled-components";
import useSWR from "swr";

export default function PromptList() {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  return (
    <>
      {prompts.map((prompt) => (
        <PromotLi key={prompt._id}>
          <p>{prompt.question}</p>
          <p>{prompt.answer}</p>

          {prompt.categories.map((category) => (
            <p key={category._id}>{category.name}</p>
          ))}
          <Link href={`/prompts/${prompt._id}`}>To Detail</Link>
        </PromotLi>
      ))}
    </>
  );
}

const PromotLi = styled.li`
  border: 5px solid black;
`;
