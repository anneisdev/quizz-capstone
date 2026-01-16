import { SWRConfig } from "swr";
import GlobalStyle from "../styles";
import { SessionProvider, useSession } from "next-auth/react";
import Login from "@/components/Login";

export async function fetcher(url) {
  const response = await fetch(url);

  if (!response.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <>
      <SessionProvider session={session}>
        <Auth>
          <SWRConfig value={{ fetcher }}>
            <GlobalStyle />
            <Component {...pageProps} />
          </SWRConfig>
        </Auth>
      </SessionProvider>
    </>
  );
}

function Auth({ children }) {
  const { status } = useSession({ required: true });

  if (status === "loading") {
    return <div>Is loading</div>;
  }
  return children;
}
