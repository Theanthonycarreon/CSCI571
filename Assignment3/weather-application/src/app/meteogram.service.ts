import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeteogramService  {
  
  constructor(private http: HttpClient) {}
  
  getMeteogram(latitude: number, longitude: number): Observable<any> {
    let params = new HttpParams()
        .set('latitude', latitude.toString())
        .set('longitude', longitude.toString());
    return this.http.get<any>('/api/meteogram', { params });
  }
 
  postData(data: any): Observable<any> {
    return this.http.post<any>('/api/meteogram', data);
  }
 
}
