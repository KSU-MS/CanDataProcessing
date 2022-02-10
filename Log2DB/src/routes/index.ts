import { Router } from "express";
import { runsRouter } from "./runs";
import { uploadsRouter } from "./uploads";

export const appRouter = Router({ mergeParams: true });

appRouter.get("/", (req, res) => {
  res.send("API Online");
});

appRouter.use("/runs", runsRouter);
appRouter.use("/uploads", uploadsRouter);
