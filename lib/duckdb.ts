import { DuckConn, getColValAsNumber } from "./useDuckConn";

export type TableField = { name: string; type: string };

export type TableInfo = {
  inputFileName?: string;
  inputTableName?: string;
  inputTableFields?: TableField[];
  inputRowCount?: number;
};

export async function maybeDropTable(value?: TableInfo, duckConn?: DuckConn) {
  if (!duckConn) return;
  const { inputFileName, inputTableName } = value || {};
  if (inputFileName) {
    await duckConn.db.dropFile(inputFileName);
  }
  if (inputTableName) {
    await duckConn.conn.query(`DROP TABLE IF EXISTS ${inputTableName};`);
  }
}

export function makeTableName(inputFileName: string): string {
  return inputFileName.replace(/\.[^\.]*$/, "").replace(/\W/g, "_");
}

export async function createTableFromFile(
  file: File,
  duckConn: DuckConn
): Promise<TableInfo> {
  console.log("createTableFromFile", file);
  const inputFileName = file.name;
  await duckConn.db.dropFile(inputFileName);
  await duckConn.db.registerFileHandle(inputFileName, file);

  const inputTableName = makeTableName(inputFileName);

  await duckConn.conn.query(`
       CREATE OR REPLACE TABLE ${inputTableName} AS SELECT * FROM '${inputFileName}'
    `);

  const res = await duckConn.conn.query(
    `SELECT count(*) FROM ${inputTableName}`
  );
  const inputRowCount = getColValAsNumber(res, 0);
  const tableMeta = await duckConn.conn.query(
    `DESCRIBE TABLE ${inputTableName}`
  );
  const inputTableFields = Array.from(tableMeta).map((row) => ({
    name: String(row?.column_name),
    type: String(row?.column_type),
  }));

  const nextResult: TableInfo = {
    inputFileName,
    inputTableName,
    inputRowCount,
    // outputRowCount: undefined,
    inputTableFields,
  };
  // setResult(nextResult);
  return nextResult;
}
