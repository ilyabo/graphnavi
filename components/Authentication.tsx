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
import NextLink from 'next/link';
import { AiFillGithub } from "react-icons/ai";
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/router'
import axios from "axios";
import { useEffect, useState } from "react";

export function isAuthenticated(cookies: any, type: 'github' | string) {
  return (cookies[type + '-token']);
}

function requestGithubToken(code: string, setCookie: (name: string, value: string) => void) {
  axios.post('https://github.com/login/oauth/access_token', {
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

  const [isAuthenticatedGithub, setisAuthenticatedGithub] = useState(false);

  useEffect(() => {
    // Finish authentication
    if (router.query.code && !cookies['github-token']) {
      console.log('Finish authentication')
      axios.get(`http://localhost:3000/api/github?code=${router.query.code}`).then(resp => {
        console.log(resp);
        try {
          setCookie('github-token', resp.data) 
          router.replace('/', undefined, { shallow: true });
        } catch (error) {
          console.log(error);
        }
      })
    }

    if ('github-token' in cookies) {
      console.log('Found GitHub token');
      setisAuthenticatedGithub(true)
      return;
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
                <Text fontWeight={700} fontSize={'3xl'}>
                  GitHub
                </Text>
                {!isAuthenticatedGithub ? (
                  <div>
                    <NextLink href={`https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}`} passHref>
                      <Button as="a" target="_blank"
                        leftIcon={<Icon as={AiFillGithub} h={5} w={5} />}
                        // disabled={isAuthenticated(cookies, 'github')}
                        disabled={isAuthenticatedGithub}
                      >
                        GitHub
                      </Button>
                    </NextLink>
                    <div>Authenticate with GitHub to save your graphs to GitHub Gists</div>
                  </div>
                ) : (
                  <div style={{textAlign: "center"}}>You're good</div>
                )}
              </Flex>
            </ModalBody>

          </ModalContent>
        </Modal>
      </div>
    </>
  )
}