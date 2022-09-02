import { Box, Flex, Heading, useDisclosure, useToast } from "@chakra-ui/react";
import React, { Suspense, useEffect, useState } from "react";
import { Mosaic, MosaicNode } from "react-mosaic-component";
import QueryBox from "./QueryBox";
import CsvDropzone from "./CsvDropzone";
import { TableInfo } from "../lib/duckdb";
import GraphView from "./GraphView";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MainView: React.FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const [value, setValue] = useState<TableInfo[]>([]);
  const sqlEditor = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (value) {
      sqlEditor.onOpen();
    } else {
      sqlEditor.onClose();
    }
  }, [value]);

  const [mosaicState, setMosaicState] = useState<MosaicNode<string> | null>({
    direction: "row",
    first: "filesArea",
    second: {
      direction: "row",
      first: {
        direction: "column",
        first: "nodesQueryBox",
        second: "edgesQueryBox",
        splitPercentage: 50,
      },
      second: "graphView",
      splitPercentage: 30,
    },
    splitPercentage: 20,
  });

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

  const views: { [viewId: string]: JSX.Element } = {
    filesArea: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Input files
        </Heading>
        <Suspense fallback={<div>Loading…</div>}>
          <CsvDropzone
            tables={value}
            onTableCreated={(inputTableName: string, result) => {
              console.log(inputTableName, result);
              setValue([...value, result]);
            }}
            onChange={(result) => {
              console.log("onChange", result);
            }}
            onReset={() => {
              console.log("onReset");
            }}
            onError={(message) =>
              toast({
                title: "Something went wrong",
                description: message,
                status: "error",
                duration: 9000,
                isClosable: true,
              })
            }
          />
        </Suspense>
      </>
    ),

    nodesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Nodes query
        </Heading>
        <QueryBox />
      </>
    ),
    edgesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Edges query
        </Heading>
        <QueryBox />
      </>
    ),
    graphView: <GraphView />,
  };

  return (
    <Flex alignItems="stretch" px={3} pt={3} pb={1} flexGrow={1}>
      <Mosaic<string>
        renderTile={(id, path) => (
          <Flex
            gap={2}
            p={3}
            direction={"column"}
            // border={"1px solid red"}
            // width={"100%"}
            // height={"100%"}
            borderRadius="md"
            overflow="hidden"
            bg={"gray.700"}
          >
            {views[id]}
          </Flex>
        )}
        value={mosaicState}
        onChange={setMosaicState}
      />
    </Flex>
  );
};

export default MainView;
