import * as duckdb from "@duckdb/duckdb-wasm";
import useSWR from "swr";
import { Table } from "apache-arrow";

export type DuckConn = {
  db: duckdb.AsyncDuckDB;
  conn: duckdb.AsyncDuckDBConnection;
  worker: Worker;
};

const ENABLE_DUCK_LOGGING = false;

const SilentLogger = {
  log: () => {
    /* do nothing */
  },
};

// TODO: shut DB down at some point

let duckConn: DuckConn;
let initialize: Promise<DuckConn>;

export async function getDuckConn(): Promise<DuckConn> {
  if (duckConn) {
    return duckConn;
  } else if (initialize) {
    // The initialization has already been started, wait for it to finish
    return initialize;
  }

  let resolve: (value: DuckConn) => void;
  let reject: (reason?: any) => void;
  initialize = new Promise((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  try {
    console.time("DB instantiation");
    const allBundles = duckdb.getJsDelivrBundles();
    const bestBundle = await duckdb.selectBundle(allBundles);
    if (bestBundle.mainWorker) {
      const worker = await duckdb.createWorker(bestBundle.mainWorker);
      const logger = ENABLE_DUCK_LOGGING
        ? new duckdb.ConsoleLogger()
        : SilentLogger;
      const db = new duckdb.AsyncDuckDB(logger, worker);
      await db.instantiate(bestBundle.mainModule, bestBundle.pthreadWorker);
      await db.open({
        path: ":memory:",
        query: {
          castBigIntToDouble: true,
        },
      });
      const conn = await db.connect();
      // Replace conn.query to include full query in the error message
      const connQuery = conn.query;
      const runQuery = async (q: string): Promise<Table<any>> => {
        const stack = new Error().stack;
        // try {
        return await connQuery.call(conn, q);
        // } catch (err) {
        //   const er = new Error(
        //     `DB query failed: ${err}\n\nFull query:\n\n${q}\n\nQuery call stack:\n\n${stack}\n\n`
        //   );
        //   throw er;
        // }
      };
      conn.query = runQuery;
      duckConn = { db, conn, worker };
      resolve!(duckConn);
    } else {
      throw new Error("No best bundle found for DuckDB worker");
    }
    console.timeEnd("DB instantiation");
  } catch (err) {
    reject!(err);
    throw err;
  }

  return duckConn;
}

export function useDuckConn() {
  const res = useSWR<DuckConn>(
    "duckConn",
    async () => {
      if (!duckConn) {
        await getDuckConn();
      }
      return duckConn;
    },
    { suspense: true }
  );
  return res.data!;
}

export const isNumericDuckType = (type: string) =>
  type.indexOf("INT") >= 0 ||
  type.indexOf("DECIMAL") >= 0 ||
  type.indexOf("FLOAT") >= 0 ||
  type.indexOf("REAL") >= 0 ||
  type.indexOf("DOUBLE") >= 0;

export function getColValAsNumber(res: Table, column: string | number): number {
  const v = (
    typeof column === "number" ? res.getChildAt(column) : res.getChild(column)
  )?.get(0);
  if (v === undefined || v === null) {
    return NaN;
  }
  // if it's an array (can be returned by duckdb as bigint)
  return v[0] ?? v;
}
