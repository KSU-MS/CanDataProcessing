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
export enum UploadStatus {
  PLACEHOLDER = "placeholder",
  QUEUED = "queued",
  PROCESSING = "processing",
  COMPLETE = "complete",
  ERROR = "error",
}
