import { SignalArray } from "./SignalParser";
export declare class CSV {
    private stream;
    constructor(path: string);
    write(records: Array<SignalArray>): Promise<void>;
    close(): void;
}
