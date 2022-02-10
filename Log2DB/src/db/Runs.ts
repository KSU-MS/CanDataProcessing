import { Table } from "./Table";
import { DB } from "./DB";
import { Upload, Uploads } from "./Uploads";

export class Runs extends Table {
  public static async get(req, res): Promise<void> {
    try {
      let runs = await DB.query<Array<Run & { uploads: Array<Upload> }>>(
        "SELECT * FROM `runs`",
        [],
        req.query
      );
      runs = await Promise.all(
        runs.map(async (run) => {
          run.uploads = await Uploads.getForRun(run.id);
          return run;
        })
      );
      const count = await DB.count("runs");
      res.json({ runs, count });
    } catch (e) {
      console.error("Error making DB query: ", e);
      res.sendStatus(500);
    }
  }
  public static async post(req, res): Promise<void> {
    try {
      if (!req.body.run) res.sendStatus(400);
      if (req.body.run.date) req.body.run.date = new Date(req.body.run.date);
      const runs = await DB.query(
        "INSERT INTO `runs` SET ? ON DUPLICATE KEY UPDATE ?",
        [req.body.run, req.body.run]
      );
      if (runs.affectedRows > 0) res.json({ status: "ok" });
      else res.sendStatus(400);
    } catch (e) {
      console.error("Error making DB query: ", e);
      res.sendStatus(500);
    }
  }
}
export interface Run {
  id: number;
  name: string;
  date: Date;
}
