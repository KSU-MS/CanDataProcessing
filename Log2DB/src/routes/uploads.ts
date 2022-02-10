import { Router } from "express";
import { Uploads } from "../db/Uploads";

export const uploadsRouter = Router({ mergeParams: true });

uploadsRouter.get("/", Uploads.get);
