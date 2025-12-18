import { useState } from "react";

export default function PromptForm({ onSubmit }) {
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    const promptData = {
      question: formData.get("question"),
      answer: formData.get("answer"),
      category: formData.get("category"),
    };

    const success = await onSubmit(promptData);

    if (success) {
      event.target.reset();
    } else {
      return <p>Failed to create prompt. Please try again.</p>;
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="quiz-question">Question:</label>
      <input id="quiz-question" type="text" name="question" required />

      <label htmlFor="quiz-answer">Answer:</label>
      <input id="quiz-answer" type="text" name="answer" required />

      <label htmlFor="quiz-category">Category:</label>
      <input id="quiz-category" type="text" name="category" />

      <button type="submit">CREATE</button>
    </form>
  );
}
