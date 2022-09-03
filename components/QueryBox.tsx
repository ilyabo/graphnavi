import React, { FC, useCallback, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
} from "@chakra-ui/react";
import { useDuckConn } from "../lib/useDuckConn";
import { PlayIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import NextLink from "next/link";
import { Table } from "apache-arrow";
import SpinnerPane from "./SpinnerPane";
import dynamic from "next/dynamic";

const SqlEditor = dynamic(() => import("../components/SqlEditor"), {
  // see https://github.com/securingsincity/react-ace/issues/1044
  ssr: false,
});

type Props = {
  id: string;
  query?: string;
  isValidResult: (table: Table) => string | undefined;
  onResult: (table: Table) => void;
  onError: (msg: string) => void;
};

const ACE_EDITOR_OPTIONS = {
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
  showLineNumbers: false,
};

const QueryBox: FC<Props> = (props) => {
  const { id, isValidResult, onResult, onError } = props;
  const duckConn = useDuckConn();
  const [resultError, setResultError] = useState<string>();

  // useEffect(() => {
  //   const handleKeyDown = (evt: Event) => {
  //     if (
  //       evt instanceof KeyboardEvent &&
  //       evt.key === "Enter" &&
  //       (evt.metaKey || evt.ctrlKey || evt.shiftKey)
  //     ) {
  //       handleRun();
  //     }
  //   };
  //   globalThis.addEventListener("keydown", handleKeyDown);
  //   return () => {
  //     globalThis.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [handleRun]);

  const localStorageKey = `queryBox.${id}.lastQuery`;
  const [query, setQuery] = useState(
    localStorage.getItem(localStorageKey) ?? ""
    //`SELECT count(*) FROM ${tableName}`
  );
  const [resultsInternal, setResultsInternal] = useState<Table>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleRun = useCallback(async () => {
    const conn = duckConn.conn;
    try {
      // await conn.query(`SET search_path = ${schema}`);
      setLoading(true);
      const results = await conn.query(query);
      setResultsInternal(results);
      // await conn.query(`SET search_path = main`);
      // setResults(csvFormat(results.toArray()));
      const resultError = isValidResult(results);
      setResultError(resultError);
      if (!resultError) {
        onResult(results);
      }
      setError(false);
    } catch (e) {
      let msg = e instanceof Error ? e.message : String(e);
      // const i = msg.indexOf("Query call stack");
      // if (i >= 0) msg = msg.substring(0, i);
      // console.error(e);
      // setError(true);
      // setResults(msg);
      // TODO: set error state
      onError(msg);
    } finally {
      setLoading(false);
    }
  }, [duckConn.conn, query]);

  const handleDownload = () => {
    // const blob = new Blob([resultsInternal], {
    //   type: "text/plain;charset=utf-8",
    // });
    // saveAs(blob, `graphnavi-${genRandomStr(5)}.csv`);
  };

  const handleChangeQuery = (newQuery: string) => {
    setQuery(newQuery);
    localStorage.setItem(localStorageKey, newQuery);
  };

  return (
    <Flex
      alignItems="stretch"
      // px={3}
      // pt={3}
      // pb={3}
      flexGrow={1}
      borderRadius={5}
      bg={"gray.700"}
      overflow={"hidden"}
    >
      <Flex
        alignItems="stretch"
        width="100%"
        flexDirection="column"
        gap={2}
        bg={"transparent"}
      >
        <HStack position={"absolute"} right={1} top={1}>
          <NextLink
            href={"https://duckdb.org/docs/sql/introduction#querying-a-table"}
            passHref
          >
            <IconButton
              as="a"
              size={"sm"}
              target={"_blank"}
              fontWeight="normal"
              icon={<QuestionMarkCircleIcon width={18} />}
              variant={"ghost"}
              aria-label={"Help"}
            />
          </NextLink>
          {/*<Spacer />*/}
          {/*<IconButton*/}
          {/*  disabled={!resultsInternal || loading || error}*/}
          {/*  size={"sm"}*/}
          {/*  icon={<Icon as={DownloadIcon} h={5} w={5} />}*/}
          {/*  onClick={handleDownload}*/}
          {/*  aria-label={"Download CSV"}*/}
          {/*/>*/}
        </HStack>
        <Flex
          position={"relative"}
          flexGrow={1}
          alignItems="stretch"
          width="100%"
          flexDirection="column"
          gap={2}
        >
          <SqlEditor
            mode="sql"
            theme="dracula"
            value={query}
            showGutter={false}
            highlightActiveLine
            onChange={handleChangeQuery}
            name="query-editor"
            editorProps={{ $blockScrolling: true }}
            setOptions={ACE_EDITOR_OPTIONS}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />

          {/*<Textarea*/}
          {/*  rows={1}*/}
          {/*  height={"100%"}*/}
          {/*  // resize={"none"}*/}
          {/*  fontFamily={"monospace"}*/}
          {/*  isDisabled={loading}*/}
          {/*  fontSize={"sm"}*/}
          {/*  flex="1 0 auto"*/}
          {/*  value={query}*/}
          {/*  onChange={(e) => handleChangeQuery(e.target.value)}*/}
          {/*  placeholder=""*/}
          {/*  bg={"gray.200"}*/}
          {/*  color={"gray.900"}*/}
          {/*  // width="100%"*/}
          {/*  // height="100%"*/}
          {/*  _placeholder={{ color: "gray.400" }}*/}
          {/*/>*/}
          <Button
            zIndex={2}
            isDisabled={loading}
            size={"sm"}
            leftIcon={<Icon as={PlayIcon} h={5} w={5} />}
            onClick={handleRun}
            position={"absolute"}
            bottom={2}
            right={2}
            bgColor={"gray.600"}
            _hover={{
              bgColor: "gray.500",
            }}
            _active={{
              bgColor: "gray.400",
            }}
          >
            Run
          </Button>
          {loading ? (
            <Flex
              position={"absolute"}
              top={0}
              left={0}
              right={0}
              bottom={0}
              alignItems={"center"}
              justifyItems={"center"}
            >
              <SpinnerPane />
            </Flex>
          ) : null}
        </Flex>
        {resultError ? (
          <Alert status="error" borderRadius={"md"}>
            <AlertIcon />
            {/*<AlertTitle>Your browser is outdated!</AlertTitle>*/}
            <AlertDescription>{resultError}</AlertDescription>
          </Alert>
        ) : resultsInternal ? (
          <Alert status="success" borderRadius={"md"}>
            <AlertIcon />
            {/*<AlertTitle>Your browser is outdated!</AlertTitle>*/}
            <AlertDescription>
              {resultsInternal.numRows > 1
                ? `${resultsInternal.numRows} rows`
                : resultsInternal.numRows > 0
                ? "One row"
                : "Empty result"}
            </AlertDescription>
          </Alert>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default QueryBox;
