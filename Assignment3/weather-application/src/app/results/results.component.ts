import { Component, Input, OnInit } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';
import { TempChartService } from '../temp-chart.service';
import { MeteogramService } from '../meteogram.service';
import * as Highcharts from 'highcharts';
import WindBarb from 'highcharts/modules/windbarb';

// Initialize the windbarb module
WindBarb(Highcharts);

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
  detailsTabClicked = false;
  latitude = 0;
  longitude = 0;
  address = '';
  weekData = [];
  activeTab: string = 'dayView';

  row: any[] = [];
  highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(
    private customerService: CustomerResultsService,
    private tempChartService: TempChartService,
    private meteogramService: MeteogramService,
  ) { 
  }  
  ngOnInit() {
    this.dayViewTabClicked = true;
    this.chartTabClicked = false;
    this.meteogramTabClicked = false;
    this.detailsTabClicked = false;
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
    addFavorite(){
      this.customerService.addFavoriteCity(this.latitude, this.longitude, this.city ?? '',this.state?? '').subscribe({});;
    }

    detailsTAB(){
      this.dayViewTabClicked = false;
      this.chartTabClicked = false;
      this.meteogramTabClicked = false;
      this.detailsTabClicked = true;
    }

    dayViewTAB() { //may need ip address or longitude and latitude
      this.dayViewTabClicked = true;
      this.chartTabClicked = false;
      this.meteogramTabClicked = false;
      this.detailsTabClicked = false;
      this.row = [];
      this.activeTab = 'dayView';
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
      this.detailsTabClicked = false;
      this.activeTab = 'tempChartTab';
      this.highcharts = Highcharts;
    this.chartOptions = {   
      chart: {
        type: "spline" // General chart type
      },
      title: {
        text: "Monthly Average Temperature"
      },
      subtitle: {
        text: "Source: WorldClimate.com"
      },
      xAxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      },
      yAxis: {          
        title: {
          text: "Temperature °C"
        } 
      },
      tooltip: {
        valueSuffix: " °C"
      },
      series: [
        {
          type: "spline",  // Specify type here
          name: 'Tokyo',
          data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        },
        {
          type: "spline",  // Specify type here
          name: 'New York',
          data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
        },
        {
          type: "spline",  // Specify type here
          name: 'Berlin',
          data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
        },
        {
          type: "spline",  // Specify type here
          name: 'London',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
        }
      ]
    };
      // this.tempChartService.tempChartTAB(this.latitude, this.longitude).subscribe(response => {
      //   this.rows = response.json();
      // });
    }
    meteogramTAB() { //may need ip address or longitude and latitude
      this.dayViewTabClicked = false;
      this.chartTabClicked = false;
      this.meteogramTabClicked = true;
      this.detailsTabClicked = false;
      this.activeTab = 'meteogramTab';
      // let meteogramJson = null;
      this.meteogramService.getMeteogram(this.latitude, this.longitude).subscribe(response => {
        const meteogramJson = response.meteogramChart;
        console.log('meteogramJson', meteogramJson);

        class Meteogram {
          private temperatures: { x: number; y: number; to: number; symbolName: string }[] = [];
          private precipitations: { x: number; y: number }[] = [];
          private winds: { x: number; value: number; direction: number }[] = [];
          private pressures: { x: number; y: number }[] = [];
          private chart?: Highcharts.Chart;
          private container: string;

          constructor(meteogramJson: any, container: string) {
            this.container = container;
            this.createChart();
          }

          private getChartOptions(): Highcharts.Options {
            return {
              chart: {
                renderTo: this.container,
                type: 'spline',
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
                plotBorderWidth: 1,
                height: 310,
                scrollablePlotArea: { minWidth: 720 },
              },
              title: { text: 'Meteogram for Example Location', align: 'left' },
              xAxis: {
                type: 'datetime',
                tickInterval: 2 * 36e5, // two hours
                labels: { format: '{value:%H}' }
              },
              yAxis: [
                { title: { text: 'Temperature (°C)' }, labels: { format: '{value}°' } },
                { title: { text: 'Precipitation (mm)' }, opposite: true }
              ],
              series: [
                { name: 'Temperature', data: this.temperatures, type: 'spline', color: '#FF3333' },
                { name: 'Precipitation', data: this.precipitations, type: 'column', color: '#68CFE8' },
                { name: 'Wind', data: this.winds, type: 'windbarb', color: '#1E90FF' },
                { name: 'Pressure', data: this.pressures, type: 'spline', color: '#00FF00' }
              ]
            };
          }

          private createChart(): void {
            this.chart = Highcharts.chart(this.container, this.getChartOptions());
          }
        }

        // Instantiate the chart without API data
        new Meteogram(meteogramJson, 'hourly_chart');
      });
    }
}

    