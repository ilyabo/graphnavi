import React, { FC, Suspense, useCallback, useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  Button,
  Flex,
  HStack,
  Icon,
} from "@chakra-ui/react";
import { useDuckConn } from "../lib/useDuckConn";
import { PlayIcon } from "@heroicons/react/solid";
import { Table } from "apache-arrow";
import SpinnerPane from "./SpinnerPane";
import dynamic from "next/dynamic";
// import SqlEditor from "./SqlEditor";
// import { useActiveElement } from "../lib/hooks";
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
  queryHelp?: React.ReactNode;
};

const ACE_EDITOR_OPTIONS = {
  enableBasicAutocompletion: true,
  enableSnippets: true,
  enableLiveAutocompletion: true,
  showLineNumbers: false,
};

const QueryBox: FC<Props> = (props) => {
  // const focusedElement = useActiveElement();
  const { id, isValidResult, onResult, onError, queryHelp } = props;
  const duckConn = useDuckConn();
  const [resultError, setResultError] = useState<string>();

  const localStorageKey = `queryBox.${id}.lastQuery`;
  const [query, setQuery] = useState(
    // localStorage.getItem(localStorageKey) ??
    ""
    //`SELECT count(*) FROM ${tableName}`
  );
  useEffect(() => {
    if (props.query) {
      setQuery(props.query);
    }
  }, [props.query]);
  // useEffect(() => {
  //   if (duckConn?.conn && query) {
  //     handleRun();
  //   }
  // }, [query, duckConn]);
  const [resultsInternal, setResultsInternal] = useState<Table>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const handleRun = useCallback(async () => {
    const conn = duckConn?.conn;
    if (!conn) return;
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
  }, [duckConn?.conn, query]);

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

  useEffect(() => {
    const handleKeyDown = (evt: Event) => {
      if (
        evt instanceof KeyboardEvent &&
        evt.key === "Enter" &&
        (evt.metaKey || evt.ctrlKey || evt.shiftKey)
      ) {
        // if (focusedElement === evt.target) {
        handleRun();
        // }
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    handleRun,
    // , focusedElement
  ]);

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
        {queryHelp ? (
          <HStack position={"absolute"} right={1} top={1}>
            {queryHelp}
            {/*<NextLink*/}
            {/*  href={"https://duckdb.org/docs/sql/introduction#querying-a-table"}*/}
            {/*  passHref*/}
            {/*>*/}
            {/*  <IconButton*/}
            {/*    as="a"*/}
            {/*    size={"sm"}*/}
            {/*    target={"_blank"}*/}
            {/*    fontWeight="normal"*/}
            {/*    icon={<QuestionMarkCircleIcon width={18} />}*/}
            {/*    variant={"ghost"}*/}
            {/*    aria-label={"Help"}*/}
            {/*  />*/}
            {/*</NextLink>*/}
            {/*<Spacer />*/}
            {/*<IconButton*/}
            {/*  disabled={!resultsInternal || loading || error}*/}
            {/*  size={"sm"}*/}
            {/*  icon={<Icon as={DownloadIcon} h={5} w={5} />}*/}
            {/*  onClick={handleDownload}*/}
            {/*  aria-label={"Download CSV"}*/}
            {/*/>*/}
          </HStack>
        ) : null}
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
            highlightActiveLine={true}
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
            zIndex={10}
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
          <Alert status="error" borderRadius={"md"} p={1}>
            <AlertIcon />
            {/*<AlertTitle>Your browser is outdated!</AlertTitle>*/}
            <AlertDescription fontSize={"xs"}>{resultError}</AlertDescription>
          </Alert>
        ) : resultsInternal ? (
          <Alert status="success" borderRadius={"md"} p={1}>
            <AlertIcon />
            {/*<AlertTitle>Your browser is outdated!</AlertTitle>*/}
            <AlertDescription fontSize={"xs"}>
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

const SuspendedQueryBox: FC<Props> = (props) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;
  return (
    <Suspense fallback={<SpinnerPane h={"100%"} />}>
      <QueryBox {...props} />
    </Suspense>
  );
};

export default SuspendedQueryBox;
