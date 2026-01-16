import FooterNavigation from "@/components/Navigation/FooterNavigation";
import PromptList from "@/components/Prompts/PromptList";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function BookmarkPage() {
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");
  const { data: session, status } = useSession();
  const { data: userData } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}` : null
  );
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    if (userData?.bookmarks) {
      setBookmarks(userData.bookmarks);
    }
  }, [userData]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  async function handleBookmark(promptId) {
    try {
      const response = await fetch(`/api/users/${session.user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          promptId: promptId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setBookmarks(data.bookmarks);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark", error);
    }
  }

  const bookmarkedPrompts = prompts.filter((prompt) =>
    bookmarks.includes(prompt._id)
  );

  return (
    <>
      {bookmarkedPrompts.length === 0 && (
        <p>You haven´t bookmarked any prompts yet.</p>
      )}
      {bookmarkedPrompts.length > 0 && (
        <PromptList
          handleBookmark={handleBookmark}
          prompts={bookmarkedPrompts}
          bookmarks={bookmarks}
        />
      )}
      <FooterNavigation />
    </>
  );
}
