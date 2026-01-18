import Link from "next/link";
import styled from "styled-components";

export default function HomeNavigation() {
  return (
    <CenterWrapper>
      <NavigationBox>
        <StyledLink href="/quiz">QUIZ</StyledLink>
        <StyledLink href="/collection">COLLECTION</StyledLink>
        <StyledLink href="/bookmarks">BOOKMARKS</StyledLink>
        <StyledLink href="/create">CREATE</StyledLink>
        <StyledLink href="/profile">PROFILE</StyledLink>
      </NavigationBox>
    </CenterWrapper>
  );
}

const CenterWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const NavigationBox = styled.div`
  border: 3px solid black;
  background-color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 600px;

  @media (max-width: 768px) {
    padding: 1.5rem;
    max-width: 500px;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.75rem;
    border: 2px solid black;
  }
`;

const StyledLink = styled(Link)`
  border: 2px solid black;
  padding: 1rem;
  text-decoration: none;
  text-align: center;
  color: black;
  font-size: 1.2rem;
  font-weight: bold;
  background-color: white;
  transition: background-color 0.2s ease;
  min-height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #e0e0e0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 0.875rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.75rem;
    min-height: 48px;
  }
`;
