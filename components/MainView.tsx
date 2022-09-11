import {
  Flex,
  Heading,
  ListItem,
  UnorderedList,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import { Mosaic, MosaicNode } from "react-mosaic-component";
import GraphView from "./GraphView";
import { Table } from "apache-arrow";
import { EdgeFields, GraphEdge, GraphNode, NodeFields } from "../types";
import FilesArea from "./FilesArea";
// import CsvDropzone from "./CsvDropzone";
import QueryBox from "./QueryBox";
import { useRouter } from "next/router";
import { importFiles } from "../lib/save";
import QueryHelp from "./QueryHelp";

export interface Props {}

// const QueryBox = dynamic(() => import("./QueryBox"), {
//   ssr: false,
// });

const MainView: React.FC<Props> = (props) => {
  const [nodeFields, setNodeFields] = useState<Record<NodeFields, boolean>>();
  const [edgeFields, setEdgeFields] = useState<Record<EdgeFields, boolean>>();
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

  const [egdesText, setEdgesText] = useState("");
  const [nodesText, setNodesText] = useState("");
  const router = useRouter();
  useEffect(() => {
    if (router.query.gist) {
      importFiles(String(router.query.gist), "nodes.sql").then((resp) => {
        console.log(resp);
        setNodesText(resp[0].content);
        // setNodes(resp[0].content);
      });
      importFiles(String(router.query.gist), "edges.sql").then((resp) => {
        console.log(resp);
        // @ts-ignore
        setEdgesText(resp[0].content);
        // setNodes(resp[0].content);
      });
    }
  }, []);

  const [nodes, setNodes] = useState<GraphNode[]>();
  const [edges, setEdges] = useState<GraphEdge[]>();
  const graph = useMemo(() => {
    const graph = {
      nodes: nodes ?? [],
      edges: edges ?? [],
    };
    return graph;
  }, [nodes, edges]);

  const handleNodeResults = (table: Table) => {
    const nodes = Array.from(
      (function* () {
        for (let ri = 0; ri < table.numRows; ri++) {
          const node: Record<string, any> = {};
          for (const field of table.schema.fields) {
            node[field.name.toLowerCase()] = `${table
              .getChild(field.name)
              ?.get(ri)}`;
          }
          yield node as GraphNode;
        }
      })()
    );
    setNodes(nodes);
    setNodeFields({
      [NodeFields.ID]: hasField(table, NodeFields.ID),
      [NodeFields.LABEL]: hasField(table, NodeFields.LABEL),
      [NodeFields.COLOR]: hasField(table, NodeFields.COLOR),
      [NodeFields.SIZE]: hasField(table, NodeFields.SIZE),
    });
  };
  const handleEdgeResults = (table: Table) => {
    const edges = Array.from(
      (function* () {
        for (let ri = 0; ri < table.numRows; ri++) {
          const edge: Record<string, any> = {};
          for (const field of table.schema.fields) {
            edge[field.name.toLowerCase()] = `${table
              .getChild(field.name)
              ?.get(ri)}`;
          }
          yield edge as GraphEdge;
        }
      })()
    );
    setEdges(edges);
    setEdgeFields({
      [EdgeFields.ID]: hasField(table, EdgeFields.ID),
      [EdgeFields.SOURCE]: hasField(table, EdgeFields.SOURCE),
      [EdgeFields.TARGET]: hasField(table, EdgeFields.TARGET),
      [EdgeFields.LABEL]: hasField(table, EdgeFields.LABEL),
      [EdgeFields.WIDTH]: hasField(table, EdgeFields.WIDTH),
    });
  };

  const handleError = (message: string) => {
    toast.closeAll();
    toast({
      // title: "Something went wrong",
      description: message,
      status: "error",
      duration: 9000,
      isClosable: true,
    });
  };

  const views: { [viewId: string]: JSX.Element } = {
    filesArea: <FilesArea onError={handleError} />,

    nodesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Nodes
        </Heading>
        <QueryBox
          content={nodesText}
          id={"nodes"}
          isValidResult={validateNodes}
          onResult={handleNodeResults}
          onError={handleError}
          queryHelp={
            <QueryHelp
              text={`Write an SQL select query which returns the graph nodes.
              You can refer to the input files as table names.
              The query result should have the following columns:`}
              columnsList={
                <UnorderedList>
                  <ListItem>id: string</ListItem>
                  <ListItem>label: string (optional)</ListItem>
                  <ListItem>size: string (optional)</ListItem>
                </UnorderedList>
              }
              queryExample={`SELECT 
  column0 AS id, 
  column1 AS label
FROM my_nodes_table`}
            />
          }
        />
      </>
    ),
    edgesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"}>
          Edges
        </Heading>
        <QueryBox
          content={egdesText}
          id={"edges"}
          isValidResult={validateEdges}
          onResult={handleEdgeResults}
          onError={handleError}
          queryHelp={
            <QueryHelp
              text={`Write an SQL select query which returns the graph edges.
              You can refer to the input files as table names.
              The query result should have the following columns:`}
              columnsList={
                <UnorderedList>
                  <ListItem>source: string</ListItem>
                  <ListItem>target: string</ListItem>
                  <ListItem>width: number (optional)</ListItem>
                </UnorderedList>
              }
              queryExample={`SELECT 
  source_id AS source, 
  target_id AS target
FROM my_edges_table`}
            />
          }
        />
      </>
    ),
    graphView: (
      <GraphView
        graph={graph}
        nodeFields={nodeFields}
        edgeFields={edgeFields}
      />
    ),
  };

  // const [mounted, setMounted] = useState(false);
  // useEffect(() => {
  //   setMounted(true);
  // }, []);
  // if (!mounted) return <SpinnerPane />;

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

const hasField = (table: Table, name: string) => {
  const lcName = name.toLowerCase();
  const { fields } = table.schema;
  return Boolean(fields.find((f) => f.name.toLowerCase() === lcName));
};

function checkHasColumn(table: Table, name: string) {
  // if (!table.getChild(name)) {
  if (!hasField(table, name)) {
    return `Column '${name}' is missing in the query result`;
  }
  return undefined;
}

function validateNodes(table: Table) {
  return checkHasColumn(table, NodeFields.ID);
}

function validateEdges(table: Table) {
  return (
    checkHasColumn(table, EdgeFields.SOURCE) ??
    checkHasColumn(table, EdgeFields.TARGET)
  );
}

export default MainView;
