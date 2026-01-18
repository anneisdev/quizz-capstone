import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";
import Login from "./Login";
import Image from "next/image";

export default function Account() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const { data: prompts } = useSWR("/api/prompts");

  useEffect(() => {
    if (!session) return;

    fetch(`/api/users/${session.user.id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [session]);

  if (status === "loading") return <p>Loading session…</p>;
  if (!session) return <p>Please log in</p>;
  if (!user) return <p>Loading user…</p>;

  const userPrompts = prompts?.filter(
    (prompt) => prompt.owner === user.authProviderId
  );

  //<Image src={session.user.image} width={50} height={50} alt={user.name}></Image>

  return (
    <Container>
      <BoxContainer>
        <Box>
          <BoxTitle>SUMMARY</BoxTitle>
          <InfoList>
            <InfoItem>
              HIGHSCORE: {user?.highscore} / {prompts?.length}
            </InfoItem>
            <InfoItem>BOOKMARKS: {user?.bookmarks.length}</InfoItem>
            <InfoItem>MY PROMPTS: {userPrompts?.length || 0}</InfoItem>
            <InfoItem>USERNAME: {session?.user.name}</InfoItem>
          </InfoList>
        </Box>

        <Box>
          <BoxTitle>ACTIONS</BoxTitle>
          <ButtonContainer>
            <ActionButton>Darkmode</ActionButton>
            <Login />
          </ButtonContainer>
        </Box>
      </BoxContainer>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const BoxContainer = styled.div`
  display: flex;
  gap: 2rem;
  max-width: 1000px;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    max-width: 600px;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Box = styled.div`
  flex: 1;
  border: 3px solid black;
  background-color: white;
  padding: 2rem;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    padding: 1.5rem;
    border: 2px solid black;
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

const BoxTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  text-align: center;
  margin: 0 0 2rem 0;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    margin: 0 0 1.5rem 0;
  }

  @media (max-width: 480px) {
    font-size: 1.2rem;
    margin: 0 0 1.25rem 0;
  }
`;

const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 480px) {
    gap: 0.875rem;
  }
`;

const InfoItem = styled.p`
  font-size: 1rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    margin-top: 1rem;
    gap: 0.875rem;
    width: 100%;
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
