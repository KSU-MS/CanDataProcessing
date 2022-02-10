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
exports.UploadProcessor = void 0;
const Uploads_1 = require("../db/Uploads");
const fs_1 = require("fs");
const path_1 = require("path");
const DataParser_1 = require("./DataParser");
const SignalParser_1 = require("./SignalParser");
const DB_1 = require("../db/DB");
const promises_1 = require("fs/promises");
class UploadProcessor {
    static next() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.processing)
                return;
            const next = yield Uploads_1.Uploads.getNext();
            if (next)
                this.process(next);
        });
    }
    static process(upload) {
        return __awaiter(this, void 0, void 0, function* () {
            this.processing = true;
            try {
                yield Uploads_1.Uploads.update(upload.id, { status: Uploads_1.UploadStatus.PROCESSING });
                const source = yield fs_1.createReadStream(path_1.resolve(upload.path));
                const data_parser = new DataParser_1.DataParser();
                const signal_parser = new SignalParser_1.SignalParser();
                yield signal_parser.load_signals(path_1.resolve("../SignalSpecs.csv"));
                source.pipe(data_parser);
                let i = 0;
                source.on("data", (buffer) => (i += buffer.length));
                let buffered = [];
                data_parser.on("data", (packet) => __awaiter(this, void 0, void 0, function* () {
                    const signals = signal_parser.parse_signals(packet, upload.run);
                    buffered.push(...signals);
                    if (buffered.length > 100) {
                        data_parser.pause();
                        yield DB_1.DB.write(buffered);
                        yield Uploads_1.Uploads.update(upload.id, {
                            progress: (i / upload.size) * 100,
                        });
                        buffered = [];
                        data_parser.resume();
                    }
                    // console.log("Data progress: ", (i / upload.size) * 100);
                }));
                data_parser.on("end", () => __awaiter(this, void 0, void 0, function* () {
                    if (buffered.length > 0)
                        yield DB_1.DB.write(buffered);
                    yield Uploads_1.Uploads.update(upload.id, {
                        progress: (i / upload.size) * 100,
                    });
                }));
                data_parser.on("error", (e) => __awaiter(this, void 0, void 0, function* () {
                    console.error("Error parsing data: ", e);
                }));
                // This will resolve once the stream ends or errors
                yield data_parser.on_complete();
                yield Uploads_1.Uploads.update(upload.id, { status: Uploads_1.UploadStatus.COMPLETE });
            }
            catch (e) {
                console.error("Error processing upload: ", upload, e);
                yield Uploads_1.Uploads.update(upload.id, { status: Uploads_1.UploadStatus.ERROR });
            }
            try {
                // Remove the file once processed
                yield promises_1.unlink(path_1.resolve(upload.path));
            }
            catch (e) {
                console.error("Error removing upload after processing: ", upload, e);
            }
            this.processing = false;
            this.next();
        });
    }
}
exports.UploadProcessor = UploadProcessor;
UploadProcessor.processing = false;
//# sourceMappingURL=UploadProcessor.js.map