import { Box, Flex, Heading, useDisclosure, useToast } from "@chakra-ui/react";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import { Mosaic, MosaicNode } from "react-mosaic-component";
import QueryBox from "./QueryBox";
import CsvDropzone from "./CsvDropzone";
import { TableInfo } from "../lib/duckdb";
import GraphView from "./GraphView";
import { Table } from "apache-arrow";
import { JSONLoader } from "graph.gl";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MainView: React.FC<Props> = (props) => {
  const [value, setValue] = useState<TableInfo[]>([]);
  const toast = useToast();

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

  const graph = useMemo(() => {
    return JSONLoader({
      json: {
        nodes: [{ id: "1" }, { id: "2" }, { id: "3" }],
        edges: [
          { id: "e1", sourceId: "1", targetId: "2" },
          { id: "e2", sourceId: "1", targetId: "3" },
          { id: "e3", sourceId: "2", targetId: "3" },
        ],
      },
      nodeParser: (node: any) => ({ id: node.id }),
      edgeParser: (edge: any) => ({
        id: edge.id,
        sourceId: edge.sourceId,
        targetId: edge.targetId,
        directed: true,
      }),
    });
  }, []);

  const handleNodeResults = (table: Table) => {
    const nodes = Array.from(
      (function* () {
        for (let i = 0; i < table.numRows; i++) {
          yield {
            id: table.getChild("id")?.get(i),
            name: table.getChild("name")?.get(i),
          };
        }
      })()
    );
    console.log("handleNodeResults", nodes);
  };
  const handleEdgeResults = (table: Table) => {
    console.log("handleEdgeResults", table);
  };

  const handleError = (message: string) => {
    toast({
      title: "Something went wrong",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

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
            onError={handleError}
          />
        </Suspense>
      </>
    ),

    nodesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Nodes query
        </Heading>
        <QueryBox onResults={handleNodeResults} onError={handleError} />
      </>
    ),
    edgesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Edges query
        </Heading>
        <QueryBox onResults={handleEdgeResults} onError={handleError} />
      </>
    ),
    graphView: <GraphView graph={graph} />,
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
