import React, { FC, Suspense, useEffect, useState } from "react";
import { Heading } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { TableInfo } from "../lib/duckdb";
import SpinnerPane from "./SpinnerPane";

const CsvDropzone = dynamic(() => import("./CsvDropzone"), {
  ssr: false,
});

type Props = {
  onError: (message: string) => void;
};

const FilesArea: FC<Props> = (props) => {
  const { onError } = props;
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const [tablesInfo, setTablesInfo] = useState<TableInfo[]>([]);
  const handleTableCreated = (tables: TableInfo[]) => {
    setTablesInfo([...tablesInfo, ...tables]);
  };
  return (
    <>
      <Heading as={"h2"} size={"sm"}>
        Input files
      </Heading>
      {mounted ? (
        <Suspense fallback={<SpinnerPane h={"100%"} />}>
          <CsvDropzone
            tables={tablesInfo}
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
