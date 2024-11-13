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
  @Input() dateClicked?: string;
  @Input() dateObject: {} | undefined;
  @Output() backToResults = new EventEmitter<void>(); 
  // map: google.maps.Map | undefined;
  theDate: any = {}; 
  map: any = {};
  constructor(
    private customerService: CustomerResultsService,
  ) { 
  }
  
  ngOnInit(): void {
    // console.log(this.weekData);
    console.log('date clicked', this.dateClicked);
    console.log('dateObject', this.dateObject);
    const dateData: any = this.dateObject;
    this.theDate = {
      date: dateData.startTime,
      icon: dateData.values?.icon,
      status: dateData.values?.status,
      temperatureMax: dateData.values?.temperatureMax,
      temperatureMin: dateData.values?.temperatureMin,
      temperatureApparent: dateData.values?.temperatureApparent,
      sunriseTime: dateData.values?.sunriseTime,
      sunsetTime: dateData.values?.sunsetTime,
      humidity: dateData.values?.humidity,
      windSpeed: dateData.values?.windSpeed,
      visibility: dateData.values?.visibility,
      cloudCover: dateData.values?.cloudCover,
    };

  }

  ngAfterViewInit(): void {
    this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 8,
    });
  }

  postTweet() {
    console.log("inside postTweet()");
  }

  backToDetailsView() {
    // console.log('emitting back...........')
    this.backToResults.emit();
    // console.log('after emit call, still in details pane')
  }

  
}


