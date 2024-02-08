import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {SearchComponent} from './search.component';
import {NgxsModule, Store} from '@ngxs/store';
import {ReactiveFormsModule} from '@angular/forms';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatIconModule} from '@angular/material/icon';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {AddBikeSearchParam, SearchBikes, SelectBike} from '../../state/bike/bike.actions';
import {BikeState} from '../../state/bike/bike.state';
import {Bike} from '../../shared/models/bike';
import {ActivatedRoute, Router} from '@angular/router';
import {of} from 'rxjs';
import {mockBikes} from '../../shared/mocks/bike';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let store: Store;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        SearchComponent,
        NgxsModule.forRoot([BikeState]),
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatTableModule,
        MatPaginatorModule,
        MatIconModule,
        RouterTestingModule,
        HttpClientTestingModule
      ]
    })
      .compileComponents();

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch SearchBikes action on form submit', () => {
    spyOn(store, 'dispatch');
    component.formGroup.controls['search'].setValue('test query');
    component.onSubmit();
    expect(store.dispatch).toHaveBeenCalledWith([
      jasmine.any(AddBikeSearchParam),
      jasmine.any(SearchBikes)
    ]);
  });

  it('should handle page event correctly', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    const pageEvent: PageEvent = {
      pageIndex: 0,
      pageSize: 20,
      length: 100
    };

    component.handlePageEvent(pageEvent);

    expect(component.searchParams.page).toEqual('1');
    expect(component.searchParams.per_page).toEqual('20');
    expect(storeDispatchSpy).toHaveBeenCalledWith([
      jasmine.any(AddBikeSearchParam),
      jasmine.any(SearchBikes)
    ]);
  });

  it('should navigate to bike details on selectBike', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');
    const storeDispatchSpy = spyOn(store, 'dispatch').and.returnValue(of(mockBikes[0]));
    const testBike: Bike = mockBikes[0];
    component.selectBike(testBike);
    tick();

    expect(storeDispatchSpy).toHaveBeenCalledWith(jasmine.any(SelectBike));
    expect(navigateSpy).toHaveBeenCalledWith(['bike', testBike.id]);
  }));

  it('should correctly initialize paginator after view init', () => {
    component.ngAfterViewInit();
    expect(component.dataSource.paginator).toBe(component.paginator);
  });

  it('should show error message on search result failure', fakeAsync(() => {
    component.isSearchResultError = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.error-message')).toBeTruthy();
  }));

  it('should not dispatch search action if search query is empty', () => {
    const storeDispatchSpy = spyOn(store, 'dispatch');
    component.formGroup.controls['search'].setValue('');
    component.onSubmit();

    expect(storeDispatchSpy).not.toHaveBeenCalledWith(jasmine.any(SearchBikes));
  });

  it('should update URL parameters on search', fakeAsync(() => {
    const navigateSpy = spyOn(router, 'navigate');

    component.searchParams.page = '1';
    component.searchParams.per_page = '10';
    component.searchParams.query = '';
    component.formGroup.controls['search'].setValue('new search');
    component.onSubmit();
    tick();

    expect(navigateSpy).toHaveBeenCalledWith([], {
      relativeTo: route,
      queryParams: {query: 'new search', page: '1', per_page: '10'},
      queryParamsHandling: 'merge',
    });
  }));

});
