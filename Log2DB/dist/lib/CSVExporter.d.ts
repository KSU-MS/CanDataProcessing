import { SignalArray } from "./SignalParser";
export declare class CSVExporter {
    private stream;
    constructor(path: string);
    write(records: Array<SignalArray>): Promise<void>;
    close(): void;
}
