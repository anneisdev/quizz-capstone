import Link from "next/link";
import styled from "styled-components";

export default function PromptList({ handleBookmark, prompts, bookmarks }) {
  return (
    <PromptGrid>
      {prompts.map((prompt) => {
        const isBookmarked = bookmarks.includes(prompt._id);

        return (
          <PromptCard key={prompt._id}>
            <BookmarkIcon
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill={isBookmarked ? "#ffeb3b" : "none"}
              stroke="black"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={(e) => {
                e.preventDefault();
                handleBookmark(prompt._id);
              }}
            >
              <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
            </BookmarkIcon>

            <StyledLink href={`/prompts/${prompt._id}`}>
              <Question>{prompt.question}</Question>
              <Answer>Show Answer</Answer>
              <Categories>
                {prompt.categories.map((category) => (
                  <CategoryTag key={category._id}>{category.name}</CategoryTag>
                ))}
              </Categories>
            </StyledLink>
          </PromptCard>
        );
      })}
    </PromptGrid>
  );
}

const PromptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 1.25rem;
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const PromptCard = styled.div`
  border: 3px solid black;
  background-color: white;
  padding: 2rem;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  position: relative;

  @media (max-width: 768px) {
    padding: 1.5rem;
    min-height: 180px;
    border: 2px solid black;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
    min-height: 160px;
  }
`;

const BookmarkIcon = styled.svg`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    top: 0.875rem;
    right: 0.875rem;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    top: 0.75rem;
    right: 0.75rem;
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: black;
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const Question = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin: 0 0 0.875rem 0;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    margin: 0 0 0.75rem 0;
  }
`;

const Answer = styled.p`
  font-size: 1.2rem;
  margin: 1rem 0;
  text-align: center;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    margin: 0.875rem 0;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    margin: 0.75rem 0;
  }
`;

const Categories = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`;

const CategoryTag = styled.span`
  font-size: 0.9rem;
  color: #666;

  @media (max-width: 480px) {
    font-size: 0.85rem;
  }
`;
