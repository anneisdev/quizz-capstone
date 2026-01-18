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
    <>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <FormContainer>
        <StyledForm onSubmit={handleSubmit}>
          <FormBox>
            <FormRow>
              <Label>Question:</Label>
              <Input
                id="quiz-question"
                type="text"
                name="question"
                defaultValue={initialData?.question}
                placeholder="What year did world war II end?"
                required
              />
            </FormRow>

            <FormRow>
              <Label>Answer:</Label>
              <Input
                id="quiz-answer"
                type="text"
                name="answer"
                defaultValue={initialData?.answer}
                placeholder="1945"
                required
              />
            </FormRow>

            <FormRow>
              <Label>Categories:</Label>
              <CategoryGrid>
                {categories.map((category) => (
                  <CheckboxLabel key={category._id}>
                    <Checkbox
                      type="checkbox"
                      name="categories"
                      value={category._id}
                      defaultChecked={initialData?.categories.some(
                        (c) => c._id === category._id
                      )}
                    />
                    {category.name}
                  </CheckboxLabel>
                ))}
              </CategoryGrid>
            </FormRow>

            <ButtonContainer>
              <SubmitButton type="submit">
                {initialData ? "UPDATE" : "ADD"}
              </SubmitButton>
              {onCancel && (
                <CancelButton type="button" onClick={onCancel}>
                  CANCEL
                </CancelButton>
              )}
            </ButtonContainer>
          </FormBox>
        </StyledForm>
      </FormContainer>
    </>
  );
}

const FormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const StyledForm = styled.form`
  width: 100%;
  max-width: 1200px;
`;

const FormBox = styled.div`
  border: 3px solid black;
  padding: 3rem;
  background-color: white;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (max-width: 768px) {
    padding: 2rem;
    gap: 1.5rem;
    border: 2px solid black;
  }

  @media (max-width: 480px) {
    padding: 1.5rem;
    gap: 1.25rem;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  align-items: start;
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 150px 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const Label = styled.label`
  font-size: 1.5rem;
  font-weight: normal;
  padding-top: 0.5rem;

  @media (max-width: 768px) {
    font-size: 1.3rem;
    padding-top: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding-top: 0;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid black;
  font-size: 1rem;
  width: 100%;

  &::placeholder {
    color: #999;
  }

  @media (max-width: 768px) {
    padding: 0.625rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
    font-size: 0.9rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;

  @media (max-width: 480px) {
    width: 18px;
    height: 18px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.75rem;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`;

const CancelButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid black;
  background-color: white;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  flex: 1;

  &:hover {
    background-color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 0.875rem 1.75rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
`;

const SuccessMessage = styled.p`
  color: green;
  font-weight: bold;
  margin-top: 1rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-top: 0.75rem;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-weight: bold;
  margin-top: 1rem;
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.95rem;
    margin-top: 0.75rem;
  }
`;
