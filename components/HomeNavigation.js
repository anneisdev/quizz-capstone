import Link from "next/link";
import styled from "styled-components";

export default function HomeNavigation() {
  return (
    <>
      <CenterWrapper>
        <StyledDiv>
          <StyledLink href={"/quiz"}>QUIZ</StyledLink>
          <StyledLink href={"/collection"}>COLLECTION</StyledLink>
          <StyledLink href={"/bookmarks"}>BOOKMARKS </StyledLink>
          <StyledLink href={"/create"}>CREATE</StyledLink>
          <StyledLink href={"/profile"}>PROFILE</StyledLink>
        </StyledDiv>
      </CenterWrapper>
    </>
  );
}

const CenterWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledDiv = styled.div`
  border: 3px solid black;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  width: 80vw;
`;

const StyledLink = styled(Link)`
  border: 3px solid black;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  text-decoration: none;
  text-align: center;
  color: black;

  background-color: white;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #e0e0e0;
  }
`;
