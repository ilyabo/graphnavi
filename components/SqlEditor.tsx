import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { PlayIcon } from "@heroicons/react/solid";
import { useDuckConn } from "../lib/useDuckConn";
import { Mosaic, MosaicNode } from "react-mosaic-component";
import { DownloadIcon } from "@chakra-ui/icons";
import { csvFormat } from "d3-dsv";
import { saveAs } from "file-saver";
import SpinnerPane from "./SpinnerPane";

export interface Props {
  tableName: string;
  isOpen: boolean;
  onClose: () => void;
}

const SqlEditor: React.FC<Props> = (props) => {
  const { tableName, isOpen, onClose } = props;
  const duckConn = useDuckConn();

  const [query, setQuery] = useState(
    localStorage.getItem("lastQuery") ?? `SELECT count(*) FROM ${tableName}`
  );
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [mosaicState, setMosaicState] = useState<MosaicNode<string> | null>({
    direction: "row",
    first: "queryTextarea",
    second: "resultsBox",
    splitPercentage: 30,
  });

  const handleChangeQuery = (newQuery: string) => {
    setQuery(newQuery);
    localStorage.setItem("lastQuery", newQuery);
  };

  const handleRun = useCallback(async () => {
    const conn = duckConn.conn;
    try {
      // await conn.query(`SET search_path = ${schema}`);
      setLoading(true);
      const results = await conn.query(query);
      // await conn.query(`SET search_path = main`);
      setResults(csvFormat(results.toArray()));
      setError(false);
    } catch (e) {
      let msg = e instanceof Error ? e.message : String(e);
      const i = msg.indexOf("Query call stack");
      if (i >= 0) msg = msg.substring(0, i);
      // console.error(e);
      setError(true);
      setResults(msg);
      // TODO: set error state
    } finally {
      setLoading(false);
    }
  }, [duckConn.conn, query]);

  useEffect(() => {
    const handleKeyDown = (evt: Event) => {
      if (
        evt instanceof KeyboardEvent &&
        evt.key === "Enter" &&
        (evt.metaKey || evt.ctrlKey || evt.shiftKey)
      ) {
        handleRun();
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleRun]);

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
        isDisabled={loading}
        fontSize={"sm"}
        flex="1 0 auto"
        value={query}
        onChange={(e) => handleChangeQuery(e.target.value)}
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
        px={4}
        py={2}
      >
        {loading ? (
          <Flex position={"absolute"} w={"100%"} h={"100%"}>
            <SpinnerPane />
          </Flex>
        ) : (
          <Box position={"absolute"}>
            <pre style={{ fontFamily: "monospace" }}>{results}</pre>
          </Box>
        )}
      </Box>
    ),
  };

  return (
    <Flex alignItems="stretch" px={3} pt={3} pb={1} flexGrow={1}>
      <Flex alignItems="stretch" width="100%" flexDirection="column" gap={2}>
        <HStack ml={1}>
          <Button
            isDisabled={loading}
            size={"sm"}
            leftIcon={<Icon as={PlayIcon} h={5} w={5} />}
            onClick={handleRun}
          >
            Run
          </Button>
          <Spacer />
          <Button
            disabled={!results || loading || error}
            size={"sm"}
            leftIcon={<Icon as={DownloadIcon} h={5} w={5} />}
            onClick={handleDownload}
          >
            Download CSV
          </Button>
        </HStack>
        <Mosaic<string>
          renderTile={(id, path) => (
            <Box borderRadius="md" overflow="hidden">
              {views[id]}
            </Box>
          )}
          value={mosaicState}
          onChange={setMosaicState}
        />
      </Flex>
    </Flex>
  );
};

export default SqlEditor;
