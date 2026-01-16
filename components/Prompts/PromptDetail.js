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
        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
      </svg>
      <button onClick={onDelete}>DELETE</button>
      <button onClick={onEdit}>EDIT</button>
    </>
  );
}
