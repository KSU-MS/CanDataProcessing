import { Table } from "./Table";
export declare class Runs extends Table {
    static get(req: any, res: any): Promise<void>;
    static post(req: any, res: any): Promise<void>;
}
export interface Run {
    id: number;
    name: string;
    date: Date;
}
