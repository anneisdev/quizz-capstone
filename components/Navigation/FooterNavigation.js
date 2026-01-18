import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";

export default function FooterNavigation() {
  const router = useRouter();

  return (
    <FooterWrapper>
      <NavLink href={"/"}>Home</NavLink>
      <NavLink href={"/quiz"} $active={router.pathname === "/quiz"}>
        Quiz
      </NavLink>
      <NavLink href={"/collection"} $active={router.pathname === "/collection"}>
        Collection
      </NavLink>
      <NavLink href={"/create"} $active={router.pathname === "/create"}>
        Create
      </NavLink>
      <NavLink href={"/bookmarks"} $active={router.pathname === "/bookmarks"}>
        Bookmarks
      </NavLink>
      <NavLink href={"/profile"} $active={router.pathname === "/profile"}>
        Profile
      </NavLink>
    </FooterWrapper>
  );
}

const FooterWrapper = styled.nav`
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  display: flex;
  border-top: 3px solid black;
  background-color: white;
  z-index: 100;

  @media (max-width: 768px) {
    height: 55px;
    border-top: 2px solid black;
  }

  @media (max-width: 480px) {
    height: 50px;
  }
`;

const NavLink = styled(Link)`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  font-weight: 500;
  text-decoration: none;
  color: black;
  border-right: ${({ $active }) => ($active ? "3px solid black" : "none")};
  border-left: ${({ $active }) => ($active ? "3px solid black" : "none")};
  background-color: ${({ $active }) => ($active ? "#ffeb3b" : "white")};
  transition: background-color 0.2s ease;
  padding: 0 0.5rem;

  &:last-child {
    border-right: none;
  }

  &:hover {
    background-color: ${({ $active }) => ($active ? "#fff3b0" : "#e0e0e0")};
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    border-right: ${({ $active }) => ($active ? "2px solid black" : "none")};
    border-left: ${({ $active }) => ($active ? "2px solid black" : "none")};
    padding: 0 0.375rem;
  }

  @media (max-width: 480px) {
    font-size: 0.875rem;
    padding: 0 0.25rem;
  }

  @media (max-width: 380px) {
    font-size: 0.75rem;
    padding: 0 0.125rem;
  }
`;
