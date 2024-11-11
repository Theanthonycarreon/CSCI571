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
  @Input() latitude?: number;
  @Input() longitude?: number;
  row: any[] = [];
  constructor(
    private customerService: CustomerResultsService,
  ) { 
  } 
  ngOnInit(): void {
    this.customerService.getFavorites().subscribe((response: any) =>{
      this.row = response
    });
  }
  removeFavorite(latitude: number, longitude: number, city: string, state: string){
    this.customerService.removeFavoriteRow(latitude, longitude, city, state).subscribe({});
  }


}
