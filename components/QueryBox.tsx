import React, { FC, useCallback, useState } from "react";
import {
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Spacer,
  Textarea,
} from "@chakra-ui/react";
import { csvFormat } from "d3-dsv";
import { useDuckConn } from "../lib/useDuckConn";
import { saveAs } from "file-saver";
import { genRandomStr } from "../lib/utils";
import { PlayIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import NextLink from "next/link";
import { DownloadIcon } from "@chakra-ui/icons";

type Props = {
  // nothing yet
};

const QueryBox: FC<Props> = (props) => {
  const {} = props;
  const duckConn = useDuckConn();

  const [query, setQuery] = useState(
    localStorage.getItem("lastQuery") ?? ""
    //`SELECT count(*) FROM ${tableName}`
  );
  const [results, setResults] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
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

  const handleDownload = () => {
    const blob = new Blob([results], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, `csvgraph-${genRandomStr(5)}.csv`);
  };

  const handleChangeQuery = (newQuery: string) => {
    setQuery(newQuery);
    localStorage.setItem("lastQuery", newQuery);
  };
  return (
    <Flex
      alignItems="stretch"
      px={3}
      pt={3}
      pb={3}
      flexGrow={1}
      borderRadius={5}
      bg={"gray.700"}
    >
      <Flex
        alignItems="stretch"
        width="100%"
        flexDirection="column"
        gap={2}
        bg={"transparent"}
      >
        <HStack ml={1}>
          <Button
            isDisabled={loading}
            size={"sm"}
            leftIcon={<Icon as={PlayIcon} h={5} w={5} />}
            onClick={handleRun}
          >
            Run
          </Button>
          <NextLink
            href={"https://duckdb.org/docs/sql/introduction#querying-a-table"}
            passHref
          >
            <IconButton
              as="a"
              target={"_blank"}
              fontWeight="normal"
              icon={<QuestionMarkCircleIcon width={18} />}
              variant={"ghost"}
              aria-label={"Help"}
            />
          </NextLink>
          <Spacer />
          <IconButton
            disabled={!results || loading || error}
            size={"sm"}
            icon={<Icon as={DownloadIcon} h={5} w={5} />}
            onClick={handleDownload}
            aria-label={"Download CSV"}
          />
        </HStack>
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
      </Flex>
    </Flex>
  );
};

export default QueryBox;
