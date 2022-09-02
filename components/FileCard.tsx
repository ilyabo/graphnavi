import React, { FC } from "react";
import {
  Badge,
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
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
import { TableInfo } from "../lib/duckdb";
import {
  DotsVerticalIcon,
  TableIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/solid";

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
      bg={"gray.900"}
      alignSelf={`stretch`}
      borderRadius={8}
      py={2}
      px={2}
      alignItems="center"
      justifyContent="center"
      position={`relative`}
      cursor={`default`}
      onClick={(evt) => evt.stopPropagation()}
      // _hover={{ bg: "gray.700" }}
    >
      <Box position="absolute" top={1} right={2}>
        <Menu placement={"bottom-end"}>
          <MenuButton
            mt={"6px"}
            size="xs"
            as={IconButton}
            aria-label="Options"
            icon={<DotsVerticalIcon width="15px" />}
            variant="ghost"
            color={"gray.400"}
          />
          <MenuList>
            <MenuItem
              isDisabled={true}
              fontSize={"sm"}
              icon={<TableIcon width="15px" />}
            >
              View data
            </MenuItem>
            <MenuItem
              isDisabled={true}
              fontSize={"sm"}
              icon={<PencilIcon width="15px" />}
            >
              Rename table
            </MenuItem>
            <MenuItem
              isDisabled={true}
              fontSize={"sm"}
              icon={<TrashIcon width="15px" />}
              // onClick={deleteDatasetModal.onOpen}
            >
              Delete table
            </MenuItem>
          </MenuList>
        </Menu>
        {/*<Button*/}
        {/*  color="gray.500"*/}
        {/*  _hover={{ color: "gray.300" }}*/}
        {/*  size="xs"*/}
        {/*  title="Cancel…"*/}
        {/*  variant="ghost"*/}
        {/*  leftIcon={<CloseIcon w={1.5} h={1.5} />}*/}
        {/*  onClick={onReset}*/}
        {/*>*/}
        {/*  Remove*/}
        {/*</Button>*/}
      </Box>

      <Flex gap={2} px={2} mt={0} direction={"column"} width={"100%"}>
        <Box overflow={"auto"}>
          <Table size="xs">
            <Thead>
              <Tr>
                <Td pr={6}>
                  <Box
                    height={"30px"}
                    overflow={"hidden"}
                    position={"relative"}
                  >
                    <Box
                      fontSize="sm"
                      fontWeight={"bold"}
                      position={"absolute"}
                      width={"100%"}
                      color={"gray.100"}
                      mb={1}
                      py={1}
                      // fontFamily={"monospace"}
                      // maxWidth="230px"
                      whiteSpace={"nowrap"}
                      textOverflow={"ellipsis"}
                      overflow={"hidden"}
                      textTransform={"lowercase"}
                    >
                      {value.inputTableName}
                    </Box>
                  </Box>
                </Td>
              </Tr>
            </Thead>
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
          <Text fontSize="xs" textAlign={"right"} mt={1}>
            {`${formatNumber(value.inputRowCount ?? NaN)} rows`}
          </Text>
        </Box>
      </Flex>
    </Flex>
  );
};

export default FileCard;
