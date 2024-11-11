import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';
declare const google: any;
@Component({
  selector: 'app-details-pane',
  templateUrl: './details-pane.component.html',
  styleUrls: ['./details-pane.component.css']
})
export class DetailsPaneComponent implements OnInit, AfterViewInit {
  @Input() city?: string;
  @Input() state?: string;
  @Input() latitude?: number;
  @Input() longitude?: number;
  @Input() weekData: any;
  @Output() backToResults = new EventEmitter<void>(); 
  // map: google.maps.Map | undefined;
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
      // console.log(dayData);
     
    // this.loadAndRenderMap();
  }
  ngAfterViewInit(): void {
    this.loadAndRenderMap();
  }

  postTweet() {
    console.log("inside postTweet()");
  }

  backToDetailsView() {
    this.backToResults.emit();
  }

  loadAndRenderMap() {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 8,
    });
 
  } 
}


