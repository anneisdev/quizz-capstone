import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Account() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const { data: prompts } = useSWR("/api/prompts");

  useEffect(() => {
    if (!session) return;

    fetch(`/api/users/${session.user.id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [session]);

  if (status === "loading") return <p>Loading session…</p>;
  if (!session) return <p>Please log in</p>;
  if (!user) return <p>Loading user…</p>;

  const userPrompts = prompts?.filter((prompt) => prompt.owner === user.authProviderId);

  console.log(user);

  return (
    <>
      <p>ID: {user._id}</p>
      <p>Username: {session.user.name}</p>
      <p>Highscore: {user.highscore}</p>
      <p>Bookmarks: {user.bookmarks.length}</p>
      <p>My Prompts: {userPrompts.length}</p>
      <button>Darkmode</button>
    </>
  );
}
