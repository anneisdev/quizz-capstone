import Link from "next/link";
import styled from "styled-components";

export default function PromptDetail({
  data,
  onDelete,
  onEdit,
  onBookmark,
  isBookmarked,
}) {
  return (
    <PageWrapper>
      <BackButton href="/collection">← BACK</BackButton>
      <StyledHeading>QUESTION DETAILS</StyledHeading>

      <Container>
        <DetailCard>
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
            onClick={onBookmark}
          >
            <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
          </BookmarkIcon>

          <Content>
            <Section>
              <SectionLabel>Question:</SectionLabel>
              <Question>{data.question}</Question>
            </Section>

            <Section>
              <SectionLabel>Answer:</SectionLabel>
              <Answer>{data.answer}</Answer>
            </Section>

            <Section>
              <SectionLabel>Categories:</SectionLabel>
              <Categories>
                {data.categories.map((category) => (
                  <CategoryTag key={category._id}>{category.name}</CategoryTag>
                ))}
              </Categories>
            </Section>

            <ButtonContainer>
              <EditButton onClick={onEdit}>EDIT</EditButton>
              <DeleteButton onClick={onDelete}>DELETE</DeleteButton>
            </ButtonContainer>
          </Content>
        </DetailCard>
      </Container>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  position: relative;
  flex: 1;
`;

const BackButton = styled(Link)`
  position: absolute;
  top: 2rem;
  left: 2rem;
  padding: 0.5rem 1rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  color: black;
  cursor: pointer;
  display: inline-block;
  z-index: 10;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    top: 1rem;
    left: 1rem;
    padding: 0.4rem 0.8rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    top: 0.75rem;
    left: 0.75rem;
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const StyledHeading = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  padding: 5rem 2rem 2rem 2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    padding: 4rem 1rem 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    padding: 3.5rem 1rem 1rem 1rem;
    word-break: break-word;
  }
`;

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  padding: 0 2rem 2rem 2rem;

  @media (max-width: 768px) {
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 1rem 1rem 1rem;
  }
`;

const DetailCard = styled.div`
  border: 3px solid black;
  background-color: white;
  padding: 3rem;
  width: 100%;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem;
    border: 2px solid black;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
  }
`;

const BookmarkIcon = styled.svg`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    top: 1rem;
    right: 1rem;
  }

  @media (max-width: 480px) {
    width: 24px;
    height: 24px;
    top: 0.75rem;
    right: 0.75rem;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    gap: 1.25rem;
  }
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  @media (max-width: 480px) {
    gap: 0.375rem;
  }
`;

const SectionLabel = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const Question = styled.p`
  font-size: 1.5rem;
  margin: 0;
  padding: 1rem;
  border: 2px solid black;
  background-color: #fafafa;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.75rem;
  }
`;

const Answer = styled.p`
  font-size: 1.2rem;
  margin: 0;
  padding: 1rem;
  border: 2px solid black;
  background-color: #fafafa;
  word-break: break-word;

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.75rem;
  }
`;

const Categories = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    gap: 0.5rem;
  }
`;

const CategoryTag = styled.span`
  padding: 0.5rem 1rem;
  border: 2px solid black;
  background-color: #fafafa;
  font-size: 1rem;

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
`;

const EditButton = styled.button`
  padding: 0.75rem 2rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.5rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`;

const DeleteButton = styled.button`
  padding: 0.75rem 2rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #ffe0e0;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.5rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`;
