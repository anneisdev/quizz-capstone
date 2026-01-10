import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Account() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!session) return;

    fetch(`/api/users/${session.user.id}`)
      .then((res) => res.json())
      .then(setUser);
  }, [session]);

  if (status === "loading") return <p>Loading session…</p>;
  if (!session) return <p>Please log in</p>;
  if (!user) return <p>Loading user…</p>;

  console.log("session: ", session);
  console.log("user: ", user);

  return (
    <>
      <p>ID: {user._id}</p>
      <p>Username: {session.user.name}</p>
      <p>Highscore: {user.highscore}</p>
      <p>Bookmarks: {user.bookmarks.length}</p>
    </>
  );
}
