import React, { FC } from "react";
import { useDropzone } from "react-dropzone";

import { Flex, Grid, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { DocumentAddIcon } from "@heroicons/react/solid";
import { useDuckConn } from "../lib/useDuckConn";
import { createTableFromFile, TableInfo, maybeDropTable } from "../lib/duckdb";
import FileCard from "./FileCard";

const ACCEPTED_FORMATS = [
  ".csv",
  // '.tsv',
  ".parquet",
  // '.json',
  // '.arrow',
];

export type Props = {
  tables?: TableInfo[];
  isInvalid?: boolean;
  onReset: () => void;
  onChange: (result: TableInfo) => void;
  onTableCreated: (inputTableName: string, result: TableInfo) => void;
  onError: (message: string) => void;
};

const CsvDropzone: FC<Props> = (props) => {
  const { tables, isInvalid, onError, onTableCreated, onChange, onReset } =
    props;

  const handleReset = async () => {
    // await maybeDropTable(tables, duckConn);
    // setResult(undefined);
    onReset();
  };

  const duckConn = useDuckConn();

  const handleDrop = async (files: File[]) => {
    // await maybeDropTable(value, duckConn);
    await createTableFromFile(files[0], duckConn, onTableCreated, onError);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles: 1,
    multiple: false,
  });

  const activeBg = "gray.700";
  const borderColor = isInvalid
    ? "tomato"
    : isDragActive
    ? "teal.500"
    : "gray.500";

  return (
    <Flex
      direction={"column"}
      color="gray.400"
      p={5}
      cursor="pointer"
      bg={isDragActive ? activeBg : "transparent"}
      _hover={{ bg: "gray.700" }}
      transition="background-color 0.2s ease"
      borderRadius={8}
      border={`2px dashed`}
      borderColor={borderColor}
      {...getRootProps()}
      position={"relative"}
      height={"100%"}
    >
      <>
        <input {...getInputProps()} />
        <Flex gap={2} direction={"column"} height={"100%"}>
          {tables?.length ? (
            <VStack gap={2}>
              {tables.map((table, i) => (
                <FileCard key={i} onReset={handleReset} value={table} />
              ))}
            </VStack>
          ) : null}
          <Flex
            direction={"column"}
            height={"100%"}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <HStack>
              <Icon w={6} h={6} as={DocumentAddIcon} />
              <p>
                {isDragActive
                  ? "Drop here ..."
                  : "Drop a file here or click to browse"}
              </p>
            </HStack>
            <Grid templateColumns="auto 1fr" columnGap={3} rowGap={2}>
              <Text fontSize="xs" fontWeight="bold">
                Supported formats:
              </Text>
              <Text fontSize="xs">{ACCEPTED_FORMATS.join(", ")}</Text>
            </Grid>
          </Flex>
        </Flex>
      </>
    </Flex>
  );
};

export default CsvDropzone;
