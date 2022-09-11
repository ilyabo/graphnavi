import React, { FC, ReactNode } from "react";
import {
  Box,
  Button,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Portal,
  Text,
  useTheme,
} from "@chakra-ui/react";
import { RiQuestionLine } from "react-icons/ri";

const InfoBox: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <Popover placement="top-start" trigger={"hover"}>
      <PopoverTrigger>
        <Button size="0px" width="32px" height="32px" variant="ghost">
          <RiQuestionLine size="22px" />
        </Button>
      </PopoverTrigger>
      <Portal>
        <PopoverContent maxWidth={250} bg={"gray.600"}>
          <PopoverArrow bg={"gray.600"} />
          {/*<PopoverCloseButton />*/}
          {/*<PopoverHeader fontSize="sm" fontWeight="bold">*/}
          {/*  {title}*/}
          {/*</PopoverHeader>*/}
          <PopoverBody>
            <Box fontSize="sm">{children}</Box>
          </PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
};

export default InfoBox;
