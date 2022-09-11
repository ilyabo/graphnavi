import React, { FC, Suspense, useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { TableInfo } from "../lib/duckdb";
import SpinnerPane from "./SpinnerPane";
import { useRouter } from "next/router";
import { fetchFileFromGist } from "../lib/gists";

const CsvDropzone = dynamic(() => import("./CsvDropzone"), {
  ssr: false,
});

type Props = {
  onError: (message: string) => void;
};

const FilesArea: FC<Props> = (props) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [fileContent, setFileContent] = useState("asd");
  useEffect(() => {
    if (router.query.gist) {
      fetchFileFromGist(String(router.query.gist), "data.csv").then((resp) => {
        setFileContent(resp[0].content);
      });
    }
    setMounted(true);
  }, []);
  const { onError } = props;
  const [value, setValue] = useState<TableInfo[]>([]);
  return (
    <>
      <Heading as={"h2"} size={"sm"}>
        Input files
      </Heading>
      {mounted ? (
        <Suspense fallback={<SpinnerPane h={"100%"} />}>
          <CsvDropzone
            tables={value}
            onTableCreated={(tables) => {
              setValue([...value, ...tables]);
            }}
            onChange={(result) => {
              console.log("onChange", result);
            }}
            onReset={() => {
              console.log("onReset");
            }}
            onError={onError}
          />
        </Suspense>
      ) : null}
    </>
  );
};

export default FilesArea;
