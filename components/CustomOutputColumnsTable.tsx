import React, { FC } from "react";
import { InputColumnOption } from "./FieldSelect";
import {
  Badge,
  Box,
  Checkbox,
  HStack,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

export type CustomOutputColumn = {
  inputColumn: string;
  keep: boolean;
  outputColumnName: string;
};

type Props = {
  inputColumns: InputColumnOption[] | undefined;
  customOutputColumns: Record<string, CustomOutputColumn> | undefined;
  onColumnChange: (customColumn: CustomOutputColumn) => void;
};

const CustomOutputColumnsTable: FC<Props> = ({
  inputColumns,
  customOutputColumns,
  onColumnChange,
}) => {
  if (!inputColumns?.length) {
    return null;
  }
  const handleKeepChange = (column: CustomOutputColumn, keep: boolean) => {
    onColumnChange({ ...column, keep });
  };
  const handleNameChange = (column: CustomOutputColumn, name: string) => {
    onColumnChange({ ...column, outputColumnName: name });
  };
  const getOrCreateColumn = (option: InputColumnOption) => {
    const col = customOutputColumns ? customOutputColumns[option.value] : null;
    return (
      col ?? {
        inputColumn: option.value,
        keep: false,
        outputColumnName: option.value,
      }
    );
  };
  return (
    <>
      {/*<Text fontSize="sm">Pick additional columns for use as attributes:</Text>*/}
      <Table size="sm">
        <Thead>
          <Tr>
            {/*<Th>*/}
            {/*  /!*<Checkbox>*!/*/}
            {/*  <Text fontSize="xs">Keep?</Text>*/}
            {/*  /!*</Checkbox>*!/*/}
            {/*</Th>*/}
            <Th>Columns</Th>
            {/*<Th>Rename column</Th>*/}
          </Tr>
        </Thead>
        <Tbody>
          {inputColumns.map((option, i) => {
            const column = getOrCreateColumn(option);
            return (
              <Tr key={i}>
                {/*<Td textAlign="center">*/}
                {/*  <Checkbox*/}
                {/*    isInvalid={false}*/}
                {/*    checked={column.keep}*/}
                {/*    onChange={(e) => handleKeepChange(column, e.target.checked)}*/}
                {/*  />*/}
                {/*</Td>*/}
                <Td width={250}>
                  <HStack>
                    <Box width="60px">
                      <Badge colorScheme="blue" fontSize={9} variant="outline">
                        {option.row.type}
                      </Badge>
                    </Box>
                    <Box fontSize={"xs"}>{option.value}</Box>
                  </HStack>
                </Td>
                {/*<Td>*/}
                {/*  <Input*/}
                {/*    isInvalid={false}*/}
                {/*    isDisabled={!column.keep}*/}
                {/*    value={column.outputColumnName}*/}
                {/*    size="sm"*/}
                {/*    onChange={(e) => handleNameChange(column, e.target.value)}*/}
                {/*  />*/}
                {/*</Td>*/}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </>
  );
};
export default CustomOutputColumnsTable;
