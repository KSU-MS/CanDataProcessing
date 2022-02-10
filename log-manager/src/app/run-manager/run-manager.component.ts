import { Component } from "@angular/core";
import { ApiService } from "../services/api.service";
import { MatDialog } from "@angular/material/dialog";
import { RunEditorDialogComponent } from "./run-editor-dialog/run-editor-dialog.component";
import { Run } from "../types/Run";
import { MatSnackBar } from "@angular/material/snack-bar";
import { RunFileUploaderComponent } from "./run-file-uploader/run-file-uploader.component";

@Component({
  selector: "app-run-manager",
  templateUrl: "./run-manager.component.html",
  styleUrls: ["./run-manager.component.sass"],
})
export class RunManagerComponent {
  constructor(
    public dialog: MatDialog,
    public api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  openDialog(data?: Run) {
    const dialogRef = this.dialog.open(RunEditorDialogComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      try {
        if (result) await this.api.postRun(result);
      } catch (e) {
        this.snackBar.open("Unable to save run data", undefined, {
          duration: 7000,
        });
        console.error(e);
      }
      console.log(`Dialog result: `, result);
    });
  }

  openUploadDialog(data: Run) {
    const dialogRef = this.dialog.open(RunFileUploaderComponent, {
      data,
    });
  }
}
