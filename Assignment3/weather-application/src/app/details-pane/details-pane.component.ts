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
  @Input() address?: string;
  @Output() backToResults = new EventEmitter<void>(); 

  // map: google.maps.Map | undefined;
  theDate: any = {}; 
  map: any = {};
  datePipe: any;
  constructor(
    private customerService: CustomerResultsService,
  ) { 
  }
  
  ngOnInit(): void {
    const dateData: any = this.dateObject;
    console.log(dateData);
    this.theDate = {
      date: dateData.startTime,
      icon: dateData.values?.icon,
      status: dateData.values?.status,
      temperatureNow: dateData.values?.temperature,
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
    this.customerService.getMap(this.latitude ?? 0,this.longitude ?? 0).subscribe((response) => {this.map = new google.maps.Map(document.getElementById('map') as HTMLElement, {
      center: { lat: this.latitude, lng: this.longitude },
      zoom: 15,
    });
  }, error => {
    console.error('Error initializing map:', error);
  });
  }

  postTweet() {
    const dateObject = new Date(this.theDate.date);

  // Format the date using Intl.DateTimeFormat
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(dateObject);
    console.log(formattedDate);
    const text = `The temperature in ${this.address} on ${formattedDate} is ${this.theDate.temperatureNow}°F and the conditions are ${this.theDate.status}. #CSCI571WeatherForecast`;
    console.log(text);
    this.customerService.postingTweet(text).subscribe((response) => {
      window.open(response.tweetUrl, '_blank'); 
    });
  }

  backToDetailsView() {
    this.backToResults.emit();
    // console.log('after emit call, still in details pane')
  }

  
}


