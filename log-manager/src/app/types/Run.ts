import { Upload } from "./Upload";

export interface Run {
  id?: number;
  name?: string;
  location?: string;
  notes?: string;
  date?: Date;
}

export type RunWithUploads = Run & { uploads: Array<Upload> };
