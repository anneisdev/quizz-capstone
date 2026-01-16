import Link from "next/link";
import styled from "styled-components";

export default function FooterNavigation() {
  return (
    <>
      <StyledDiv>
        <Link href={"/"}>Home</Link>
        <Link href={"/quiz"}>Quiz</Link>
        <Link href={"/collection"}>Collection</Link>
        <Link href={"/create"}>Create</Link>
        <Link href={"/bookmarks"}>Bookmarks</Link>
        <Link href={"/profile"}>Profile</Link>
      </StyledDiv>
    </>
  );
}

const StyledDiv = styled.div`
  border: 5px solid black;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  position: fixed;
  bottom: 0;
  width: 100%;
  min-height: 5vh;
  background-color: white;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;
