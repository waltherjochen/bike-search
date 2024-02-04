import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BikeState} from '../../state/bike/bike.state';
import {Observable, take} from 'rxjs';
import {Bike, BikeSearchParams, SearchResult} from '../../shared/models/bike';
import {CommonModule} from '@angular/common';
import {AddBikeSearchParam, SearchBikes} from '../../state/bike/bike.actions';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './search.component.html',
  styles: ``
})
export class SearchComponent implements OnInit, AfterViewInit {
  @ViewChild('searchRef') searchRef: ElementRef<HTMLInputElement> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Select(BikeState.searchResult) searchResult$!: Observable<SearchResult>;
  @Select(BikeState.search) search$!: Observable<BikeSearchParams>;
  protected readonly parseInt = parseInt;

  public formGroup!: FormGroup;
  public searchResult: SearchResult | null = null;
  public searchParams: BikeSearchParams = {
    page: '1',
    per_page: '10',
  };
  public displayedColumns: string[] = ['image', 'details'];
  public dataSource = new MatTableDataSource<Bike>([]);
  public isLoading = false;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.formGroup = new FormGroup({
      search: new FormControl(''),
    });

    this.searchResult$.subscribe((searchResult) => {
      this.isLoading = false;
      this.searchResult = searchResult;
      this.dataSource = new MatTableDataSource<Bike>(this.searchResult?.bikes || []);
      this.dataSource.paginator = this.paginator;
    });

    this.search$.subscribe((searchParams) => {
      this.searchParams = searchParams;
      this.formGroup.controls['search'].setValue(searchParams.query);
      this.dataSource.paginator = this.paginator;
      this.updateUrlParams();
    });

    this.getUrlParams();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchRef?.nativeElement.focus();
    });
  }

  public onSubmit(): void {
    this.searchParams.query = this.formGroup.value.search;
    this.dispatchBikeSearch();
  }

  public handlePageEvent($event: PageEvent): void {
    this.searchParams.page = ($event.pageIndex + 1).toString();
    this.searchParams.per_page = $event.pageSize.toString();
    this.dispatchBikeSearch();
  }

  private getUrlParams(): void {
    this.route.queryParams
      .pipe(take(1))
      .subscribe((params) => {
        let localParams = {...this.searchParams};
        if (params['query']) {
          localParams.query = params['query'];
          this.formGroup.controls['search'].setValue(params['query']);
        }
        localParams.page = params['page'] ?? localParams.page;
        localParams.per_page = params['per_page'] ?? localParams.per_page;

        if (JSON.stringify(localParams) !== JSON.stringify(this.searchParams)) {
          this.searchParams = localParams;
          this.dispatchBikeSearch();
        }
      });
  }

  private updateUrlParams(): void {
    if (this.searchParams.query) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.searchParams,
        queryParamsHandling: 'merge',
      });
    }
  }

  private dispatchBikeSearch(): void {
    this.isLoading = true;
    this.updateUrlParams();
    this.store.dispatch([new AddBikeSearchParam(this.searchParams), new SearchBikes()]);
  }
}
