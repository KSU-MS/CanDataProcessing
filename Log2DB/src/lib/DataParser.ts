import { Transform } from "stream";

export class DataParser extends Transform {
  private partial: Buffer;
  private readonly BLOCK_HEADER: Uint8Array = new Uint8Array([
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
    0xff,
  ]);
  private readonly PACKET_DELIM: Uint8Array = new Uint8Array([0xaa, 0xaa]);
  // This is the max bytes beyond a valid block that we will read before we assume the file was not truncated and stop looking
  private readonly MAX_BYTES_BEFORE_TRUNC = 512 * 100; // 100 Blocks

  constructor(options = {}) {
    super({
      objectMode: false,
      decodeStrings: false,
      ...options,
    });
    this.partial = Buffer.from([]);
  }
  public async on_complete(): Promise<void> {
    return new Promise((resolve) => {
      this.on("close", resolve);
    });
  }

  private parse_buffered_blocks() {
    let index: number = this.partial.indexOf(this.BLOCK_HEADER);
    while (index !== -1) {
      this.extract_block_from(this.partial.indexOf(this.BLOCK_HEADER));
      index = this.partial.indexOf(this.BLOCK_HEADER);
    }
    // End stream if max bytes with no data is reached
    if (this.partial.length > this.MAX_BYTES_BEFORE_TRUNC) this.end();
  }
  private extract_block_from(index: number) {
    // Extract block
    const block = this.partial.slice(index, 512);
    // Remove block from partial
    this.partial = this.partial.slice(index + 512);

    this.extract_packets_from_block(block);
  }
  private extract_packets_from_block(block) {
    let index: number = block.indexOf(this.PACKET_DELIM);
    while (index !== -1) {
      // Including delim here for future error checking
      const packet = block.slice(index - 14, index + 2);
      this.push(packet);
      index = block.indexOf(this.PACKET_DELIM, index + 1);
    }
  }
  _transform(chunk, encoding, callback) {
    if (!chunk) return callback();
    // Append buffer to our partial
    this.partial = Buffer.concat([this.partial, chunk]);

    // Extract all blocks
    this.parse_buffered_blocks();

    callback();
  }
}
