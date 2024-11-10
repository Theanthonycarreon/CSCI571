import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeteogramService  {
  
  constructor(private http: HttpClient) {}
  
  meteogramTAB(latitude: number, longitude: number): Observable<any> {
    return this.http.get<any>('/api/meteogram'); //need to figure out how to send the input .... ex - return this.http.get<any>(`/api/autocomplete?input=${input}`);
  }
 
  postData(data: any): Observable<any> {
    return this.http.post<any>('/api/meteogram', data);
  }
 
}
