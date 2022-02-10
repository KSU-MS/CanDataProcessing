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
exports.Runs = void 0;
const Table_1 = require("./Table");
const DB_1 = require("./DB");
const Uploads_1 = require("./Uploads");
class Runs extends Table_1.Table {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let runs = yield DB_1.DB.query("SELECT * FROM `runs`", [], req.query);
                runs = yield Promise.all(runs.map((run) => __awaiter(this, void 0, void 0, function* () {
                    run.uploads = yield Uploads_1.Uploads.getForRun(run.id);
                    return run;
                })));
                const count = yield DB_1.DB.count("runs");
                res.json({ runs, count });
            }
            catch (e) {
                console.error("Error making DB query: ", e);
                res.sendStatus(500);
            }
        });
    }
    static post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.body.run)
                    res.sendStatus(400);
                if (req.body.run.date)
                    req.body.run.date = new Date(req.body.run.date);
                const runs = yield DB_1.DB.query("INSERT INTO `runs` SET ? ON DUPLICATE KEY UPDATE ?", [req.body.run, req.body.run]);
                if (runs.affectedRows > 0)
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
}
exports.Runs = Runs;
//# sourceMappingURL=Runs.js.map