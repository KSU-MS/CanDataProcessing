/// <reference types="node" />
import { Transform } from "stream";
export declare class DataParser extends Transform {
    private partial;
    private readonly BLOCK_HEADER;
    constructor(options?: {});
    private parse_buffered_blocks;
    private extract_block_from;
    _transform(chunk: any, encoding: any, callback: any): any;
}
