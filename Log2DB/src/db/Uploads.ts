import { Table } from "./Table";
import { DB } from "./DB";

export class Uploads extends Table {
  public static async get(req, res): Promise<void> {
    try {
      const uploads = await DB.query<Array<Upload>>(
        "SELECT * FROM `uploads`",
        [],
        req.query
      );
      const count = await DB.count("uploads");
      res.json({ uploads, count });
    } catch (e) {
      console.error("Error making DB query: ", e);
      res.sendStatus(500);
    }
  }
  public static async getForRun(runId: number): Promise<Array<Upload>> {
    try {
      const uploads = await DB.query<Array<Upload>>(
        "SELECT * FROM `uploads` WHERE run = ?",
        [runId]
      );
      return uploads || [];
    } catch (e) {
      console.error("Error making DB query: ", e);
      return [];
    }
  }
  public static async post(req, res): Promise<void> {
    try {
      if (!req.body.upload) res.sendStatus(400);
      if (req.body.upload.date)
        req.body.upload.date = new Date(req.body.upload.date);
      const uploads = await DB.query(
        "INSERT INTO `uploads` SET ? ON DUPLICATE KEY UPDATE ?",
        [req.body.upload, req.body.upload]
      );
      if (uploads.affectedRows > 0) res.json({ status: "ok" });
      else res.sendStatus(400);
    } catch (e) {
      console.error("Error making DB query: ", e);
      res.sendStatus(500);
    }
  }
  public static async create(upload: NewUpload): Promise<void> {
    try {
      await DB.query("INSERT INTO `uploads` SET ?", [upload]);
    } catch (e) {
      console.error("Error making DB query: ", e);
    }
  }
  public static async update(
    id: number,
    updates: Partial<Upload>
  ): Promise<void> {
    try {
      await DB.query("UPDATE `uploads` SET ? WHERE `id`= ? ", [updates, id]);
    } catch (e) {
      console.error("Error making DB query: ", e);
    }
  }

  public static async getNext(): Promise<Upload> {
    try {
      const uploads = await DB.query<Array<Upload>>(
        "SELECT * FROM `uploads` WHERE `status`='queued' ORDER BY `timestamp` ASC LIMIT 1"
      );
      if (uploads[0]) return uploads[0];
    } catch (e) {
      console.error("Error making DB query: ", e);
    }
    return null;
  }
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
export enum UploadStatus {
  PLACEHOLDER = "placeholder",
  QUEUED = "queued",
  PROCESSING = "processing",
  COMPLETE = "complete",
  ERROR = "error",
}
