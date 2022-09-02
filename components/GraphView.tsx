import React, { FC } from "react";
import GraphGL, { D3ForceLayout, JSONLoader, NODE_TYPE } from "graph.gl";
import { Flex } from "@chakra-ui/react";
import { Graph } from "../types";

type Props = {
  graph: Graph;
};

const GraphView: FC<Props> = (props) => {
  const { graph } = props;
  return (
    <Flex
      position={"relative"}
      width={"100%"}
      height={"100%"}
      background={"gray.900"}
      px={2}
      py={2}
    >
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
          stroke: "#fff",
          strokeWidth: 1,
        }}
      />
    </Flex>
  );
};

export default GraphView;
