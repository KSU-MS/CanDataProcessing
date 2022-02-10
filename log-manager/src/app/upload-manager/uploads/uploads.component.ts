import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { Upload } from "../../types/Upload";
import { UploadsDataSource } from "../../upload-manager/uploads/uploads-datasource";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-uploads",
  templateUrl: "./uploads.component.html",
  styleUrls: ["./uploads.component.sass"],
})
export class UploadsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Upload>;
  @Input() dataSource: UploadsDataSource;
  @Output() editUpload = new EventEmitter<Upload>();
  @Output() uploadData = new EventEmitter<Upload>();

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = [
    "id",
    "run",
    "originalName",
    "timestamp",
    "size",
    "status",
    "progress",
  ];

  constructor(private api: ApiService) {
    this.dataSource = new UploadsDataSource(api);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }
}
