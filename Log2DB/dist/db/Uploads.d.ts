import { Table } from "./Table";
export declare class Uploads extends Table {
    static get(req: any, res: any): Promise<void>;
    static getForRun(runId: number): Promise<Array<Upload>>;
    static post(req: any, res: any): Promise<void>;
    static create(upload: NewUpload): Promise<void>;
    static update(id: number, updates: Partial<Upload>): Promise<void>;
    static getNext(): Promise<Upload>;
}
export interface Upload {
    id?: number;
    run: number;
    path: string;
    originalName: string;
    progress: number;
    size: number;
    status: UploadStatus;
    timestamp: Date;
}
export interface NewUpload {
    run: number;
    path: string;
    originalName: string;
    size: number;
    status?: UploadStatus;
}
export declare enum UploadStatus {
    PLACEHOLDER = "placeholder",
    QUEUED = "queued",
    PROCESSING = "processing",
    COMPLETE = "complete",
    ERROR = "error"
}
