import { Component, Input, OnInit } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';
import { TempChartService } from '../temp-chart.service';
import { MeteogramService } from '../meteogram.service';
import { response } from 'express';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  @Input() auto_loc?: boolean;
  @Input() street?: string;
  @Input() city?: string;
  @Input() state?: string;

  dayViewTabClicked = true;
  chartTabClicked = false;
  meteogramTabClicked = false;
  latitude = 0;
  longitude = 0;
  address = '';
  weekData = [];

  row: any[] = [];
  
  constructor(
    private customerService: CustomerResultsService,
    private tempChartService: TempChartService,
    private meteogramService: MeteogramService
  ) { 
  }  
  ngOnInit() {
    this.dayViewTabClicked = true;
    this.chartTabClicked = false;
    this.meteogramTabClicked = false;
    this.customerService.getWeatherData(this.auto_loc ?? false, this.street ?? '', this.city ?? '',this.state?? '').subscribe(response => {
      const { latitude, longitude, address, weatherData } = response;
      this.latitude = latitude;
      this.longitude = longitude;
      this.address = address;
      // prompt: how do I loop thru data? - 4 lines - https://chatgpt.com/share/672dc350-5f4c-800b-84ed-cf012ba21264
      this.row = [];
      this.weekData = weatherData.data?.timelines[0]?.intervals;
      this.weekData.forEach((dayData: any) => {
        this.row.push({
          date: dayData.startTime,
          weatherCode: dayData.values?.weatherCode,
          temperatureMax: dayData.values?.temperatureMax,
          temperatureMin: dayData.values?.temperatureMin,
          windSpeed: dayData.values?.windSpeed,
        });
      });
    });
    
  }

    dayViewTAB() { //may need ip address or longitude and latitude
      this.dayViewTabClicked = true;
      this.chartTabClicked = false;
      this.meteogramTabClicked = false;
      this.row = [];
      this.weekData.forEach((dayData: any) => {
        this.row.push({
          weatherCode: dayData.values?.weatherCode,
          temperatureMax: dayData.values?.temperatureMax,
          temperatureMin: dayData.values?.temperatureMin,
          windSpeed: dayData.values?.windSpeed,
        });
      });
    }
    tempChartTAB() { //may need ip address or longitude and latitude
      this.dayViewTabClicked = false;
      this.chartTabClicked = true;
      this.meteogramTabClicked = false;
      // this.tempChartService.tempChartTAB(this.latitude, this.longitude).subscribe(response => {
      //   this.rows = response.json();
      // });
    }
    meteogramTAB() { //may need ip address or longitude and latitude
      this.dayViewTabClicked = false;
      this.chartTabClicked = false;
      this.meteogramTabClicked = true;
      // this.meteogramService.meteogramTAB(this.latitude, this.longitude).subscribe(response => {
      //   this.rows = response.json();
      // });
    }

}