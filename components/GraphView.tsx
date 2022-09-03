import React, { FC, useState } from "react";
import GraphGL from "../lib/graphgl";
import { D3ForceLayout, NODE_TYPE } from "graph.gl";
import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { Graph, NodeFields } from "../types";
import TooltipBox from "./TooltipBox";

type Props = {
  updateIndex: number;
  graph?: Graph;
  nodeFieldsAvail?: Record<NodeFields, boolean>;
};

const GraphView: FC<Props> = (props) => {
  const { updateIndex, graph, nodeFieldsAvail } = props;
  const theme = useTheme();
  // const showNodeLabel = true;
  const nodeLabelSize = 10;
  // console.log("nodeFieldsAvail", nodeFieldsAvail);

  const [hoverNode, setHoverNode] = useState<Record<string, string>>();
  const handleNodeClick = (info: any) => {
    console.log("handleNodeClick", info);
  };
  const handleNodeHover = (info: any) => {
    const { object } = info;
    // console.log(object);
    if (object) {
      setHoverNode({
        ...object._data,
        edges: Object.keys(object._connectedEdges).length,
      });
    }
  };
  const handleNodeMouseLeave = () => {
    setHoverNode(undefined);
  };
  return (
    <Flex
      position={"relative"}
      width={"100%"}
      height={"100%"}
      background={"gray.800"}
      px={2}
      py={2}
    >
      {graph ? (
        <GraphGL
          // key={updateIndex}
          // updateIndex={updateIndex}
          graph={graph}
          layout={new D3ForceLayout()}
          nodeStyle={[
            {
              type: NODE_TYPE.CIRCLE,
              radius: 5,
              fill: theme.colors.gray[400],
              ":hover": {
                radius: 7,
                fill: theme.colors.blue[500],
              },
            },
            nodeFieldsAvail?.[NodeFields.LABEL] && {
              type: NODE_TYPE.LABEL,
              text: (node: any) => node._data[NodeFields.LABEL],
              color: [255, 255, 255, 255],
              // color: Color(this.props.nodeLabelColor).array(),
              alignmentBaseline: "top",
              fontSize: nodeLabelSize,
              offset: [0, 7],
            },
          ]}
          edgeStyle={{
            stroke: theme.colors.gray[600],
            strokeWidth: 1.5,
            // ":hover": {
            //   radius: 10,
            //   fill: theme.colors.blue[500],
            // },
          }}
          nodeEvents={{
            onClick: handleNodeClick,
            onHover: handleNodeHover,
            onMouseLeave: handleNodeMouseLeave,
          }}
        />
      ) : (
        <Flex
          direction={"column"}
          width={"100%"}
          height={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
          color={"gray.500"}
          gap={2}
        >
          <Box textAlign={"center"} maxWidth={"80%"}>
            <Text fontSize={"sm"}>
              Configure the nodes and edges to visualize as a graph
            </Text>
          </Box>
        </Flex>
      )}
      {hoverNode ? <TooltipBox title={"Node"} values={hoverNode} /> : null}
    </Flex>
  );
};

export default GraphView;
