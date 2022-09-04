import React, { FC } from "react";
import InfoBox from "./InfoBox";
import {
  Box,
  Flex,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

type Props = {
  text: ReactNode;
  columnsList: ReactNode;
  queryExample: string;
};

const QueryHelp: FC<Props> = (props) => {
  const { text, queryExample, columnsList } = props;
  return (
    <>
      <InfoBox>
        <Flex direction={"column"} gap={2}>
          <Text>{text}</Text>
          <Box
            borderRadius={"md"}
            bg={"gray.700"}
            px={3}
            py={2}
            fontFamily={"monospace"}
            fontSize={"xs"}
          >
            {columnsList}
          </Box>
          <Text>For example:</Text>
          <Box
            as={"pre"}
            fontFamily={"monospace"}
            px={3}
            py={2}
            borderRadius={"md"}
            bg={"gray.800"}
            fontSize={"xs"}
          >
            {queryExample}
          </Box>
          <Link
            href={"https://duckdb.org/docs/sql/statements/select"}
            target={"_blank"}
            textDecoration={"underline"}
          >
            More about the query syntax
          </Link>
        </Flex>
      </InfoBox>
    </>
  );
};

export default QueryHelp;
