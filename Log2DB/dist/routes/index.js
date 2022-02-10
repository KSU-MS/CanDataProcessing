"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appRouter = void 0;
const express_1 = require("express");
const runs_1 = require("./runs");
const uploads_1 = require("./uploads");
exports.appRouter = express_1.Router({ mergeParams: true });
exports.appRouter.get("/", (req, res) => {
    res.send("API Online");
});
exports.appRouter.use("/runs", runs_1.runsRouter);
exports.appRouter.use("/uploads", uploads_1.uploadsRouter);
//# sourceMappingURL=index.js.map