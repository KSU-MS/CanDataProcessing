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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runsRouter = void 0;
const express_1 = require("express");
const Runs_1 = require("../db/Runs");
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
const Uploads_1 = require("../db/Uploads");
const UploadProcessor_1 = require("../lib/UploadProcessor");
const promises_1 = require("fs/promises");
exports.runsRouter = express_1.Router({ mergeParams: true });
exports.runsRouter.get("/", Runs_1.Runs.get);
exports.runsRouter.post("/", Runs_1.Runs.post);
const upload = multer_1.default({ dest: "uploads/" });
exports.runsRouter.post("/:id", upload.array("files", 10), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files)
        return res.send(400);
    for (let file of req.files) {
        file = yield truncateFileAtZeros(file);
        const upload = {
            run: parseInt(req.params.id),
            originalName: file.originalname,
            path: file.path,
            status: Uploads_1.UploadStatus.QUEUED,
            size: file.size,
        };
        yield Uploads_1.Uploads.create(upload);
        UploadProcessor_1.UploadProcessor.next();
    }
    res.json({ status: "Ok" });
}));
function truncateFileAtZeros(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const buff = yield promises_1.readFile(path_1.resolve(file.path));
        let index = buff.indexOf(ZERO_DELIM);
        console.log("TRUNCATE AT: " + index);
        if (index === -1)
            return file;
        yield promises_1.truncate(file.path, index);
        file.size = index;
        return file;
    });
}
const ZERO_DELIM = new Uint8Array([
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
]);
//# sourceMappingURL=runs.js.map