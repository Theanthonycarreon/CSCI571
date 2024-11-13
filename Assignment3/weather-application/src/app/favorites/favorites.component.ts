import { Component, Input, OnInit } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})

export class FavoritesComponent implements OnInit {
  @Input() city?: string;
  @Input() state?: string;
  alreadyLoaded = false; 
  row: any[] = [];
  constructor(
    private customerService: CustomerResultsService,
  ) { 
  } 
  ngOnInit(): void {
    console.log('Inside ngOninIt')
    console.log('this.alreadyLoaded', this.alreadyLoaded);
    this.customerService.getFavorites().subscribe((response: any) =>{
      this.row = response
    });
    this.alreadyLoaded = true;
  }
  removeFavorite(latitude: number, longitude: number, city: string, state: string){
    console.log('Inside removeFavortie')
    this.customerService.removeFavoriteRow(latitude, longitude, city, state).subscribe({});
    this.row = [];
    this.customerService.getFavorites().subscribe((response: any) =>{
      this.row = response
    });
  }


}
