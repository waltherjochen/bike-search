import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Bike, BikeSearchParams} from '../models/bike';

@Injectable({
  providedIn: 'root'
})
export class BikeService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
  }

  search(params: BikeSearchParams): Observable<Bike[]> {
    return this.http.get<Bike[]>(`${this.baseUrl}/search?${new URLSearchParams({...params}).toString()}`);
  }

  getById(id: string): Observable<Bike> {
    return this.http.get<Bike>(`${this.baseUrl}/bikes/${id}`);
  }
}
