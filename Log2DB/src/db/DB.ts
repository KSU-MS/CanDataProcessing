import {
  createPool,
  FieldInfo,
  MysqlError,
  Pool,
  PoolConfig,
  QueryOptions,
} from "mysql";
import { QueryParams } from "./Table";
import { SignalArray } from "../lib/SignalParser";

export class DB {
  public static pool: Pool;

  public static async init(config: PoolConfig): Promise<void> {
    this.pool = createPool({ timezone: "utc", ...config });
    return await this.testConnection();
  }
  public static async testConnection() {
    return new Promise<void>((resolve, reject) => {
      this.pool.getConnection(function (err, connection) {
        if (err) return reject("Error connecting to database: " + err);
        connection.release();
        return resolve();
      });
    });
  }
  // Promise formatted query
  public static async query<T = any>(
    query: string | QueryOptions,
    values: any = [],
    queryParams?: QueryParams
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (queryParams) query += this.buildQueryParams(queryParams);
      this.pool.query(
        query,
        values,
        (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  }
  // Promise formatted query
  public static async count(table: string | QueryOptions): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      const query = `SELECT COUNT(id) AS count FROM ${table}`;
      this.pool.query(
        query,
        (err: MysqlError | null, results?: any, fields?: FieldInfo[]) => {
          if (err) return reject(err);
          resolve(results[0]?.count);
        }
      );
    });
  }
  private static buildQueryParams(queryParams?: QueryParams): string {
    if (!queryParams) return "";
    const params = [];
    if (queryParams.sort) {
      params.push(
        "ORDER BY",
        this.pool.escapeId(queryParams.sort),
        queryParams.sortDirection === "desc" ? "DESC" : "ASC"
      );
    }
    if (queryParams.limit)
      params.push(
        "LIMIT",
        this.pool.escape(parseInt(queryParams.limit as any))
      );
    if (queryParams.offset)
      params.push(
        "OFFSET",
        this.pool.escape(parseInt(queryParams.offset as any))
      );
    return " " + params.join(" ");
  }

  // Incoming data is timestamp, id, value
  public static async write(records: Array<SignalArray>): Promise<void> {
    if (!records || records.length === 0) return null;
    return new Promise((resolve, reject) => {
      const query = this.pool.query(
        "INSERT INTO `records` (`key`,`timestamp`,`name`,`value`,`run`) VALUES ? ON DUPLICATE KEY UPDATE `key`=`key`",
        [records],
        (err, results, fields) => {
          if (err) console.error("Error inserting records into DB: ", err);
          resolve();
        }
      );
    });
  }
  public static async close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pool.end((err) => {
        if (err) return reject;
        resolve();
      });
    });
  }
}
