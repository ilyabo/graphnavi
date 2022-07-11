import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spacer,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { PlayIcon } from "@heroicons/react/solid";
import { useDuckConn } from "../lib/useDuckConn";
import { Mosaic } from "react-mosaic-component";
import { DownloadIcon } from "@chakra-ui/icons";

export interface Props {
  schema: string;
  isOpen: boolean;
  onClose: () => void;
}

const SqlEditor: React.FC<Props> = (props) => {
  const { schema, isOpen, onClose } = props;
  const duckConn = useDuckConn();

  const [query, setQuery] = useState(`SELECT 
  o.name as origin_name,
  d.name as dest_name,
  f.*
FROM 
  flows f
  JOIN locations o ON f.origin = o.id
  JOIN locations d ON f.dest = d.id
LIMIT 10
`);
  const [results, setResults] = useState("");
  const handleRun = async () => {
    const conn = duckConn.conn;
    try {
      await conn.query(`SET search_path = ${schema}`);
      const results = await conn.query(query);
      await conn.query(`SET search_path = main`);
      console.log(results);
      setResults(JSON.stringify(results.toArray(), null, 2));
    } catch (e) {
      console.error(e);
      // TODO: set error state
    }
  };
  const views: { [viewId: string]: JSX.Element } = {
    queryTextarea: (
      <Textarea
        flex="1 0 auto"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder=""
        bg={"gray.200"}
        color={"gray.900"}
        width="100%"
        height="100%"
        _placeholder={{ color: "gray.400" }}
      ></Textarea>
    ),
    resultsBox: (
      <Box
        position={"relative"}
        width={"100%"}
        height={"100%"}
        overflow="auto"
        background={"gray.800"}
        fontSize="xs"
      >
        <Box position={"absolute"}>
          <pre>{results}</pre>
        </Box>
      </Box>
    ),
  };

  return (
    <Modal
      isCentered
      isOpen={isOpen}
      onClose={onClose}
      closeOnOverlayClick={false}
      size={"full"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody display="flex" alignItems="stretch" px={3} pt={3} pb={1}>
          <Flex
            alignItems="stretch"
            width="100%"
            flexDirection="column"
            gap={2}
          >
            <ModalCloseButton />
            <HStack ml={1} mr={10}>
              <Button
                size={"sm"}
                leftIcon={<Icon as={PlayIcon} h={5} w={5} />}
                onClick={handleRun}
              >
                Run
              </Button>
              {/*<Spacer />*/}
              <Button
                disabled={true}
                size={"sm"}
                leftIcon={<Icon as={DownloadIcon} h={5} w={5} />}
                onClick={console.log}
              >
                Export
              </Button>
            </HStack>
            <Mosaic<string>
              renderTile={(id, path) => (
                <Box
                  backgroundColor={"primary"}
                  borderRadius="md"
                  overflow="hidden"
                >
                  {views[id]}
                </Box>
              )}
              initialValue={{
                direction: "row",
                first: "queryTextarea",
                second: "resultsBox",
                splitPercentage: 30,
              }}
            />
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SqlEditor;
