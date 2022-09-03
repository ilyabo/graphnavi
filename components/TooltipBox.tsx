import React, { FC, Fragment } from "react";
import { opacify } from "../lib/utils";
import { Flex, Grid, Text, useTheme } from "@chakra-ui/react";

type Props = {
  title: string;
  values: Record<string, string>;
};

const TooltipBox: FC<Props> = (props) => {
  const { title, values } = props;
  const theme = useTheme();
  return (
    <Flex
      pointerEvents={"none"}
      fontSize={"sm"}
      position={"absolute"}
      left={1}
      bottom={1}
      borderRadius={"md"}
      p={3}
      direction={"column"}
      bgColor={opacify(theme.colors.gray[900], 0.5)}
    >
      <Text fontWeight={"bold"} mb={1}>
        {title}
      </Text>
      <Grid
        templateColumns={"min-content 1fr"}
        rowGap={0}
        columnGap={2}
        fontSize={"xs"}
        whiteSpace={"nowrap"}
      >
        {Object.entries(values).map(([k, v], i) => (
          <Fragment key={k}>
            <Text>{`${k}`}</Text>
            <Text>{`${v}`}</Text>
          </Fragment>
        ))}
      </Grid>
    </Flex>
  );
};

export default TooltipBox;
