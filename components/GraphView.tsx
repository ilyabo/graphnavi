import React, { FC } from "react";
import GraphGL, { D3ForceLayout, NODE_TYPE } from "graph.gl";
import { Box, Flex, Text, useTheme } from "@chakra-ui/react";
import { Graph } from "../types";

type Props = {
  graph?: Graph;
};

const GraphView: FC<Props> = (props) => {
  const { graph } = props;
  const theme = useTheme();
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
              fill: "red",
            },
          ]}
          edgeStyle={{
            stroke: theme.colors.gray[200],
            strokeWidth: 1,
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
    </Flex>
  );
};

export default GraphView;
