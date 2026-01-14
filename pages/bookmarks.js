import FooterNavigation from "@/components/FooterNavigation";
import PromptList from "@/components/PromptList";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function BookmarkPage() {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const { data: session, status } = useSession();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  async function handleBookmark() {
    console.log("bookmarked");
  }

  console.log(session);

  return (
    <>
      <PromptList handleBookmark={handleBookmark} prompts={prompts} />;
      <FooterNavigation />
    </>
  );
}
