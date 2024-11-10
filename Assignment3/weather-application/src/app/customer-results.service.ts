import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerResultsService  {
 
  constructor(private http: HttpClient) {}
  
  getDayView(): Observable<any> {
    return this.http.get<any>('/api/dayView');
  }
  
  // Example POST request
  postData(data: any): Observable<any> {
    return this.http.post<any>('/api/dayView', data);
  }
}
