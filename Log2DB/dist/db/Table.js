"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
class Table {
    static parseQueryParams(req) {
        if (!req.query)
            return {};
        const queryParams = {};
        if (req.query.limit && !Number.isNaN(parseInt(req.query.limit)))
            queryParams.limit = parseInt(req.query.limit);
        if (req.query.skip && !Number.isNaN(parseInt(req.query.skip)))
            queryParams.offset = parseInt(req.query.skip);
        return queryParams;
    }
    /**
     * Prepares an insert by converting an object into an array of values
     * @param {Array<string>} fields
     * @param {object} body
     * @returns {Array<string> | Array<Array<string>>}
     */
    static prepareInsert(fields, body) {
        if (Array.isArray(body)) {
            return body.map((i) => {
                return Table.prepareInsert(fields, i);
            });
        }
        else {
            const out = [];
            for (const field of fields) {
                out.push(body[field] || "");
            }
            return out;
        }
    }
}
exports.Table = Table;
//# sourceMappingURL=Table.js.map