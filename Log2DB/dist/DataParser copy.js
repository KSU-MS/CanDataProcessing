"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataParser = void 0;
const stream_1 = require("stream");
class DataParser extends stream_1.Transform {
    constructor(options = {}) {
        super(Object.assign({ objectMode: false, decodeStrings: false }, options));
        this.BLOCK_HEADER = new Uint8Array([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0xff]);
        this.partial = Buffer.from([]);
    }
    parse_buffered_blocks() {
        const blocks = [];
        let index = this.partial.indexOf(this.BLOCK_HEADER);
        while (index !== -1) {
            const block = this.extract_block_from(this.partial.indexOf(this.BLOCK_HEADER));
            blocks.push(block);
            index = this.partial.indexOf(this.BLOCK_HEADER);
        }
        return blocks;
    }
    extract_block_from(index) {
        // Extract block
        const block = this.partial.slice(index, 512);
        // Remove block from partial
        this.partial = this.partial.slice(index + 512);
        return block;
    }
    _transform(chunk, encoding, callback) {
        if (!chunk)
            return callback();
        // Append buffer to our partial
        this.partial = Buffer.concat([this.partial, chunk]);
        // Extract all blocks
        const blocks = this.parse_buffered_blocks();
        // Push blocks to output
        for (let block of blocks)
            this.push(block);
        callback();
    }
}
exports.DataParser = DataParser;
//# sourceMappingURL=DataParser%20copy.js.map