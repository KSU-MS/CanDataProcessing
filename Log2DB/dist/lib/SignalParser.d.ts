/// <reference types="node" />
export declare class SignalParser {
    private signal_specs;
    constructor();
    load_signals(path: string): Promise<void>;
    parse_signals(packet: Buffer, run: number): Array<SignalArray>;
    private static extract_spec;
    private static extract_raw;
}
export interface SignalSpec {
    name: string;
    start: number;
    size: number;
    signed: boolean;
    little_endian: boolean;
    scale: number;
    offset: number;
    units: string;
    notes: string;
}
export interface Signal {
    timestamp: number;
    name: string;
    value: number;
    run: number;
}
export declare type SignalArray = [
    key: string,
    timestamp: Date,
    name: string,
    value: number,
    run: number
];
