import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { Flex } from "@chakra-ui/react";
import SpinnerPane from "../../components/SpinnerPane";

const SignInPage = () => {
  const { status, data } = useSession();

  useEffect(() => {
    switch (status) {
      case "authenticated":
        window.close();
        break;
      case "unauthenticated":
        signIn("github");
        break;
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

export default SignInPage;
