import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTable } from "@angular/material/table";
import { RunsDataSource } from "./runs-datasource";
import { Run, RunWithUploads } from "../../types/Run";
import { ApiService } from "../../services/api.service";
import { EventEmitter } from "@angular/core";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { Observable, Subject } from "rxjs";

@Component({
  selector: "app-runs",
  templateUrl: "./runs.component.html",
  styleUrls: ["./runs.component.sass"],
  animations: [
    trigger("detailExpand", [
      state("collapsed", style({ height: "0px", minHeight: "0" })),
      state("expanded", style({ height: "*" })),
      transition(
        "expanded <=> collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
})
export class RunsComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Run>;
  @Input() dataSource: RunsDataSource;
  @Output() editRun = new EventEmitter<Run>();
  @Output() uploadData = new EventEmitter<Run>();
  public data: Subject<Array<RunWithUploads>> = new Subject();

  expanded = null;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ["id", "name", "location", "date", "controls"];

  constructor(private api: ApiService, private ref: ChangeDetectorRef) {
    this.dataSource = new RunsDataSource(api);
  }

  ngAfterViewInit(): void {
    this.table.dataSource = this.dataSource;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSource.connect().subscribe(this.data);
    this.ref.markForCheck();
  }
}
