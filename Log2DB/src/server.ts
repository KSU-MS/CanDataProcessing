import express from "express";
import { DB } from "./db/DB";
import { appRouter } from "./routes";
import bodyParser from "body-parser";
import cors from "cors";
import { UploadProcessor } from "./lib/UploadProcessor";

const PORT: number = 3000;
async function startServer() {
  const app = express();

  await DB.init({
    host: "apt.charlesmccrary.com",
    user: "ksu",
    password: "motorsports",
    database: "ksu",
  });
  app.use(bodyParser.json());
  app.use(cors());
  app.use(appRouter);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
  // Run background parser
  UploadProcessor.next();
}

startServer();
