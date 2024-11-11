import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';

@Component({
  selector: 'app-details-pane',
  templateUrl: './details-pane.component.html',
  styleUrls: ['./details-pane.component.css']
})
export class DetailsPaneComponent implements OnInit {
  @Input() city?: string;
  @Input() state?: string;
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() weekData: any;
  @Output() backToResults = new EventEmitter<void>(); 
  google: any;

  firstDay: any = {}; 
  map: any = {};
  constructor(
    private customerService: CustomerResultsService,
  ) { 
  }
  ngOnInit(): void {
    const dayData = this.weekData[0];
    this.firstDay = {
        date: dayData.startTime,
        status: dayData.value?.weatherCode,
        temperatureMax: dayData.values?.temperatureMax,
        temperatureMin: dayData.values?.temperatureMin,
        temperatureApparent: dayData.values?.temperatureApparent,
        sunriseTime: dayData.values?.sunriseTime,
        sunsetTime: dayData.values?.sunsetTime,
        humidity: dayData.values?.humidity,
        windSpeed: dayData.values?.windSpeed,
        visibility: dayData.values?.visibility,
        cloudCover: dayData.values?.cloudCover,
      };
      console.log(dayData);
      this.renderMap();
    }
    postTweet(){
      console.log("inside postTweet()");
    }
    backToDetailsView(){
      this.backToResults.emit();
    }

    async renderMap(){
      this.customerService.getMap(this.latitude ?? 0,this.longitude ?? 0).subscribe(async () => {
        // const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
        //   this.map = new Map(document.getElementById("map") as HTMLElement, {
        //     center: { lat: this.latitude ?? 0 , lng: this.longitude ?? 0},
        //     zoom: 8,
        //   });
        });
    }
  }

