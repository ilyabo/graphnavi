import React, { FC, useEffect, useMemo, useState } from "react";
import { Box, Button, Flex, Icon, Text, useTheme } from "@chakra-ui/react";
import { PauseIcon, PlayIcon } from "@heroicons/react/solid";
import { EdgeFields, Graph, GraphEdge, GraphNode, NodeFields } from "../types";
import TooltipBox from "./TooltipBox";
import { Graph as CosmoGraph, GraphConfigInterface } from "@cosmograph/cosmos";

type Props = {
  graph?: Graph;
  nodeFields?: Record<NodeFields, boolean>;
  edgeFields?: Record<EdgeFields, boolean>;
};

const GraphView: FC<Props> = (props) => {
  const { graph, nodeFields, edgeFields } = props;
  const theme = useTheme();

  const graphConfig = useMemo((): GraphConfigInterface<
    GraphNode,
    GraphEdge
  > => {
    return {
      backgroundColor: theme.colors.gray[900],
      nodeColor: "#DD7BB8",
      linkColor: "#677194",
      linkArrows: false,
      simulation: {
        repulsion: 0.5,
      },
      renderLinks: true,
      // linkColor: link => link.color,
      // nodeColor: node => node.color,
      nodeSizeScale: 0.5,
      ...(nodeFields?.[NodeFields.SIZE]
        ? { nodeSize: (node) => Number(node.size ?? 0) }
        : null),
      linkWidthScale: 1,
      ...(edgeFields?.[EdgeFields.WIDTH]
        ? { linkWidth: (edge) => Number(edge.width ?? 0) }
        : null),
      events: {
        onClick: (node: GraphNode | undefined) => {
          console.log("Clicked node: ", node);
          if (cosmoGraphRef.current) {
            setHoverNode(node);
            // if (node) {
            //   cosmoGraphRef.current?.selectNodeById(node.id);
            // }
          }
        },
      },
    };
  }, [nodeFields, edgeFields]);
  const handleNodeHover = (info: any) => {
    const { object } = info;
    // console.log(object);
    if (object) {
      setHoverNode(object._data);
    }
  };
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const cosmoGraphRef = React.useRef<CosmoGraph<GraphNode, GraphEdge>>();
  useEffect(() => {
    if (canvasRef.current) {
      cosmoGraphRef.current = new CosmoGraph<GraphNode, GraphEdge>(
        canvasRef.current,
        graphConfig
      );
    }
  }, [canvasRef.current]);
  useEffect(() => {
    if (canvasRef.current && cosmoGraphRef.current) {
      if (graph.nodes?.length && graph.edges?.length) {
        cosmoGraphRef.current.setData(graph.nodes, graph.edges);
        setIsPlaying(true);
      }
    }
  }, [canvasRef.current, cosmoGraphRef.current, graph]);
  const [isPlaying, setIsPlaying] = useState(true);
  const handleFit = () => {
    if (cosmoGraphRef.current) {
      cosmoGraphRef.current?.fitView();
    }
  };
  const handleTogglePlay = () => {
    if (cosmoGraphRef.current) {
      if (isPlaying) {
        cosmoGraphRef.current.pause();
      } else {
        cosmoGraphRef.current.restart();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const [hoverNode, setHoverNode] = useState<GraphNode>();

  const handleNodeMouseLeave = () => {
    setHoverNode(undefined);
  };
  return (
    <Flex
      position={"relative"}
      width={"100%"}
      height={"100%"}
      background={"gray.800"}
      p={0}
    >
      {graph ? (
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
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
      <Box position={"absolute"} top={2} right={2}>
        <Button
          variant="ghost"
          color="gray.400"
          onClick={handleFit}
          isDisabled={!cosmoGraphRef.current}
          // leftIcon={<Icon w={8} h={8} as={isPlaying ? PauseIcon : PlayIcon} />}
          size={"sm"}
          // width={"100px"}
          justifyContent={"flex-start"}
        >
          Fit
        </Button>
        <Button
          variant="ghost"
          color="gray.400"
          onClick={handleTogglePlay}
          isDisabled={!cosmoGraphRef.current}
          leftIcon={<Icon w={8} h={8} as={isPlaying ? PauseIcon : PlayIcon} />}
          size={"sm"}
          width={"100px"}
          justifyContent={"flex-start"}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </Box>
    </Flex>
  );
};

export default GraphView;
