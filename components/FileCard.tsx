import React, { FC } from "react";
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { formatNumber } from "../lib/utils";
import { CloseIcon } from "@chakra-ui/icons";
import { TableInfo } from "../lib/duckdb";

export type Props = {
  value?: TableInfo;
  onReset: () => void;
};

const FileCard: FC<Props> = (props) => {
  const { value, onReset } = props;
  if (!value) return null;

  return (
    <Flex
      border={`1px solid`}
      bg={"gray.800"}
      alignSelf={`stretch`}
      borderRadius={8}
      py={2}
      alignItems="center"
      justifyContent="center"
      position={`relative`}
      cursor={`default`}
      onClick={(evt) => evt.stopPropagation()}
    >
      <Box position="absolute" top={1} right={1}>
        <Button
          color="gray.500"
          _hover={{ color: "gray.300" }}
          size="xs"
          title="Cancel…"
          variant="ghost"
          leftIcon={<CloseIcon w={1.5} h={1.5} />}
          onClick={onReset}
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
            {`${formatNumber(value.inputRowCount ?? NaN)} rows`}
          </Text>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>Columns</Th>
              </Tr>
            </Thead>
          </Table>
          <Box maxHeight={"150px"} overflow={"auto"}>
            <Table size="sm">
              <Tbody>
                {value.inputTableFields?.map((row, i) => {
                  return (
                    <Tr key={i}>
                      <Td>
                        <HStack>
                          <Box width="60px">
                            <Badge
                              colorScheme="blue"
                              fontSize={9}
                              variant="outline"
                            >
                              {row.type}
                            </Badge>
                          </Box>
                          <Flex fontSize={"xs"} maxWidth={"100px"}>
                            {row.name}
                          </Flex>
                        </HStack>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default FileCard;
