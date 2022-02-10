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
exports.UploadStatus = exports.Uploads = void 0;
const Table_1 = require("./Table");
const DB_1 = require("./DB");
class Uploads extends Table_1.Table {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploads = yield DB_1.DB.query("SELECT * FROM `uploads`", [], req.query);
                const count = yield DB_1.DB.count("uploads");
                res.json({ uploads, count });
            }
            catch (e) {
                console.error("Error making DB query: ", e);
                res.sendStatus(500);
            }
        });
    }
    static getForRun(runId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploads = yield DB_1.DB.query("SELECT * FROM `uploads` WHERE run = ?", [runId]);
                return uploads || [];
            }
            catch (e) {
                console.error("Error making DB query: ", e);
                return [];
            }
        });
    }
    static post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.upload)
                    res.sendStatus(400);
                if (req.body.upload.date)
                    req.body.upload.date = new Date(req.body.upload.date);
                const uploads = yield DB_1.DB.query("INSERT INTO `uploads` SET ? ON DUPLICATE KEY UPDATE ?", [req.body.upload, req.body.upload]);
                if (uploads.affectedRows > 0)
                    res.json({ status: "ok" });
                else
                    res.sendStatus(400);
            }
            catch (e) {
                console.error("Error making DB query: ", e);
                res.sendStatus(500);
            }
        });
    }
    static create(upload) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield DB_1.DB.query("INSERT INTO `uploads` SET ?", [upload]);
            }
            catch (e) {
                console.error("Error making DB query: ", e);
            }
        });
    }
    static update(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield DB_1.DB.query("UPDATE `uploads` SET ? WHERE `id`= ? ", [updates, id]);
            }
            catch (e) {
                console.error("Error making DB query: ", e);
            }
        });
    }
    static getNext() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const uploads = yield DB_1.DB.query("SELECT * FROM `uploads` WHERE `status`='queued' ORDER BY `timestamp` ASC LIMIT 1");
                if (uploads[0])
                    return uploads[0];
            }
            catch (e) {
                console.error("Error making DB query: ", e);
            }
            return null;
        });
    }
}
exports.Uploads = Uploads;
var UploadStatus;
(function (UploadStatus) {
    UploadStatus["PLACEHOLDER"] = "placeholder";
    UploadStatus["QUEUED"] = "queued";
    UploadStatus["PROCESSING"] = "processing";
    UploadStatus["COMPLETE"] = "complete";
    UploadStatus["ERROR"] = "error";
})(UploadStatus = exports.UploadStatus || (exports.UploadStatus = {}));
//# sourceMappingURL=Uploads.js.map