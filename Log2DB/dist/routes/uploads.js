"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadsRouter = void 0;
const express_1 = require("express");
const Uploads_1 = require("../db/Uploads");
exports.uploadsRouter = express_1.Router({ mergeParams: true });
exports.uploadsRouter.get("/", Uploads_1.Uploads.get);
//# sourceMappingURL=uploads.js.map