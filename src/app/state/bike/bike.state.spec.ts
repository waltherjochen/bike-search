import {TestBed} from '@angular/core/testing';
import {NgxsModule, Store} from '@ngxs/store';
import {BikeState} from './bike.state';
import {BikeService} from '../../shared/services/bike.service';
import {lastValueFrom, of} from 'rxjs';
import {AddBikeSearchParam, SearchBikes, SelectBike} from './bike.actions';
import {mockBikes} from '../../shared/mocks/bike';
import {BikeSearchResponse} from '../../shared/models/bike';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('BikeState', () => {
  let store: Store;
  let bikeService: BikeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        NgxsModule.forRoot([BikeState]),
        HttpClientTestingModule
      ]
    });

    store = TestBed.inject(Store);
    bikeService = TestBed.inject(BikeService);
  });

  it('should update search parameters', async () => {
    const searchParams = {page: '2', per_page: '20'};
    await store.dispatch(new AddBikeSearchParam(searchParams)).toPromise();

    const search = store.selectSnapshot(BikeState.search);
    expect(search).toEqual(searchParams);
  });

  it('should update search result', async () => {
    const fakeSearchResult = {bikes: mockBikes, total: 4};
    const fakeSearchCountResponse: BikeSearchResponse = {
      proximity: 4,
      stolen: 0,
      non: 0
    }
    spyOn(bikeService, 'search').and.returnValue(of(fakeSearchResult));
    spyOn(bikeService, 'searchCount').and.returnValue(of(fakeSearchCountResponse));

    await lastValueFrom(store.dispatch(new SearchBikes()));

    const searchResult = store.selectSnapshot(BikeState.searchResult);
    expect(searchResult).toEqual({bikes: fakeSearchResult.bikes, total: fakeSearchResult.total});
  });

  it('should select a bike', async () => {
    const fakeBike = mockBikes[0];
    spyOn(bikeService, 'getById').and.returnValue(of({bike: fakeBike}));

    await lastValueFrom(store.dispatch(new SelectBike(fakeBike.id.toString())));

    const selectedBike = store.selectSnapshot(BikeState.selectedBike);
    expect(selectedBike).toEqual(fakeBike);
  });

});
