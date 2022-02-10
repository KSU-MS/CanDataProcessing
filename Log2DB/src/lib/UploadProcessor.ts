import { Upload, Uploads, UploadStatus } from "../db/Uploads";
import { createReadStream } from "fs";
import { resolve } from "path";
import { DataParser } from "./DataParser";
import { SignalArray, SignalParser } from "./SignalParser";
import { DB } from "../db/DB";
import { unlink } from "fs/promises";

export class UploadProcessor {
  private static processing: boolean = false;
  public static async next() {
    if (this.processing) return;
    const next: Upload = await Uploads.getNext();
    if (next) this.process(next);
  }
  private static async process(upload: Upload) {
    this.processing = true;
    try {
      await Uploads.update(upload.id, { status: UploadStatus.PROCESSING });
      const source = await createReadStream(resolve(upload.path));
      const data_parser = new DataParser();
      const signal_parser = new SignalParser();

      await signal_parser.load_signals(resolve("../SignalSpecs.csv"));
      source.pipe(data_parser);
      let i = 0;
      source.on("data", (buffer) => (i += buffer.length));
      let buffered: Array<SignalArray> = [];

      data_parser.on("data", async (packet: Buffer) => {
        const signals = signal_parser.parse_signals(packet, upload.run);
        buffered.push(...signals);

        if (buffered.length > 100) {
          data_parser.pause();
          await DB.write(buffered);
          await Uploads.update(upload.id, {
            progress: (i / upload.size) * 100,
          });
          buffered = [];
          data_parser.resume();
        }
        // console.log("Data progress: ", (i / upload.size) * 100);
      });
      data_parser.on("end", async () => {
        if (buffered.length > 0) await DB.write(buffered);
        await Uploads.update(upload.id, {
          progress: (i / upload.size) * 100,
        });
      });
      data_parser.on("error", async (e) => {
        console.error("Error parsing data: ", e);
      });
      // This will resolve once the stream ends or errors
      await data_parser.on_complete();
      await Uploads.update(upload.id, { status: UploadStatus.COMPLETE });
    } catch (e) {
      console.error("Error processing upload: ", upload, e);
      await Uploads.update(upload.id, { status: UploadStatus.ERROR });
    }
    try {
      // Remove the file once processed
      await unlink(resolve(upload.path));
    } catch (e) {
      console.error("Error removing upload after processing: ", upload, e);
    }
    this.processing = false;
    this.next();
  }
}
