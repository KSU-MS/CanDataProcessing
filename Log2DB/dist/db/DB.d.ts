import { Pool, PoolConfig, QueryOptions } from "mysql";
import { QueryParams } from "./Table";
import { SignalArray } from "../lib/SignalParser";
export declare class DB {
    static pool: Pool;
    static init(config: PoolConfig): Promise<void>;
    static testConnection(): Promise<void>;
    static query<T = any>(query: string | QueryOptions, values?: any, queryParams?: QueryParams): Promise<T>;
    static count(table: string | QueryOptions): Promise<number>;
    private static buildQueryParams;
    static write(records: Array<SignalArray>): Promise<void>;
    static close(): Promise<void>;
}
