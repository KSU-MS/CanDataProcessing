/// <reference types="node" />
import { Transform } from "stream";
export declare class DataParser extends Transform {
    private partial;
    private readonly BLOCK_HEADER;
    private readonly PACKET_DELIM;
    private readonly MAX_BYTES_BEFORE_TRUNC;
    constructor(options?: {});
    on_complete(): Promise<void>;
    private parse_buffered_blocks;
    private extract_block_from;
    private extract_packets_from_block;
    _transform(chunk: any, encoding: any, callback: any): any;
}
