import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerFavoritesService {
  constructor(private http: HttpClient) {}
  
  // getResults(): Observable<any> {
  //   return this.http.get<any>('/api/customerFavorites');
  // }
  
  // Example POST request
  postData(data: any): Observable<any> {
    return this.http.post<any>('/api/customerFavorites', data);
  }
}
