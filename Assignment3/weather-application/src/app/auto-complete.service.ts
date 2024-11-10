import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutoCompleteService {
  // private apiUrl = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=[location]&key=[key]'; 

  constructor(private http: HttpClient) {}
  
  getAutoComplete(input: string): Observable<any> {
    console.log('Inside getAutoComplete');
    return this.http.get<any>(`/api/autocomplete?input=${input}`).pipe(
      catchError((error) => {
        console.error('Error in getAutoComplete:', error);
        return throwError(error);
      })
    );
  }
  

  // Example POST request
  postData(data: any): Observable<any> {
    return this.http.post<any>('/api/autocomplete', data);
  }

}
