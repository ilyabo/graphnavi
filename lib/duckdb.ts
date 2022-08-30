import { DuckConn, getColValAsNumber } from "./useDuckConn";
import { CustomOutputColumn } from "../components/CustomOutputColumnsTable";

export type TableField = { name: string; type: string };

export type CreateTableResult = {
  inputFileName?: string;
  inputTableName?: string;
  inputTableFields?: TableField[];
  inputRowCount?: number;
  // outputRowCount?: number;
  selectedColumns?: Record<string, string>;
  customOutputColumns?: Record<string, CustomOutputColumn>;
};

const DEFAULT_TABLE_NAME = "data";

export async function maybeDropTable(
  value?: CreateTableResult,
  duckConn?: DuckConn
) {
  if (!duckConn) return;
  const { inputFileName, inputTableName } = value || {};
  if (inputFileName) {
    await duckConn.db.dropFile(inputFileName);
  }
  if (inputTableName) {
    await duckConn.conn.query(`DROP TABLE IF EXISTS ${inputTableName};`);
  }
}

export async function createTableFromFile(
  file: File,
  duckConn: DuckConn,
  onTableCreated: (inputTableName: string, result: CreateTableResult) => void,
  onError: (message: string) => void
) {
  try {
    const inputFileName = file.name;
    await duckConn.db.dropFile(inputFileName);
    await duckConn.db.registerFileHandle(inputFileName, file);

    // const inputTableName = genRandomStr(5).toLowerCase();
    const inputTableName = DEFAULT_TABLE_NAME;
    await duckConn.conn.query(`
           CREATE TABLE ${inputTableName} AS SELECT * FROM '${inputFileName}'
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

    const nextResult: CreateTableResult = {
      inputFileName,
      inputTableName,
      inputRowCount,
      // outputRowCount: undefined,
      inputTableFields,
      selectedColumns: {},
    };
    // setResult(nextResult);
    onTableCreated(inputTableName, nextResult);
  } catch (e) {
    console.error(e);
    onError(e instanceof Error ? e.message : String(e));
  }
}
