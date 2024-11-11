import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerResultsService  {
  
  constructor(private http: HttpClient) {}

  getFavorites() {
    return this.http.get<any>('/api/customerFavorites');
  }
  
  addFavoriteCity(latitude: number, longitude: number, city: string, state: string) {
    let params = new HttpParams()
        .set('latitude', latitude.toString())
        .set('longitude', longitude.toString())
        .set('city', city)
        .set('state', state);
    return this.http.get<any>('/api/addFavorite', { params });
  }
  removeFavoriteRow(latitude: number, longitude: number, city: string, state: string) {
    let params = new HttpParams()
        .set('latitude', latitude.toString())
        .set('longitude', longitude.toString())
        .set('city', city)
        .set('state', state);
    return this.http.get<any>('/api/removeFavorite', { params });
  }

  getWeatherData(autodetect: boolean, street: string, city: string, state: string): Observable<any> {
    // prompt: how do I pass parameter to server? - 6 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
      let params = new HttpParams()
        .set('auto_loc', autodetect.toString())
        .set('street', street)
        .set('city', city)
        .set('state', state);
    return this.http.get<any>('/api/weather', { params });
  }
  getViewData(latitude: number, longitude: number): Observable<any> {
    let params = new HttpParams()
        .set('latitude', latitude.toString())
        .set('longitude', longitude.toString())
    return this.http.get<any>('/api/dayView', { params }); 
  }
  // Example POST request
  postData(data: any): Observable<any> {
    return this.http.post<any>('/api/dayView', data);
  }
}
