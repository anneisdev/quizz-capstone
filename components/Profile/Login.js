import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return <LogoutButton onClick={() => signOut()}>LOGOUT</LogoutButton>;
  }
  return <LoginButton onClick={() => signIn()}>LOGIN</LoginButton>;
}

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
  }
`;

const LoginButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
  }
`;
