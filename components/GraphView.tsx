import React, { FC } from "react";
import GraphGL, { D3ForceLayout, JSONLoader, NODE_TYPE } from "graph.gl";
import { Flex } from "@chakra-ui/react";

type Props = {
  // nothing yet
};

const GraphView: FC<Props> = (props) => {
  const {} = props;
  const graph = JSONLoader({
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
