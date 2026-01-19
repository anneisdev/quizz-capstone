import Account from "@/components/Profile/Account";
import FooterNavigation from "@/components/Navigation/FooterNavigation";
import Login from "@/components/Profile/Login";
import styled from "styled-components";

export default function ProfilePage() {
  return (
    <PageContainer>
      <HeaderWrapper>
        <Header>MY PROFILE</Header>
        <LogoutButtonWrapper>
          <Login />
        </LogoutButtonWrapper>
      </HeaderWrapper>
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

const HeaderWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const Header = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const LogoutButtonWrapper = styled.div`
  position: absolute;
  right: 2rem;

  @media (max-width: 768px) {
    right: 1rem;
  }

  @media (max-width: 480px) {
    right: 0.75rem;
  }
`;
