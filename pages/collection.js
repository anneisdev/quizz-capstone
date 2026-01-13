import FooterNavigation from "@/components/FooterNavigation";
import HomeNavigation from "@/components/HomeNavigation";
import PromptList from "@/components/PromptList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function CollectionPage() {
  const router = useRouter();
  const { deleted } = router.query;
  const { data: session, status } = useSession();
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState("");
  const [query, setQuery] = useState("");
  const { data: prompts, isLoading, error } = useSWR("/api/prompts");

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

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!prompts) return null;

  if (status !== "authenticated") {
    return <h2>Access denied!</h2>;
  }

  async function handleBookmark() {
    console.log("bookmarked");
  }

  function handleFilter(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    if (data.query) {
      setQuery(data.query);
    } else {
      setQuery("");
    }
    event.reset;
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const lowerCaseQuery = query.toLocaleLowerCase();
    const filteredQ = prompt.question
      .toLocaleLowerCase()
      .includes(lowerCaseQuery);
    const filteredA = prompt.answer
      .toLocaleLowerCase()
      .includes(lowerCaseQuery);
    const filteredC = prompt.categories.some((category) =>
      category.name.toLowerCase().includes(lowerCaseQuery)
    );

    return filteredA || filteredQ || filteredC;
  });

  return (
    <div>
      {deleteSuccessMessage && <p>{deleteSuccessMessage}</p>}
      <form onSubmit={handleFilter}>
        <label>Filter:</label>
        <input type="text" name="query"></input>
        <button type="submit">Submit</button>
      </form>
      {filteredPrompts.length === 0 && (
        <p>
          Sorry we couldn´t retrieve the latest prompts at the moment. Please
          try again later.
        </p>
      )}
      <PromptList handleBookmark={handleBookmark} prompts={filteredPrompts} />
      <FooterNavigation />
    </div>
  );
}
