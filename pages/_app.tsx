import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import theme from "../theme";
import Head from "next/head";
import NavBar from "../components/NavBar";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>GraphNAVI</title>
        <meta
          name="description"
          content="Network analysis and visualization tool"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={pageProps.session}>
        {router.pathname.startsWith("/auth/") ? (
          <Component {...pageProps} />
        ) : (
          <Flex
            position={"absolute"}
            direction={"column"}
            top={0}
            left={0}
            width={"100vw"}
            height={"100vh"}
            gap={1}
          >
            <NavBar />
            <Flex as={"main"} w={"100vw"} height={"100%"}>
              <Component {...pageProps} />
            </Flex>
          </Flex>
        )}
      </SessionProvider>
    </ChakraProvider>
  );
}

export default MyApp;
