import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bike, BikeSearchParams, BikeSearchResponse} from '../models/bike';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  search(params: BikeSearchParams): Observable<{bikes: Bike[]}> {
    return this.http.get<{bikes: Bike[]}>(`${this.baseUrl}/search?${new URLSearchParams({...params}).toString()}`);
  }

  searchCount(params: BikeSearchParams): Observable<BikeSearchResponse> {
    return this.http.get<BikeSearchResponse>(`${this.baseUrl}/search/count?${new URLSearchParams({...params}).toString()}`);
  }

  getById(id: string): Observable<Bike> {
    return this.http.get<Bike>(`${this.baseUrl}/bikes/${id}`);
  }
}
