import React, { FC, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchFileFromGist, fetchGithubToken } from "../../lib/gists";
import { useToast } from "@chakra-ui/react";

type Props = {
  // nothing yet
};

const GistPage: FC<Props> = (props) => {
  const {} = props;
  const router = useRouter();
  const { id: gistId } = router.query;
  const toast = useToast();
  let filesContent;

  // useEffect(() => {
  //   if (gistId) {
  //     (async () => {
  //       try {
  //         const token = await fetchGithubToken();
  //         // const resp = await fetchFileFromGist(`${gistId}`);
  //         // console.log(resp);
  //       } catch (e) {
  //         console.error(e);
  //         toast({
  //           title: "Failed to load gist",
  //           description: e instanceof Error ? e.message : `${e}`,
  //           status: "error",
  //           duration: 9000,
  //           isClosable: true,
  //         });
  //       }
  //     })();
  //   }
  // }, [gistId]);

  return <></>;
};

export default GistPage;
