import React, { FC, useMemo } from "react";
import { useDropzone } from "react-dropzone";

import {
  Badge,
  Box,
  Button,
  Center,
  Grid,
  HStack,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { DocumentAddIcon } from "@heroicons/react/solid";
import { formatNumber } from "../lib/utils";
import { CloseIcon } from "@chakra-ui/icons";
import { useDuckConn } from "../lib/useDuckConn";
import { InputColumnOption } from "./FieldSelect";
import CustomOutputColumnsTable, {
  CustomOutputColumn,
} from "./CustomOutputColumnsTable";
import {
  createTableFromFile,
  CreateTableResult,
  maybeDropTable,
} from "../lib/duckdb";

const ACCEPTED_FORMATS = [
  ".csv",
  // '.tsv',
  ".parquet",
  // '.json',
  // '.arrow',
];

export type ColumnSpec = {
  name: string;
  type: "string" | "number" | "datetime";
  comment?: string;
  required?: boolean;
  nameVariants?: string[];
  // validate?: (
  //   duckConn: DuckConn,
  //   inputTableName: string,
  //   columnName: string,
  //   totalRowCount: number,
  // ) => Promise<string | undefined>;
};

export type Props = {
  value?: CreateTableResult;
  allowCustomColumns: boolean;
  outputColumnSpecs: ColumnSpec[];
  isInvalid?: boolean;
  onReset: () => void;
  onChange: (result: CreateTableResult) => void;
  onTableCreated: (inputTableName: string, result: CreateTableResult) => void;
  onError: (message: string) => void;
};

const CsvDropzone: FC<Props> = (props) => {
  const {
    value,
    outputColumnSpecs,
    allowCustomColumns,
    isInvalid,
    onError,
    onTableCreated,
    onChange,
    onReset,
  } = props;

  const handleReset = async () => {
    await maybeDropTable(value, duckConn);
    // setResult(undefined);
    onReset();
  };

  const allInputColumns: Array<InputColumnOption> = useMemo(() => {
    if (!value?.inputTableFields) return [];
    return value.inputTableFields.map((row: any) => ({
      value: row.name,
      row: row,
    }));
  }, [value?.inputTableFields]);

  const unusedInputColumns: Array<InputColumnOption> = useMemo(() => {
    if (!value?.inputTableFields) return [];
    const usedCols = Object.values(value.selectedColumns || {});
    return allInputColumns.filter(
      (col) => !usedCols.includes((col as InputColumnOption).value)
    );
  }, [allInputColumns, value?.selectedColumns]);

  const duckConn = useDuckConn();

  const handleCustomColumnChange = (column: CustomOutputColumn) => {
    if (value)
      onChange({
        ...value,
        customOutputColumns: {
          ...value.customOutputColumns,
          [column.inputColumn]: column,
        },
      });
  };

  const handleDrop = async (files: File[]) => {
    await maybeDropTable(value, duckConn);
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
    <Center
      color="gray.400"
      p={5}
      cursor="pointer"
      bg={isDragActive ? activeBg : "transparent"}
      _hover={{ bg: value?.inputTableFields ? undefined : activeBg }}
      transition="background-color 0.2s ease"
      borderRadius={8}
      border={`2px ${value?.inputRowCount ? "solid" : "dashed"}`}
      borderColor={borderColor}
      {...getRootProps()}
      position={"relative"}
      height={"100%"}
      minWidth={300}
      minHeight={200}
      justifyContent="center"
    >
      {value?.inputRowCount && value?.inputTableFields ? (
        <>
          <Box position="absolute" top={1} right={1}>
            <Button
              color="gray.500"
              _hover={{ color: "gray.300" }}
              size="xs"
              title="Cancel…"
              variant="ghost"
              leftIcon={<CloseIcon w={1.5} h={1.5} />}
              onClick={handleReset}
            >
              Remove
            </Button>
          </Box>

          <VStack gap={5} mt={4}>
            <VStack>
              <Text fontSize="sm" color="gray.100" maxWidth={400} noOfLines={1}>
                {value.inputFileName}
              </Text>
              <HStack>
                <Text fontSize="xs">Table name:</Text>
                <Badge fontSize="xs">{value.inputTableName}</Badge>
              </HStack>
              <Text fontSize="sm">
                {`${formatNumber(value.inputRowCount)} rows`}
              </Text>
            </VStack>
            {allowCustomColumns ? (
              <CustomOutputColumnsTable
                inputColumns={unusedInputColumns}
                customOutputColumns={value.customOutputColumns}
                onColumnChange={handleCustomColumnChange}
              />
            ) : null}
          </VStack>
        </>
      ) : (
        <>
          <input {...getInputProps()} />
          <VStack gap={2}>
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
          </VStack>
        </>
      )}
    </Center>
  );
};

export default CsvDropzone;