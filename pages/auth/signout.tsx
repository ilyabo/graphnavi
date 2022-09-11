import React, { useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import { Flex } from "@chakra-ui/react";
import SpinnerPane from "../../components/SpinnerPane";

const SignOutPage = () => {
  const { status, data } = useSession();

  useEffect(() => {
    switch (status) {
      case "authenticated":
        signOut();
        break;
      case "unauthenticated":
        window.close();
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

export default SignOutPage;
