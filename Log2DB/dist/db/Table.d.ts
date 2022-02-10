import { Request } from "express";
export declare class Table {
    static parseQueryParams(req: Request): QueryParams;
    /**
     * Prepares an insert by converting an object into an array of values
     * @param {Array<string>} fields
     * @param {object} body
     * @returns {Array<string> | Array<Array<string>>}
     */
    static prepareInsert(fields: Array<string>, body: object): Array<string> | Array<Array<string>>;
}
export interface QueryParams {
    where?: object;
    limit?: number;
    offset?: number;
    sort?: string;
    sortDirection?: string;
}
