import { Box, Flex, Heading } from "@chakra-ui/react";
import React, { useState } from "react";
import { Mosaic, MosaicNode } from "react-mosaic-component";
import QueryBox from "./QueryBox";

export interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SqlEditor: React.FC<Props> = (props) => {
  const { isOpen, onClose } = props;
  const [mosaicState, setMosaicState] = useState<MosaicNode<string> | null>({
    direction: "row",
    first: {
      direction: "column",
      first: "nodesQueryBox",
      second: "edgesQueryBox",
      splitPercentage: 50,
    },
    second: "graphView",
    splitPercentage: 30,
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
    nodesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"} mb={2}>
          Nodes query
        </Heading>
        <QueryBox />
      </>
    ),
    edgesQueryBox: (
      <>
        <Heading as={"h2"} size={"sm"} mb={2}>
          Edges query
        </Heading>
        <QueryBox />
      </>
    ),
    graphView: (
      <Box
        position={"relative"}
        width={"100%"}
        height={"100%"}
        overflow="auto"
        background={"gray.900"}
        fontSize="xs"
        px={4}
        py={2}
      >
        {/*{loading ? (*/}
        {/*  <Flex position={"absolute"} w={"100%"} h={"100%"}>*/}
        {/*    <SpinnerPane />*/}
        {/*  </Flex>*/}
        {/*) : (*/}
        {/*  <Box position={"absolute"}>*/}
        {/*    <pre style={{ fontFamily: "monospace" }}>{results}</pre>*/}
        {/*  </Box>*/}
        {/*)}*/}
      </Box>
    ),
  };

  return (
    <Flex alignItems="stretch" px={3} pt={3} pb={1} flexGrow={1}>
      <Mosaic<string>
        renderTile={(id, path) => (
          <Flex
            p={2}
            direction={"column"}
            // border={"1px solid red"}
            // width={"100%"}
            // height={"100%"}
            borderRadius="md"
            overflow="hidden"
            bg={"gray.900"}
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

export default SqlEditor;
