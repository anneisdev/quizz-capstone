import Link from "next/link";

export default function Navigation() {
  return (
    <>
      <ul>
        <li>
          <Link href={"/create"}>Create</Link>
        </li>
        <li>
          <Link href={"/profile"}>Profile</Link>
        </li>
        <li>
          <Link href={"/collection"}>Collection</Link>
        </li>
        <li>
          <Link href={"/quiz"}>Quiz</Link>
        </li>
        <li>
          <Link href={"/"}>Home</Link>
        </li>
      </ul>
    </>
  );
}
