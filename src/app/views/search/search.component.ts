import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Select, Store} from '@ngxs/store';
import {BikeState} from '../../state/bike/bike.state';
import {Observable, Subject, take, takeUntil} from 'rxjs';
import {Bike, BikeSearchParams, SearchResult} from '../../shared/models/bike';
import {CommonModule} from '@angular/common';
import {AddBikeSearchParam, SearchBikes, SelectBike} from '../../state/bike/bike.actions';
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
export class SearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('searchRef') searchRef: ElementRef<HTMLInputElement> | undefined;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Select(BikeState.searchResult) searchResult$!: Observable<SearchResult>;
  @Select(BikeState.isSearchResultError) isSearchResultError$!: Observable<boolean | null>;
  @Select(BikeState.search) search$!: Observable<BikeSearchParams>;
  @Select(BikeState.selectedBike) selectedBike$!: Observable<Bike | null>;
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
  public isSearchResultError = false;
  public isSearchParamsError = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initFormGroup();
    this.subscribeToBikeState();
    this.getUrlParams();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.searchRef?.nativeElement.focus();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public onSubmit(): void {
    this.searchParams.location = this.formGroup.value.search;
    this.dispatchBikeSearch();
  }

  public handlePageEvent($event: PageEvent): void {
    this.searchParams.page = ($event.pageIndex + 1).toString();
    this.searchParams.per_page = $event.pageSize.toString();
    this.dispatchBikeSearch();
  }

  public selectBike(bike: Bike): void {
    this.store.dispatch(new SelectBike(bike.id.toString()));

    this.selectedBike$.pipe(takeUntil(this.destroy$)).subscribe((selectedBike) => {
      if (selectedBike) {
        void this.router.navigate(['bike', bike.id]);
      }
    });
  }

  private initFormGroup() {
    this.formGroup = new FormGroup({
      search: new FormControl(''),
    });
  }

  private subscribeToBikeState() {
    this.searchResult$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (searchResult) => {
        this.isLoading = false;
        this.searchResult = searchResult;
        this.dataSource = new MatTableDataSource<Bike>(this.searchResult?.bikes || []);
        this.dataSource.paginator = this.paginator;
      },
      error: () => {
        this.isLoading = false;
        this.isSearchResultError = true;
      }
    });

    this.search$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (searchParams) => {
        this.searchParams = searchParams;
        this.formGroup.controls['search'].setValue(searchParams.location);
        this.dataSource.paginator = this.paginator;
        this.updateUrlParams();
      },
      error: () => {
        this.isSearchParamsError = true;
      }
    });

    this.isSearchResultError$.pipe(takeUntil(this.destroy$)).subscribe((isSearchResultError) => {
      this.isLoading = false;
      this.isSearchResultError = !!isSearchResultError;
    });
  }

  private getUrlParams(): void {
    this.route.queryParams
      .pipe(take(1))
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        let localParams = {...this.searchParams};
        if (params['location']) {
          localParams.location = params['location'];
          this.formGroup.controls['search'].setValue(params['location']);
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
    if (this.searchParams.location) {
      void this.router.navigate([], {
        relativeTo: this.route,
        queryParams: this.searchParams,
        queryParamsHandling: 'merge',
      });
    }
  }

  private dispatchBikeSearch(): void {
    this.isLoading = true;
    this.isSearchResultError = false;
    this.isSearchParamsError = false;
    this.updateUrlParams();
    this.store.dispatch([new AddBikeSearchParam(this.searchParams), new SearchBikes()]);
  }
}
