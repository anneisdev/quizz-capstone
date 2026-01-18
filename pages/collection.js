import FooterNavigation from "@/components/Navigation/FooterNavigation";
import HomeNavigation from "@/components/Navigation/HomeNavigation";
import PromptList from "@/components/Prompts/PromptList";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
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
    <PageContainer>
      <StyledHeading>QUIZ COLLECTION</StyledHeading>
      {deleteSuccessMessage && (
        <SuccessMessage>{deleteSuccessMessage}</SuccessMessage>
      )}

      <MainContent>
        <Sidebar>
          <SidebarTitle>FILTER BY CATEGORY</SidebarTitle>
          <CategoryButton
            onClick={() => handleCategoryFilter(null)}
            $active={selectedCategory === null}
          >
            ALL CATEGORIES
          </CategoryButton>
          <CategoryButton
            onClick={() => handleCategoryFilter("History")}
            $active={selectedCategory === "History"}
          >
            History
          </CategoryButton>
          <CategoryButton
            onClick={() => handleCategoryFilter("Science")}
            $active={selectedCategory === "Science"}
          >
            Science
          </CategoryButton>
          <CategoryButton
            onClick={() => handleCategoryFilter("Geography")}
            $active={selectedCategory === "Geography"}
          >
            Geography
          </CategoryButton>
          <CategoryButton
            onClick={() => handleCategoryFilter("Politics")}
            $active={selectedCategory === "Politics"}
          >
            Politics
          </CategoryButton>
        </Sidebar>

        <ContentArea>
          <FilterForm onSubmit={handleFilter}>
            <FilterLabel>FILTER:</FilterLabel>
            <FilterInput type="text" name="query" />
            <SubmitButton type="submit">SUBMIT</SubmitButton>
          </FilterForm>

          {filteredPrompts.length === 0 && (
            <NoResults>
              Sorry we couldn´t retrieve the latest prompts at the moment.
              Please try again later.
            </NoResults>
          )}

          <PromptList
            handleBookmark={handleBookmark}
            prompts={filteredPrompts}
            bookmarks={bookmarks}
          />
        </ContentArea>
      </MainContent>

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

const StyledHeading = styled.h1`
  text-align: center;
  font-size: 2.5rem;
  font-weight: bold;
  padding: 2rem;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 1.5rem 1rem;
  }

  @media (max-width: 480px) {
    font-size: 1.75rem;
    padding: 1rem;
  }
`;

const SuccessMessage = styled.p`
  text-align: center;
  color: green;
  font-weight: bold;
  margin: 0 0 1rem 0;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  gap: 2rem;
  padding: 0 2rem 2rem 2rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 1024px) {
    flex-direction: column;
    padding: 0 1.5rem 1.5rem 1.5rem;
  }

  @media (max-width: 768px) {
    gap: 1.5rem;
    padding: 0 1rem 1rem 1rem;
  }

  @media (max-width: 480px) {
    gap: 1rem;
  }
`;

const Sidebar = styled.div`
  border: 3px solid black;
  padding: 1.5rem;
  width: 300px;
  height: fit-content;
  background-color: white;

  @media (max-width: 1024px) {
    width: 100%;
    padding: 1.25rem;
  }

  @media (max-width: 768px) {
    border: 2px solid black;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const SidebarTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin: 0 0 0.875rem 0;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin: 0 0 0.75rem 0;
  }
`;

const CategoryButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border: 2px solid black;
  background-color: ${(props) => (props.$active ? "#ffeb3b" : "white")};
  cursor: pointer;
  font-size: 1rem;
  text-align: left;

  &:hover {
    background-color: ${(props) => (props.$active ? "#fff3b0" : "#f0f0f0")};
  }

  @media (max-width: 768px) {
    padding: 0.625rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.9rem;
    margin-bottom: 0.375rem;
  }
`;

const ContentArea = styled.div`
  flex: 1;
`;

const FilterForm = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
`;

const FilterLabel = styled.label`
  font-weight: bold;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    width: 100%;
    text-align: center;
  }
`;

const FilterInput = styled.input`
  padding: 0.5rem;
  border: 2px solid black;
  font-size: 1rem;
  width: 300px;

  @media (max-width: 768px) {
    width: 250px;
  }

  @media (max-width: 480px) {
    width: 100%;
    font-size: 0.95rem;
  }
`;

const SubmitButton = styled.button`
  padding: 0.5rem 1.5rem;
  border: 2px solid black;
  background-color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1.25rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 0.625rem 1rem;
  }
`;

const NoResults = styled.p`
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
    font-size: 0.95rem;
  }
`;
