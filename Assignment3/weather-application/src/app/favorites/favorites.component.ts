import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})

export class FavoritesComponent implements OnInit {
  @Input() city?: string;
  @Input() state?: string;
  @Input()
  alreadyLoaded = false; 
  row: any[] = [];
  @Output() noRecords = new EventEmitter<boolean>(); 
  constructor(
    private customerService: CustomerResultsService,
  ) { 
  } 
  ngOnInit(): void {
    // console.log('Here will be where to fix the favorites progress bar speed- maybe add a timer here?', this.alreadyLoaded);
    this.customerService.getFavorites().subscribe((response: any) =>{
      // this.row = response
      console.log('this.row', this.row);
      console.log('Inside removeFavortie -response', response.length)
      if(response.length == 0){
        this.row = [];
        this.noRecords.emit(true);
      } else {
        this.alreadyLoaded = true;
        this.row = response
        this.noRecords.emit(false);
      }
    });
  }
  removeFavorite(latitude: number, longitude: number, city: string, state: string){
    this.customerService.removeFavoriteRow(latitude, longitude, city, state).subscribe({});
    this.customerService.getFavorites().subscribe((response: any) =>{
      // this.row = response
      console.log('Inside removeFavortie -response', response.length)
      console.log('this.row.length', this.row.length)
      if( response.length == 0){
        this.row = [];
        this.noRecords.emit(true);
      } else {
        this.alreadyLoaded = true;
        this.row = response;
        this.noRecords.emit(false);
      }
    });
  }


}
