import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { PlayIcon } from "@heroicons/react/solid";
import { useDuckConn } from "../lib/useDuckConn";
import { Mosaic } from "react-mosaic-component";
import { DownloadIcon } from "@chakra-ui/icons";
import { csvFormat } from "d3-dsv";
import { saveAs } from "file-saver";

export interface Props {
  tableName: string;
  isOpen: boolean;
  onClose: () => void;
}

const SqlEditor: React.FC<Props> = (props) => {
  const { tableName, isOpen, onClose } = props;
  const duckConn = useDuckConn();

  const [query, setQuery] = useState(`SELECT count(*) FROM ${tableName}`);
  const [results, setResults] = useState("");
  const handleRun = async () => {
    const conn = duckConn.conn;
    try {
      // await conn.query(`SET search_path = ${schema}`);
      const results = await conn.query(query);
      // await conn.query(`SET search_path = main`);
      setResults(csvFormat(results.toArray()));
    } catch (e) {
      console.error(e);
      // TODO: set error state
    }
  };

  const handleDownload = () => {
    const blob = new Blob([results], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `duckquack-${tableName}.csv`);
  };

  const views: { [viewId: string]: JSX.Element } = {
    queryTextarea: (
      <Textarea
        fontFamily={"monospace"}
        fontSize={"sm"}
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
          <pre style={{ fontFamily: "monospace" }}>{results}</pre>
        </Box>
      </Box>
    ),
  };

  return (
    <Flex alignItems="stretch" px={3} pt={3} pb={1} flexGrow={1}>
      <Flex alignItems="stretch" width="100%" flexDirection="column" gap={2}>
        <HStack ml={1}>
          <Button
            size={"sm"}
            leftIcon={<Icon as={PlayIcon} h={5} w={5} />}
            onClick={handleRun}
          >
            Run
          </Button>
          <Spacer />
          <Button
            disabled={!results}
            size={"sm"}
            leftIcon={<Icon as={DownloadIcon} h={5} w={5} />}
            onClick={handleDownload}
          >
            Download
          </Button>
        </HStack>
        <Mosaic<string>
          renderTile={(id, path) => (
            <Box borderRadius="md" overflow="hidden">
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
    </Flex>
  );
};

export default SqlEditor;
