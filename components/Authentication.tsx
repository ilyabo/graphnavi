import {
  Flex,

  useDisclosure,
  Button,
  Icon,

  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import NextLink from 'next/link';
import { AiFillGithub } from "react-icons/ai";
import { Cookies, useCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import axios from "axios";
import { importFiles } from "../lib/save";
import { useEffect } from "react";

export function isAuthenticated(cookies: any, type: 'github' | string) {
  return (cookies[type + '-token']);
}

function requestGithubToken(code: string, setCookie: (name: string, value: string) => void) {
  axios.post('https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token', {
    params: {
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      code,
    }
  }).then(resp => {
    console.log(resp);
    // setCookie('github-token', resp.data.access_token);
  }).catch(err => {
    console.log('Error GitHub authentication');
  })
}

// const [cookies, setCookie, removeCookie] = useCookies(['github-token']);
export function Authentication() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cookies, setCookie, removeCookie] = useCookies();

  const router = useRouter()

  let isAuthenticatedGithub = false;
  useEffect(() => {
    // Finish authentication
    if (router.query.code) {
        requestGithubToken(String(router.query.code), setCookie);
    }
    if ('github_token' in cookies) {
      isAuthenticatedGithub = true;
    }
  })


  return (
    <>
      <div>

        <Button onClick={onOpen}>Authentication</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Authentication</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex
                flexDirection="column"
              >
                <NextLink href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`} passHref>
                  <Button as="a" target="_blank"
                    leftIcon={<Icon as={AiFillGithub} h={5} w={5} />}
                    // disabled={isAuthenticated(cookies, 'github')}
                    disabled={isAuthenticatedGithub}
                  >
                    GitHub
                  </Button>
                </NextLink>
              </Flex>
              <div>Authenticate with GitHub to save your graphs to GitHub Gists</div>
            </ModalBody>

          </ModalContent>
        </Modal>
      </div>
    </>
  )
}