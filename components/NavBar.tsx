import React, { FC, useState } from "react";
import {
  Button,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuList,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { AiFillGithub } from "react-icons/ai";
import { useSession } from "next-auth/react";
import NewWindow from "react-new-window";

type Props = {
  // nothing yet
};

const NavBar: FC<Props> = (props) => {
  const session = useSession();
  const [showLogin, setShowLogin] = useState(false);
  const loginWindowRef = React.useRef<Window | null>();
  const [loginIndex, setLoginIndex] = useState(0);

  const handleShowLoginWindow = () => {
    setShowLogin(true);
    if (loginWindowRef.current && !loginWindowRef.current.closed) {
      loginWindowRef.current.focus();
    } else {
      setLoginIndex(loginIndex + 1);
    }
  };
  return (
    <>
      <Flex
        width={"100%"}
        as={"header"}
        px={5}
        pt={3}
        mx={"auto"}
        // maxW={"6xl"}
      >
        <Flex direction={"row"} alignItems={"center"} gap={5}>
          <Heading fontSize="2xl" display={"flex"}>
            <Text color={"gray.500"}>Graph</Text>
            <Text color={"gray.100"}>NAVI</Text>
          </Heading>
          <Text fontSize="xs" color={"gray.500"}>
            Network analysis and visualization tool
          </Text>
        </Flex>
        <Spacer />
        {/*<a*/}
        {/*  href="https://www.duckdb.org"*/}
        {/*  target="_blank"*/}
        {/*  rel="noopener noreferrer"*/}
        {/*>*/}
        {/*  <Flex alignItems="center" gap={2}>*/}
        {/*    <Text fontSize={"xs"}>Powered by DuckDB</Text>*/}
        {/*    <Image*/}
        {/*      src="/duckdb.svg"*/}
        {/*      alt="DuckDB Logo"*/}
        {/*      width={30}*/}
        {/*      height={30}*/}
        {/*    />*/}
        {/*  </Flex>*/}
        {/*</a>*/}
        <Flex direction={"row"} gap={5}>
          {/*<Authentication></Authentication>*/}

          {session.status !== "authenticated" ? (
            <>
              <Button
                leftIcon={<AiFillGithub />}
                // onClick={() => signIn("github")}
                onClick={handleShowLoginWindow}
                size={"sm"}
              >
                Sign In
              </Button>
            </>
          ) : (
            <>
              <Button
                size={"sm"}
                // onClick={() => signOut()}
                onClick={handleShowLoginWindow}
              >
                Sign Out
              </Button>
            </>
          )}

          <Menu>
            <MenuButton
              as={Button}
              rightIcon={
                <ChevronDownIcon
                // size={"sm"}
                />
              }
              size={"sm"}
              disabled={true}
            >
              Save
            </MenuButton>
            <MenuList>
              {/*<MenuItem*/}
              {/*  isDisabled={!isAuthenticatedGithub}*/}
              {/*  icon={<Icon as={AiFillGithub} h={5} w={5} />}*/}
              {/*  onClick={save}*/}
              {/*>*/}
              {/*  GitHub Gist*/}
              {/*</MenuItem>*/}
              {/*<MenuItem*/}
              {/*  // disabled={!results || loading || error}*/}
              {/*  icon={<Icon as={DownloadIcon} h={5} w={5} />}*/}
              {/*  // onClick={handleDownload}*/}
              {/*>*/}
              {/*  Download CSV*/}
              {/*</MenuItem>*/}
            </MenuList>
          </Menu>
        </Flex>
      </Flex>
      {showLogin ? (
        //&&
        <NewWindow
          key={`login-${loginIndex}`}
          features={{
            width: 500,
            height: 500,
          }}
          // url="/auth/sign-in"
          url={
            // session.status === "authenticated"
            // ? "/api/auth/signout/github"
            // : "/api/auth/signin/github"
            session.status === "authenticated"
              ? "/auth/signout"
              : "/auth/signin"
          }
          onOpen={(w: Window) => {
            loginWindowRef.current = w;
          }}
        />
      ) : null}
    </>
  );
};

export default NavBar;
