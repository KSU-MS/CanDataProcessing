import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RunManagerComponent } from "./run-manager/run-manager.component";
import { UploadManagerComponent } from "./upload-manager/upload-manager.component";

const routes: Routes = [
  { path: "runs", component: RunManagerComponent },
  { path: "uploads", component: UploadManagerComponent },
  { path: "", redirectTo: "runs", pathMatch: "full" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
