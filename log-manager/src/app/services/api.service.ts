import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { BehaviorSubject, interval, Observable, timer } from "rxjs";
import { Run, RunWithUploads } from "../types/Run";
import { switchMap } from "rxjs/operators";
import { Upload } from "../types/Upload";

@Injectable({
  providedIn: "root",
})
export class ApiService {
  private readonly API_URL: string = "http://localhost:3000";
  private updaters = { runs: new BehaviorSubject<null>(null) };
  constructor(private http: HttpClient) {}

  getRuns(
    params: QueryParams = {}
  ): Observable<{ runs: Array<RunWithUploads>; count: number }> {
    return this.updaters.runs.pipe(
      switchMap(() =>
        this.http.get<{ runs: Array<RunWithUploads>; count: number }>(
          this.API_URL + "/runs",
          {
            params: params as HttpParams,
          }
        )
      )
    );
  }
  async postRun(run: Run, params: QueryParams = {}): Promise<void> {
    await this.http
      .post<Array<Run>>(
        this.API_URL + "/runs",
        { run },
        {
          params: params as HttpParams,
        }
      )
      .toPromise();
    this.updaters.runs.next(null);
  }
  async uploadRunFiles(runId: number, files: FileList) {
    if (files.length > 0) {
      // Create form data
      let formData: FormData = new FormData();

      // Append all files
      for (let i = 0; i < files.length; i++) {
        const file: File = files[i];
        formData.append("files", file, file.name);
      }

      return await this.http
        .post(this.API_URL + "/runs/" + runId, formData)
        .toPromise();
    }
    return null;
  }

  getUploads(
    params: QueryParams = {}
  ): Observable<{ uploads: Array<Upload>; count: number }> {
    return timer(0, 5000).pipe(
      switchMap(() =>
        this.http.get<{ uploads: Array<Upload>; count: number }>(
          this.API_URL + "/uploads",
          {
            params: params as HttpParams,
          }
        )
      )
    );
  }
}

export interface QueryParams {
  offset?: number;
  limit?: number;
  sort?: string;
  sortDirection?: "asc" | "desc" | "";
}
