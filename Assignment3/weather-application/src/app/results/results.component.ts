import { Component, OnInit } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';
import { TempChartService } from '../temp-chart.service';
import { MeteogramService } from '../meteogram.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  rows: any[] = [];
  
  constructor(
    private customerService: CustomerResultsService,
    private tempChartService: TempChartService,
    private meteogramService: MeteogramService
  ) { 
    this.customerService.getDayView().subscribe(response => {
      this.rows = response.json();
    });
  }  
    ngOnInit() {
    }

    dayViewTAB(city: string) { //may need ip address or longitude and latitude
      this.customerService.getDayView()
    }
    tempChartTAB(city: string) { //may need ip address or longitude and latitude
      this.tempChartService.getTempChart()
    }
    meteogramTAB(city: string) { //may need ip address or longitude and latitude
      this.meteogramService.getMeteogram()
    }

}