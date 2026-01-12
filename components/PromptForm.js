import { useEffect, useState } from "react";
import styled from "styled-components";
import useSWR from "swr";

export default function PromptForm({ onSubmit, initialData, onCancel }) {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: categories, isLoading, error } = useSWR("/api/categories");

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data.</p>;
  if (!categories) return null;

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const categoriesArray = formData.getAll("categories");

    if (categoriesArray.length === 0) {
      setErrorMessage("Please select at least one category.");
      return;
    }

    const promptData = {
      question: formData.get("question"),
      answer: formData.get("answer"),
      categories: categoriesArray,
    };

    const success = await onSubmit(promptData);

    if (success) {
      event.target.reset();
      setSuccessMessage("Successfully created");
      setErrorMessage("");
    } else {
      setErrorMessage("Something went wrong. Please try again.");
      setSuccessMessage("");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <StyledDiv>
        <label htmlFor="quiz-question">Question:</label>
        <input
          id="quiz-question"
          type="text"
          name="question"
          defaultValue={initialData?.question}
          required
        />

        <label htmlFor="quiz-answer">Answer:</label>
        <input
          id="quiz-answer"
          type="text"
          name="answer"
          defaultValue={initialData?.answer}
          required
        />

        <p>Category:</p>
        <ul>
          {categories.map((category) => (
            <li key={category._id}>
              <label>
                <input
                  type="checkbox"
                  name="categories"
                  value={category._id}
                  defaultChecked={initialData?.categories.some(
                    (c) => c._id === category._id
                  )}
                />
                {category.name}
              </label>
            </li>
          ))}
        </ul>
      </StyledDiv>

      <button type="submit"> {initialData ? "UPDATE" : "CREATE"}</button>
      {onCancel && (
        <button type="button" onClick={onCancel}>
          CANCEL
        </button>
      )}
      {successMessage && <p>{successMessage}</p>}
    </form>
  );
}

const StyledDiv = styled.div`
  border: 5px solid black;
  display: flex;
  flex-direction: column;
`;
