import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useToast } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import MainView from "../../components/MainView";
import { GistResults } from "../../types";
import { useAppStore } from "../../lib/Store";

type Props = {
  // nothing yet
};

const NODES_QUERY_FILE_NAME = "nodes.sql";
const EDGES_QUERY_FILE_NAME = "edges.sql";

const GistPage: FC<Props> = (props) => {
  const session = useSession();

  const gistResults = useAppStore((state) => state.gistResults);
  const addToGistResults = useAppStore((state) => state.addToGistResults);

  const router = useRouter();
  const { id: gistId } = router.query;

  const toast = useToast();

  useEffect(() => {
    if (gistId) {
      (async () => {
        addToGistResults({ isDataLoading: true });
        try {
          // const token = await fetchGithubToken();
          const result = await fetchUrl(
            `https://api.github.com/gists/${gistId}`
          );
          const files = await Promise.all(
            Object.keys(result.files)
              .map((fname) => result.files[fname])
              .filter(shouldFetchFile)
              .map(
                async ({
                  filename,
                  language,
                  raw_url,
                }: Record<string, any>) => ({
                  filename,
                  language,
                  data: await fetchUrl(raw_url, "text"),
                })
              )
          );

          const csvFiles: GistResults["csvFiles"] = {};
          for (const { filename, language, data } of files) {
            if (filename.toLowerCase() === NODES_QUERY_FILE_NAME) {
              addToGistResults({ nodesQuery: data });
            } else if (filename.toLowerCase() === EDGES_QUERY_FILE_NAME) {
              addToGistResults({ edgesQuery: data });
            } else if (language === "CSV") {
              addToGistResults({ csvFiles: { [filename]: data } });
            }
          }
        } catch (e) {
          console.error(e);
          toast({
            title: "Failed to load gist",
            description: e instanceof Error ? e.message : `${e}`,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        } finally {
          addToGistResults({ isDataLoading: false });
        }
      })();
    }
  }, [gistId]);

  return <MainView />;
};

function shouldFetchFile({ filename, language }: Record<string, any>) {
  const lower = filename.toLowerCase();
  return (
    (language === "CSV" && lower.endsWith(".csv")) ||
    (language === "SQL" &&
      [NODES_QUERY_FILE_NAME, EDGES_QUERY_FILE_NAME].includes(lower))
  );
}

async function fetchUrl(url: string, mode: "json" | "text" = "json") {
  const resp = await fetch(url);
  if (resp.ok) {
    return mode === "json" ? resp.json() : resp.text();
  } else {
    throw new Error(resp.statusText);
  }
}

export default GistPage;
