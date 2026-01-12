import Link from "next/link";
import styled from "styled-components";

export default function HomeNavigation() {
  return (
    <>
      <StyledDiv>
        <StyledLink href={"/quiz"}>Quiz</StyledLink>
        <StyledLink href={"/collection"}>Collection</StyledLink>
        <StyledLink href={"/create"}>Create</StyledLink>
        <StyledLink href={"/profile"}>Profile</StyledLink>
      </StyledDiv>
    </>
  );
}

const StyledDiv = styled.div`
  border: 5px solid black;
  margin: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled(Link)`
  border: 5px solid black;
  padding: 5px;
  margin-top: 5px;
  margin-bottom: 5px;
  text-decoration: none;
  text-align: center;
`;
