import React, { FC, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import SpinnerPane from "../../components/SpinnerPane";
import { Flex } from "@chakra-ui/react";

type Props = {
  // nothing yet
};

const AuthCallbackPage: FC<Props> = (props) => {
  const { status, data } = useSession();

  useEffect(() => {
    if (status !== "loading") {
      window.close();
    }
  }, [status]);

  return (
    <Flex
      position={"absolute"}
      direction={"column"}
      top={0}
      left={0}
      width={"100vw"}
      height={"100vh"}
      gap={1}
      justifyContent={"center"}
    >
      <SpinnerPane />
    </Flex>
  );
};

export default AuthCallbackPage;
