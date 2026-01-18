import { useSession, signIn, signOut } from "next-auth/react";
import styled from "styled-components";

export default function Login() {
  const { data: session } = useSession();

  if (session) {
    return (
      <>
        <ActionButton onClick={() => signOut()}>Sign out</ActionButton>
      </>
    );
  }
  return (
    <LoginWrapper>
      <LoginText>Not signed in</LoginText>
      <ActionButton onClick={() => signIn()}>Sign in</ActionButton>
    </LoginWrapper>
  );
}

const LoginWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    width: 100%;
  }
`;

const LoginText = styled.p`
  margin: 0;
  font-size: 1rem;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ActionButton = styled.button`
  padding: 0.75rem 2rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  min-width: 150px;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 0.625rem 1.75rem;
    font-size: 0.95rem;
    min-width: 140px;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    width: 100%;
    max-width: 250px;
    min-width: unset;
  }
`;
