"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB = void 0;
const mysql_1 = require("mysql");
class DB {
    static init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            this.pool = mysql_1.createPool(Object.assign({ timezone: "utc" }, config));
            return yield this.testConnection();
        });
    }
    static testConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.pool.getConnection(function (err, connection) {
                    if (err)
                        return reject("Error connecting to database: " + err);
                    connection.release();
                    return resolve();
                });
            });
        });
    }
    // Promise formatted query
    static query(query, values = [], queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                if (queryParams)
                    query += this.buildQueryParams(queryParams);
                this.pool.query(query, values, (err, results, fields) => {
                    if (err)
                        return reject(err);
                    resolve(results);
                });
            });
        });
    }
    // Promise formatted query
    static count(table) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const query = `SELECT COUNT(id) AS count FROM ${table}`;
                this.pool.query(query, (err, results, fields) => {
                    var _a;
                    if (err)
                        return reject(err);
                    resolve((_a = results[0]) === null || _a === void 0 ? void 0 : _a.count);
                });
            });
        });
    }
    static buildQueryParams(queryParams) {
        if (!queryParams)
            return "";
        const params = [];
        if (queryParams.sort) {
            params.push("ORDER BY", this.pool.escapeId(queryParams.sort), queryParams.sortDirection === "desc" ? "DESC" : "ASC");
        }
        if (queryParams.limit)
            params.push("LIMIT", this.pool.escape(parseInt(queryParams.limit)));
        if (queryParams.offset)
            params.push("OFFSET", this.pool.escape(parseInt(queryParams.offset)));
        return " " + params.join(" ");
    }
    // Incoming data is timestamp, id, value
    static write(records) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!records || records.length === 0)
                return null;
            return new Promise((resolve, reject) => {
                const query = this.pool.query("INSERT INTO `records` (`key`,`timestamp`,`name`,`value`,`run`) VALUES ? ON DUPLICATE KEY UPDATE `key`=`key`", [records], (err, results, fields) => {
                    if (err)
                        console.error("Error inserting records into DB: ", err);
                    resolve();
                });
            });
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.pool.end((err) => {
                    if (err)
                        return reject;
                    resolve();
                });
            });
        });
    }
}
exports.DB = DB;
//# sourceMappingURL=DB.js.map