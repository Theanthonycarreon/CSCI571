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
    console.log('Inside ngOninIt inside favorites component')
    console.log('Here will be where to fix the favorites progress bar speed- maybe add a timer here?', this.alreadyLoaded);
    this.customerService.getFavorites().subscribe((response: any) =>{
      this.alreadyLoaded = true;
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
