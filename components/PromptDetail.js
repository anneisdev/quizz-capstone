export default function PromptDetail({
  data,
  onDelete,
  onEdit,
  onBookmark,
  isBookmarked,
}) {
  return (
    <>
      <p>{data.question}</p>
      <p>{data.answer}</p>
      {data.categories.map((category) => (
        <p key={category._id}>{category.name}</p>
      ))}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isBookmarked ? "black" : "none"}
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        onClick={onBookmark}
      >
        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
      <button onClick={onDelete}>DELETE</button>
      <button onClick={onEdit}>EDIT</button>
    </>
  );
}
