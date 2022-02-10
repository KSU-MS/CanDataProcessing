import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, mergeMap } from "rxjs/operators";
import { Observable, of as observableOf, merge, of } from "rxjs";
import { Run, RunWithUploads } from "../../types/Run";
import { ApiService, QueryParams } from "../../services/api.service";
import { Upload } from "../../types/Upload";

/**
 * Data source for the Runs view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RunsDataSource extends DataSource<RunWithUploads> {
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor(private api: ApiService) {
    super();
  }
  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<Array<RunWithUploads>> {
    if (this.paginator && this.sort) {
      return merge(of([]), this.paginator.page, this.sort.sortChange).pipe(
        mergeMap(() => {
          let filters: QueryParams = {};
          if (this.sort?.active) {
            filters.sort = this.sort.active;
            filters.sortDirection = this.sort.direction;
          }
          if (this.paginator) {
            filters.offset = this.paginator.pageIndex * this.paginator.pageSize;
            filters.limit = this.paginator.pageSize;
          }
          return this.api.getRuns(filters);
        }),
        map(({ runs, count }) => {
          if (this.paginator) this.paginator.length = count;
          return runs;
        })
      );
    } else {
      throw Error(
        "Please set the paginator and sort on the data source before connecting."
      );
    }
  }

  disconnect(): void {}
}
