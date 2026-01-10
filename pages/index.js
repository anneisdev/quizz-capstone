import PromptForm from "@/components/PromptForm";
import PromptList from "@/components/PromptList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const { deleted } = router.query;
  const { data: session, status } = useSession();
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (deleted === "true") {
      setDeleteSuccessMessage("Successfully deleted.");
      router.replace("/");
    }
  }, [deleted, router]);

  useEffect(() => {
    if (deleteSuccessMessage) {
      const timer = setTimeout(() => {}, 5000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccessMessage]);

  if (status !== "authenticated") {
    return <h2>Access denied!</h2>;
  }

  function handleBookmark() {
    setBookmarked(true);

    if (bookmarked) {
      setBookmarked(false);
    }
    console.log(bookmarked);
  }

  return (
    <div>
      {deleteSuccessMessage && <p>{deleteSuccessMessage}</p>}
      <PromptList handleBookmark={handleBookmark} />
    </div>
  );
}
