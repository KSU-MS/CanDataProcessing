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
        this.connection = mysql_1.createConnection(config);
        this.connection.connect((err) => {
            if (err) {
                console.error("error connecting: " + err.stack);
                return;
            }
            console.log("connected as id " + this.connection.threadId);
        });
    }
    // Incoming data is timestamp, id, value
    static write(records) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!records || records.length === 0)
                return null;
            return new Promise((resolve, reject) => {
                const query = this.connection.query("INSERT INTO ksu.records  (timestamp, name, value,run) VALUES ?", [records], (err, results, fields) => {
                    if (err) {
                        console.error(err);
                        resolve(null);
                    }
                    resolve(fields);
                });
            });
        });
    }
    static close() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection.end((err) => {
                    if (err)
                        console.error(err);
                    resolve();
                });
            });
        });
    }
}
exports.DB = DB;
//# sourceMappingURL=DB.js.map