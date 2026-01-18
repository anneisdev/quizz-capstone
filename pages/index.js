import HomeNavigation from "@/components/Navigation/HomeNavigation";
import styled from "styled-components";

export default function HomePage() {
  return (
    <PageContainer>
      <StyledHeading>QUIZ APP</StyledHeading>
      <HomeNavigation />
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
`;

const StyledHeading = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  padding: 2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    padding: 1rem;
  }
`;
