import {
  Flex,
  useDisclosure,
  Button,
  Icon,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { AiFillGithub } from "react-icons/ai";
import { useCookies } from "react-cookie";
import { useRouter } from "next/router";
import axios from "axios";
import { useEffect, useState } from "react";

export function isAuthenticated(cookies: any, type: "github" | string) {
  return cookies[type + "-token"];
}

// const [cookies, setCookie, removeCookie] = useCookies(['github-token']);
export function Authentication() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies, setCookie, removeCookie] = useCookies();

  const router = useRouter();

  const [isGithubAuth, setIsGithubAuth] = useState(false);

  useEffect(() => {
    // Finish authentication
    if (router.query.code && !cookies["github-token"]) {
      console.log("Finish authentication");
      axios.get(`/api/github?code=${router.query.code}`).then((resp) => {
        console.log(resp);
        try {
          setCookie("github-token", resp.data);
          router.replace("/", undefined, { shallow: true });
        } catch (error) {
          console.log(error);
        }
      });
    }

    if ("github-token" in cookies) {
      console.log("Found GitHub token");
      setIsGithubAuth(true);
      return;
    }
  });

  return (
    <>
      <div>
        <Button onClick={onOpen} size={"sm"} disabled={true}>
          Sign In
        </Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Sign In</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex flexDirection="column">
                <Text fontWeight={700} fontSize={"3xl"}>
                  GitHub
                </Text>
                {!isGithubAuth ? (
                  <div>
                    <NextLink
                      href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_OAUTH_CLIENT_ID}`}
                      passHref
                    >
                      <Button
                        as="a"
                        target="_blank"
                        leftIcon={<Icon as={AiFillGithub} h={5} w={5} />}
                        // disabled={isAuthenticated(cookies, 'github')}
                        disabled={isGithubAuth}
                      >
                        GitHub
                      </Button>
                    </NextLink>
                    <div>
                      Sign in to GitHub to save your graphs to GitHub Gists
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: "center" }}>{`You're good now`}</div>
                )}
              </Flex>
            </ModalBody>
          </ModalContent>
        </Modal>
      </div>
    </>
  );
}
