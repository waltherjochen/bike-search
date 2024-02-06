import {TestBed} from '@angular/core/testing';

import {BikeService} from './bike.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {mockBikes} from '../mocks/bike';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {asyncData, asyncError} from '../utils/async-observable-helpers';
import {BikeSearchParams} from '../models/bike';

describe('BikeService', () => {
  let service: BikeService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new BikeService(httpClientSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return Bikes by search', (done: DoneFn) => {
    const searchParams: BikeSearchParams = {
      page: '1',
      per_page: '10'
    }
    httpClientSpy.get.and.returnValue(asyncData({bikes: mockBikes}));

    service.search(searchParams).subscribe({
      next: (bikesResponse) => {
        expect(bikesResponse.bikes).toEqual(mockBikes);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should return Bike by id', (done: DoneFn) => {
    const expectedBike = mockBikes[0];
    httpClientSpy.get.and.returnValue(asyncData({bike: expectedBike}));

    service.getById(expectedBike.id.toString()).subscribe({
      next: (bikeResponse) => {
        expect(bikeResponse.bike).toEqual(expectedBike);
        done();
      },
      error: done.fail,
    });

    expect(httpClientSpy.get).toHaveBeenCalledTimes(1);
  });

  it('should return an error when the server returns a 404', (done: DoneFn) => {
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    httpClientSpy.get.and.returnValue(asyncError(errorResponse));

    service.getById('').subscribe({
      next: () => done.fail('expected an error, not bikes'),
      error: (error) => {
        expect(error.status).toEqual(404);
        done();
      },
    });
  });

});
