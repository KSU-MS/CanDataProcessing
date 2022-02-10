import { createWriteStream, WriteStream } from "fs";

import { SignalArray } from "./SignalParser";

export class CSVExporter {
  private stream: WriteStream;
  constructor(path: string) {
    this.stream = createWriteStream(path, { encoding: "utf8" });
  }

  // Incoming data is timestamp, id, value
  public async write(records: Array<SignalArray>): Promise<void> {
    if (!records || records.length === 0) return null;
    return new Promise((resolve, reject) => {
      const chunk: string = records
        .map((signal) => signal.join(","))
        .join("\n");
      this.stream.write(chunk, (err) => {
        if (err) console.error(err);
        resolve();
      });
    });
  }
  public close() {
    this.stream.close();
  }
}
