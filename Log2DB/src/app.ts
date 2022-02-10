import { DB } from "./db/DB";
import { createReadStream } from "fs";
import { resolve } from "path";
import { DataParser } from "./lib/DataParser";
import { SignalArray, SignalParser } from "./lib/SignalParser";
import { CSVExporter } from "./lib/CSVExporter";

DB.init({
  host: "apt.charlesmccrary.com",
  user: "ksu",
  password: "motorsports",
  database: "ksu",
});

(async () => {
  console.time("TRT");
  const run_id = 1;
  const source = await createReadStream(
    resolve("../SampleFiles/REAL_DATA.log")
  );
  const data_parser = new DataParser();
  const signal_parser = new SignalParser();
  const csv_writer = new CSVExporter("../SampleFiles/REAL_DATA.csv");
  await signal_parser.load_signals(resolve("../SignalSpecs.csv"));
  source.pipe(data_parser);
  let i = 0;

  let buffered: Array<SignalArray> = [];

  data_parser.on("data", async (packet: Buffer) => {
    // console.log(packet.toString('hex'));
    // console.log();
    const signals = signal_parser.parse_signals(packet, run_id);
    buffered.push(...signals);

    if (buffered.length > 100) {
      i += buffered.length;
      // console.info("Transmitting.");
      data_parser.pause();
      await DB.write(buffered);
      await csv_writer.write(buffered);
      // console.info("Done.");
      buffered = [];
      data_parser.resume();
      if (i % 100) console.log(i);
    }
  });
  data_parser.on("end", async () => {
    if (buffered.length > 0) {
      // console.info("Transmitting.");
      // await DB.insert_records(buffered);
      // console.info("Done.");
      buffered = [];
    }
    csv_writer.close();
    await DB.close();
    console.log("Loaded signals: " + i);
    console.timeEnd("TRT");
  });
})();
