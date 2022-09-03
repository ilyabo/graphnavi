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
import { useLocation, useSearchParams } from 'react-router-dom';
import { AiFillGithub } from "react-icons/ai";

export function Authentication() {
  const { isOpen, onOpen, onClose } = useDisclosure();

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
                <NextLink href={'https://github.com/login/oauth/authorize?client_id=10eb03cf7db58ad0b51c'} passHref>
                  <Button as="a" target="_blank"
                    leftIcon={<Icon as={AiFillGithub} h={5} w={5} />}
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

