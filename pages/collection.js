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
  const { data: userData } = useSWR(
    session?.user?.id ? `/api/users/${session.user.id}` : null
  );
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (userData?.bookmarks) {
      setBookmarks(userData.bookmarks);
    }
  }, [userData]);

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

  function handleCategoryFilter(categoryName) {
    setSelectedCategory(categoryName);
  }

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesCategory = selectedCategory
      ? prompt.categories.some((category) => category.name === selectedCategory)
      : true;

    const lowerCaseQuery = query.toLocaleLowerCase();
    const matchesQuery =
      query === ""
        ? true
        : prompt.question.toLocaleLowerCase().includes(lowerCaseQuery) ||
          prompt.answer.toLocaleLowerCase().includes(lowerCaseQuery) ||
          prompt.categories.some((category) =>
            category.name.toLowerCase().includes(lowerCaseQuery)
          );

    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      {deleteSuccessMessage && <p>{deleteSuccessMessage}</p>}
      <form onSubmit={handleFilter}>
        <label>Filter:</label>
        <input type="text" name="query"></input>
        <button type="submit">Submit</button>
      </form>
      <button onClick={() => handleCategoryFilter(null)}>All Categories</button>
      <button onClick={() => handleCategoryFilter("History")}>History</button>
      <button onClick={() => handleCategoryFilter("Science")}>Science</button>
      <button onClick={() => handleCategoryFilter("Geography")}>
        Geography
      </button>
      <button onClick={() => handleCategoryFilter("Politics")}>Politics</button>
      {filteredPrompts.length === 0 && (
        <p>
          Sorry we couldn´t retrieve the latest prompts at the moment. Please
          try again later.
        </p>
      )}
      <PromptList
        handleBookmark={handleBookmark}
        prompts={filteredPrompts}
        bookmarks={bookmarks}
      />
      <FooterNavigation />
    </div>
  );
}
