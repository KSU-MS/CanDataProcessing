import { Router } from "express";
import { Runs } from "../db/Runs";
import { resolve } from "path";
import multer from "multer";
import { NewUpload, Uploads, UploadStatus } from "../db/Uploads";
import { UploadProcessor } from "../lib/UploadProcessor";
import { readFile, truncate } from "fs/promises";

export const runsRouter = Router({ mergeParams: true });

runsRouter.get("/", Runs.get);
runsRouter.post("/", Runs.post);

const upload = multer({ dest: "uploads/" });
runsRouter.post("/:id", upload.array("files", 10), async (req, res, next) => {
  if (!req.files) return res.send(400);
  for (let file of req.files as Array<Express.Multer.File>) {
    file = await truncateFileAtZeros(file);
    const upload: NewUpload = {
      run: parseInt(req.params.id),
      originalName: file.originalname,
      path: file.path,
      status: UploadStatus.QUEUED,
      size: file.size,
    };
    await Uploads.create(upload);
    UploadProcessor.next();
  }
  res.json({ status: "Ok" });
});

async function truncateFileAtZeros(
  file: Express.Multer.File
): Promise<Express.Multer.File> {
  const buff = await readFile(resolve(file.path));
  let index: number = buff.indexOf(ZERO_DELIM);
  console.log("TRUNCATE AT: " + index);
  if (index === -1) return file;
  await truncate(file.path, index);
  file.size = index;
  return file;
}

const ZERO_DELIM: Uint8Array = new Uint8Array([
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
  0,
]);
