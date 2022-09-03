import React, { FC, useState } from "react";
import GraphGL, { D3ForceLayout, NODE_TYPE } from "graph.gl";
import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { Graph, GraphNode } from "../types";
import { opacify } from "../lib/utils";
import TooltipBox from "./TooltipBox";

type Props = {
  graph?: Graph;
};

const GraphView: FC<Props> = (props) => {
  const { graph } = props;
  const theme = useTheme();

  const [hoverNode, setHoverNode] = useState<GraphNode>();
  const handleNodeClick = (info: any) => {
    console.log("handleNodeClick", info);
  };
  const handleNodeHover = (info: any) => {
    setHoverNode(info.object);
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
      {hoverNode ? (
        <TooltipBox
          title={"Node"}
          values={{
            id: hoverNode.id,
          }}
        />
      ) : null}
    </Flex>
  );
};

export default GraphView;
