import { Request } from "express";

export class Table {
  public static parseQueryParams(req: Request): QueryParams {
    if (!req.query) return {};
    const queryParams: QueryParams = {};
    if (req.query.limit && !Number.isNaN(parseInt(req.query.limit as string)))
      queryParams.limit = parseInt(req.query.limit as string);
    if (req.query.skip && !Number.isNaN(parseInt(req.query.skip as string)))
      queryParams.offset = parseInt(req.query.skip as string);
    return queryParams;
  }

  /**
   * Prepares an insert by converting an object into an array of values
   * @param {Array<string>} fields
   * @param {object} body
   * @returns {Array<string> | Array<Array<string>>}
   */
  public static prepareInsert(
    fields: Array<string>,
    body: object
  ): Array<string> | Array<Array<string>> {
    if (Array.isArray(body)) {
      return body.map((i) => {
        return Table.prepareInsert(fields, i) as Array<string>;
      });
    } else {
      const out = [];
      for (const field of fields) {
        out.push(body[field] || "");
      }
      return out;
    }
  }
}

export interface QueryParams {
  where?: object;
  limit?: number;
  offset?: number;
  sort?: string;
  sortDirection?: string;
}
