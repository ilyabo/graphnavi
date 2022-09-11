import React, { FC, Suspense, useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { TableInfo } from "../lib/duckdb";
import SpinnerPane from "./SpinnerPane";
import { GistResults } from "../types";

const CsvDropzone = dynamic(() => import("./CsvDropzone"), {
  ssr: false,
});

type Props = {
  csvFiles?: GistResults["csvFiles"];
  onError: (message: string) => void;
};

const FilesArea: FC<Props> = (props) => {
  const { csvFiles, onError } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [value, setValue] = useState<TableInfo[]>([]);
  console.log("value", value);
  const handleTableCreated = (tables: TableInfo[]) => {
    setValue([...value, ...tables]);
  };
  return (
    <>
      <Heading as={"h2"} size={"sm"}>
        Input files
      </Heading>
      {mounted ? (
        <Suspense fallback={<SpinnerPane h={"100%"} />}>
          <CsvDropzone
            csvFiles={csvFiles}
            tables={value}
            onTableCreated={handleTableCreated}
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
