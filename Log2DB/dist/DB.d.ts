import { ConnectionConfig } from "mysql";
import { SignalArray } from "./SignalParser";
export declare class DB {
    private static connection;
    static init(config: ConnectionConfig): void;
    static write(records: Array<SignalArray>): Promise<any>;
    static close(): Promise<void>;
}
export interface SignalRecord {
}
