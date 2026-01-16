import Account from "@/components/Profile/Account";
import FooterNavigation from "@/components/Navigation/FooterNavigation";
import Login from "@/components/Profile/Login";

export default function ProfilePage() {
  return (
    <>
      <Login />
      <Account />
      <FooterNavigation />
    </>
  );
}
