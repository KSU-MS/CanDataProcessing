import { Component, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Run } from "../../types/Run";

@Component({
  selector: "app-run-editor-dialog",
  templateUrl: "./run-editor-dialog.component.html",
  styleUrls: ["./run-editor-dialog.component.sass"],
})
export class RunEditorDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Run) {
    if (!data) {
      this.data = {};
    }
  }
}
