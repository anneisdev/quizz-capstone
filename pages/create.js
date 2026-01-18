import FooterNavigation from "@/components/Navigation/FooterNavigation";
import PromptForm from "@/components/Prompts/PromptForm";
import styled from "styled-components";
import useSWR from "swr";

export default function CreatePage() {
  const { mutate } = useSWR("/api/prompts");

  async function handleCreatePrompt(promptData) {
    const response = await fetch("/api/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(promptData),
    });

    if (response.ok) {
      mutate();
      return true;
    }
    return false;
  }

  return (
    <>
      <StyledHeadline>CREATE A QUESTION</StyledHeadline>
      <PromptForm onSubmit={handleCreatePrompt} />
      <FooterNavigation />
    </>
  );
}

const StyledHeadline = styled.h1`
  text-align: center;
`;
