import Account from "@/components/Profile/Account";
import FooterNavigation from "@/components/Navigation/FooterNavigation";
import Login from "@/components/Profile/Login";
import styled from "styled-components";

export default function ProfilePage() {
  return (
    <PageContainer>
      <Header>MY PROFILE</Header>
      <Account />
      <FooterNavigation />
    </PageContainer>
  );
}

const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding-bottom: 60px;

  @media (max-width: 768px) {
    padding-bottom: 55px;
  }

  @media (max-width: 480px) {
    padding-bottom: 50px;
  }
`;

const Header = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  padding: 2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
    padding: 1rem;
  }
`;
