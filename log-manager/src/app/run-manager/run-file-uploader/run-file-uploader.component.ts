import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Run } from "../../types/Run";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-run-file-uploader",
  templateUrl: "./run-file-uploader.component.html",
  styleUrls: ["./run-file-uploader.component.sass"],
})
export class RunFileUploaderComponent {
  public displayedColumns = ["name", "size"];
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Run,
    public api: ApiService
  ) {
    if (!data) {
      this.data = {};
    }
  }
  hasFiles(fileInput: HTMLInputElement): boolean {
    return !!(fileInput?.files && fileInput?.files?.length > 0);
  }
  getArray(fileInput: HTMLInputElement): Array<File> {
    if (fileInput.files) return Array.from(fileInput.files);
    else return [];
  }
  async upload(fileInput: HTMLInputElement) {
    if (!this.data.id || !fileInput.files) return;
    console.log("Uploading");
    await this.api.uploadRunFiles(this.data.id, fileInput.files);
    console.log("Upload Complete.");
  }
}
