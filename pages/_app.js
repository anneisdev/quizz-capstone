import { SWRConfig } from "swr";
import GlobalStyle from "../styles";
import { SessionProvider } from "next-auth/react";
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
        <SWRConfig value={{ fetcher }}>
          <Login />
          <GlobalStyle />
          <Component {...pageProps} />
        </SWRConfig>
      </SessionProvider>
    </>
  );
}
