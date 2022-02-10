"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DB_1 = require("./db/DB");
DB_1.DB.init({
    host: "192.168.1.67",
    user: "ksu",
    password: "motorsports",
    database: "ksu",
});
//
// (async () => {
//   console.log("init");
//   console.time("TRT");
//   const run_id = 1;
//   // const source = await createReadStream(
//   //   resolve("../SampleFiles/RealRun2/all.log")
//   // );
//   // const data_parser = new DataParser();
//   const signal_parser = new SignalParser();
//
//   await signal_parser.load_signals(resolve("../SignalSpecs.csv"));
//   const serial = new SerialParser("/dev/tty.SLAB_USBtoUART");
//   // serial.on("data", (packet) => {
//   //   const signals = signal_parser.parse_signals(packet, run_id);
//   //   console.table(signals);
//   // });
//   // const csv_writer = new CSVExporter("../SampleFiles/RealRun2/out.csv");
//   // source.pipe(data_parser);
//   let i = 0;
//
//   let buffered: Array<SignalArray> = [];
//
//   serial.on("data", async (packet: Buffer) => {
//     // console.log(packet.toString('hex'));
//     console.log(packet.length);
//     const signals = signal_parser.parse_signals(packet, run_id);
//     buffered.push(...signals);
//
//     if (buffered.length > 5) {
//       i += buffered.length;
//       console.info(`Added ${buffered.length} of ${i}`);
//       serial.pause();
//       await DB.write(buffered);
//       // console.info("Done.");
//       buffered = [];
//       serial.resume();
//       if (i % 100) console.log(i);
//     }
//   });
//   serial.on("end", async () => {
//     if (buffered.length > 0) {
//       // console.info("Transmitting.");
//       // await DB.insert_records(buffered);
//       // console.info("Done.");
//       buffered = [];
//     }
//     // serial.close();
//     await DB.close();
//     console.log("Loaded signals: " + i);
//     console.timeEnd("TRT");
//   });
// })();
//# sourceMappingURL=app_rf.js.map