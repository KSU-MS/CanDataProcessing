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
const DB_1 = require("./db/DB");
const fs_1 = require("fs");
const path_1 = require("path");
const DataParser_1 = require("./lib/DataParser");
const SignalParser_1 = require("./lib/SignalParser");
const CSVExporter_1 = require("./lib/CSVExporter");
DB_1.DB.init({
    host: "apt.charlesmccrary.com",
    user: "ksu",
    password: "motorsports",
    database: "ksu",
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    console.time("TRT");
    const run_id = 1;
    const source = yield fs_1.createReadStream(path_1.resolve("../SampleFiles/REAL_DATA.log"));
    const data_parser = new DataParser_1.DataParser();
    const signal_parser = new SignalParser_1.SignalParser();
    const csv_writer = new CSVExporter_1.CSVExporter("../SampleFiles/REAL_DATA.csv");
    yield signal_parser.load_signals(path_1.resolve("../SignalSpecs.csv"));
    source.pipe(data_parser);
    let i = 0;
    let buffered = [];
    data_parser.on("data", (packet) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(packet.toString('hex'));
        // console.log();
        const signals = signal_parser.parse_signals(packet, run_id);
        buffered.push(...signals);
        if (buffered.length > 100) {
            i += buffered.length;
            // console.info("Transmitting.");
            data_parser.pause();
            yield DB_1.DB.write(buffered);
            yield csv_writer.write(buffered);
            // console.info("Done.");
            buffered = [];
            data_parser.resume();
            if (i % 100)
                console.log(i);
        }
    }));
    data_parser.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
        if (buffered.length > 0) {
            // console.info("Transmitting.");
            // await DB.insert_records(buffered);
            // console.info("Done.");
            buffered = [];
        }
        csv_writer.close();
        yield DB_1.DB.close();
        console.log("Loaded signals: " + i);
        console.timeEnd("TRT");
    }));
}))();
//# sourceMappingURL=app.js.map