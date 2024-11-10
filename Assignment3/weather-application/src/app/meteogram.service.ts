import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MeteogramService  {
 
  constructor(private http: HttpClient) {}
  
  getMeteogram() {
    throw new Error('Method not implemented.');
  }

 
}
