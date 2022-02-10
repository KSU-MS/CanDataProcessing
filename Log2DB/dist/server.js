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
const express_1 = __importDefault(require("express"));
const DB_1 = require("./db/DB");
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const UploadProcessor_1 = require("./lib/UploadProcessor");
const PORT = 3000;
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = express_1.default();
        yield DB_1.DB.init({
            host: "apt.charlesmccrary.com",
            user: "ksu",
            password: "motorsports",
            database: "ksu",
        });
        app.use(body_parser_1.default.json());
        app.use(cors_1.default());
        app.use(routes_1.appRouter);
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
        // Run background parser
        UploadProcessor_1.UploadProcessor.next();
    });
}
startServer();
//# sourceMappingURL=server.js.map