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
exports.DataParser = void 0;
const stream_1 = require("stream");
class DataParser extends stream_1.Transform {
    constructor(options = {}) {
        super(Object.assign({ objectMode: false, decodeStrings: false }, options));
        this.BLOCK_HEADER = new Uint8Array([
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
        this.PACKET_DELIM = new Uint8Array([0xaa, 0xaa]);
        // This is the max bytes beyond a valid block that we will read before we assume the file was not truncated and stop looking
        this.MAX_BYTES_BEFORE_TRUNC = 512 * 100; // 100 Blocks
        this.partial = Buffer.from([]);
    }
    on_complete() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                this.on("close", resolve);
            });
        });
    }
    parse_buffered_blocks() {
        let index = this.partial.indexOf(this.BLOCK_HEADER);
        while (index !== -1) {
            this.extract_block_from(this.partial.indexOf(this.BLOCK_HEADER));
            index = this.partial.indexOf(this.BLOCK_HEADER);
        }
        // End stream if max bytes with no data is reached
        if (this.partial.length > this.MAX_BYTES_BEFORE_TRUNC)
            this.end();
    }
    extract_block_from(index) {
        // Extract block
        const block = this.partial.slice(index, 512);
        // Remove block from partial
        this.partial = this.partial.slice(index + 512);
        this.extract_packets_from_block(block);
    }
    extract_packets_from_block(block) {
        let index = block.indexOf(this.PACKET_DELIM);
        while (index !== -1) {
            // Including delim here for future error checking
            const packet = block.slice(index - 14, index + 2);
            this.push(packet);
            index = block.indexOf(this.PACKET_DELIM, index + 1);
        }
    }
    _transform(chunk, encoding, callback) {
        if (!chunk)
            return callback();
        // Append buffer to our partial
        this.partial = Buffer.concat([this.partial, chunk]);
        // Extract all blocks
        this.parse_buffered_blocks();
        callback();
    }
}
exports.DataParser = DataParser;
//# sourceMappingURL=DataParser.js.map