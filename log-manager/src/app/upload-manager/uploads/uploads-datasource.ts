import { DataSource } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { map, mergeMap } from "rxjs/operators";
import { Observable, of as observableOf, merge, of } from "rxjs";
import { Upload } from "../../types/Upload";
import { ApiService, QueryParams } from "../../services/api.service";

/**
 * Data source for the Uploads view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class UploadsDataSource extends DataSource<Upload> {
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
  connect(): Observable<Array<Upload>> {
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
          return this.api.getUploads(filters);
        }),
        map(({ uploads, count }) => {
          if (this.paginator) this.paginator.length = count;
          return uploads;
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
