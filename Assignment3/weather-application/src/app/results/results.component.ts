import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { CustomerResultsService } from '../customer-results.service';
import { TempChartService } from '../temp-chart.service';
import { MeteogramService } from '../meteogram.service';
import * as Highcharts from 'highcharts';
import WindBarb from 'highcharts/modules/windbarb';
// import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import ighchartsMore from 'highcharts/highcharts-more';
HighchartsMore(Highcharts);

// Initialize Highcharts modules
// HighchartsMore(Highcharts); // Enables advanced charts like arearange
// ArearangeModule(Highcharts); // Enables arearange charts
// HighchartsExporting(Highcharts); 

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
  @Input() formCleared?: boolean;
  @Input() favoriteCity = {};
  @Output() noLoadingBar = new EventEmitter<void>(); 

  dayViewTabClicked = true;
  chartTabClicked = false;
  meteogramTabClicked = false;
  detailsTabClicked = false;
  latitude = 0;
  longitude = 0;
  address = '';
  weekData = [];
  activeTab: string = 'dayView';
  dateClicked = '';
  row: any[] = [];
  highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  clickedFavorite = false;
  gettingClicked = false;
  slideDirection: string = ''; 

  dateObject = {};
  constructor(
    private customerService: CustomerResultsService,
    private tempChartService: TempChartService,
    private meteogramService: MeteogramService,
  ) { 
  }  
  
  
  ngOnInit() {
    console.log('inside ngOnInit() in results component');
    // console.log('chosen city =', this.favoriteCity);
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
      console.log('Loading data???');
      this.noLoadingBar.emit();
      this.weekData.forEach((dayData: any) => {
        this.row.push({
          date: dayData.startTime,
          icon: dayData.values.icon,
          status: dayData.values.status,
          weatherCode: dayData.values?.weatherCode,
          temperatureMax: dayData.values?.temperatureMax,
          temperatureMin: dayData.values?.temperatureMin,
          windSpeed: dayData.values?.windSpeed,
        });
      });
    });
    // console.log('done ??Loading data???');
  }
  
  


  loadedResults(){
    // console.log("inside loadedResults in results component")
    // this.noLoadingBar.emit();
  }
  
    addFavorite(){
      // console.log('adding favorite');
      this.clickedFavorite = true;
      this.gettingClicked = true;
      if(!this.city){
        const [tempCity, tempState] = this.address.split(",");
        this.city = tempCity.trim();
        this.state = tempState.trim();
      }
      this.customerService.addFavoriteCity(this.latitude, this.longitude, this.city ?? '',this.state?? '').subscribe({});
      setTimeout(() => {}, 10000);
      this.clickedFavorite = false;
      this.gettingClicked = true;
    }

    detailsTAB(day: string){
      this.slideDirection = 'slide-left';
      if(day == ''){
        this.dateClicked = day;
        this.dateObject = this.weekData[0];
      } else {
        this.weekData.forEach((dayData: any) => {
          if(dayData.startTime == day){
            this.dateClicked = dayData.startTime;
            this.dateObject = dayData;
          }
        });
      }
      this.dayViewTabClicked = false;
      this.chartTabClicked = false;
      this.meteogramTabClicked = false;
      this.detailsTabClicked = true;
    }

    dayViewTAB() { //may need ip address or longitude and latitude
      console.log('inside dayViewTAB() in results component');
      this.slideDirection = 'slide-right';
      this.dayViewTabClicked = true;
      this.chartTabClicked = false;
      this.meteogramTabClicked = false;
      this.detailsTabClicked = false;
      this.row = [];
      this.activeTab = 'dayView';
      this.weekData.forEach((dayData: any) => {
        this.row.push({
          date: dayData.startTime,
          icon: dayData.values.icon,
          status: dayData.values.status,
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
            type: 'arearange', 
          },
          title: {
            text: "Temperature Ranges (Min, Max)"
          },
          xAxis: {
            type: 'datetime',
            labels: {
              format: '{value:%e %b}'
            }
          },
          tooltip: {
            shared: true,
            valueSuffix: '°F',
            xDateFormat: '%e %b'
          },
          series: [{
            type: 'arearange',
            name: 'Temperatures',
            data: this.weekData.map((dayData: any) => [
                new Date(dayData.startTime).getTime(),
                dayData.values?.temperatureMin,
                dayData.values?.temperatureMax
            ]),
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [[0, '#FFA500'], [1, '#87CEEB']]
            },
            marker: {
                enabled: true,
                fillColor: '#66CCFF'
            }
          }]

    };
    }

    meteogramTAB() { //may need ip address or longitude and latitude
      this.dayViewTabClicked = false;
      this.chartTabClicked = false;
      this.meteogramTabClicked = true;
      this.detailsTabClicked = false;
      this.activeTab = 'meteogramTab';
      this.meteogramService.getMeteogram(this.latitude, this.longitude).subscribe(response => {
        const meteogramJson = response.meteogramChart;
        console.log('meteogramJson', meteogramJson);

        class Meteogram {
          private temperatures: { x: number; y: number; to: number; symbolName: string }[] = [];
          private humidities: { x: number; y: number }[] = [];
          private winds: { x: number; value: number; direction: number }[] = [];
          private pressures: { x: number; y: number }[] = [];
          private chart?: Highcharts.Chart;
          private container: string;

          constructor(meteogramJson: any, container: string) {
            this.container = container;
            this.createChart();
            console.log(this.getChartOptions);
          }

          private getChartOptions(): Highcharts.Options {
            
          this.temperatures = meteogramJson.properties.timeseries.map((entry: any) => ({
            x: new Date(entry.time).getTime(),
            y: (entry.data.instant.details.air_temperature * 9/5) + 32 ?? null, // Temperature (Fahrenheit)
            symbolName: entry.data.next_1_hours?.summary?.symbol_code ?? 'N/A'
          }));

          this.humidities = meteogramJson.properties.timeseries.map((entry: any) => ({
            x: new Date(entry.time).getTime(),
            y: entry.data.instant.details.relative_humidity ?? 0, // Temperature (Fahrenheit)
          }));
        
          this.winds = meteogramJson.properties.timeseries.map((entry: any) => ({
            x: new Date(entry.time).getTime(),
            value: entry.data.instant?.details?.wind_speed ?? 0, // Wind speed
            direction: entry.data.instant?.details?.wind_from_direction ?? 0 // Wind direction
          }));
        
          this.pressures = meteogramJson.properties.timeseries.map((entry: any) => ({
            x: new Date(entry.time).getTime(),
            y: Math.round((entry.data.instant?.details?.air_pressure_at_sea_level ?? 0) / 33.8639 * 100) / 100// Convert hPa to inHg
          }));
            return {
              chart: {
                renderTo: this.container,
                type: 'spline',
                marginBottom: 70,
                marginRight: 40,
                marginTop: 50,
                plotBorderWidth: 1,
                alignTicks: false,
                // height: 600,
                scrollablePlotArea: { minWidth: 720 },
              },
              title: { text: 'Hourly Weather (For Next 5 days)', align: 'center' },
              tooltip: {
                shared: true,
                useHTML: true,
                headerFormat:
                    '<small>{point.x:%A, %b %e, %H:%M} - ' +
                    '{point.point.to:%H:%M}</small><br>' +
                    '<b>{point.point.symbolName}</b><br>'
    
              },
              xAxis:[{ // Bottom X axis
                type: 'datetime',
                tickInterval: 36e5, // two hours
                minorTickInterval: 36e5, // one hour
                tickLength: 1,
                gridLineWidth: 1,
                gridLineColor: 'rgba(128, 128, 128, 0.1)',
                startOnTick: false,
                endOnTick: false,
                minPadding: 0,
                maxPadding: 0,
                offset: 30,
                showFirstLabel: false,
                showLastLabel: true,
                labels: {
                    format: '{value:%H}'
                },
                crosshair: true
            }, { // Top X axis
                linkedTo: 0,
                type: 'datetime',
                tickInterval: 24 * 3600 * 900,
                labels: {
                    format: '{value:<span style="font-size: 12px; font-weight: ' +
                        'bold">%a</span> %b %e}',
                    align: 'left',
                    x: 3,
                    y: -5
                },
                opposite: true,
                tickLength: 20,
                gridLineWidth: 1
            }],
              yAxis: [{ // temperature axis
                title: {
                    text: null
                },
                labels: {
                    format: '{value}°', //needs to be F
                    style: {
                        fontSize: '10px'
                    },
                    x: -3
                },
                plotLines: [{ // zero plane
                    value: 0,
                    color: '#BBBBBB',
                    width: 1,
                    zIndex: 2
                }],
                maxPadding: 0.3,
                minRange: 8,
                tickInterval: 7,
                gridLineColor: 'rgba(128, 128, 128, 0.1)'
    
            }, { // precipitation axis
                title: {
                    text: null
                },
                labels: {
                    enabled: false
                },
                gridLineWidth: 0,
                tickLength: 1,
                minRange: 10,
                min: 0
    
            }, { // Air pressure
                allowDecimals: false,
                title: { // Title on top of axis
                    text: 'inHg',
                    offset: 0,
                    align: 'high',
                    rotation: 0,
                    style: {
                        fontSize: '10px',
                        color: '#FFDAB9',
                    },
                    textAlign: 'left',
                    x: 3
                },
                labels: {
                    style: {
                        fontSize: '8px',
                        color: '#FFDAB9',
                    },
                    y: 1,
                    x: 3
                },
                gridLineWidth: 0,
                opposite: true,
                showLastLabel: false
            }],
    
            legend: {
                enabled: false
            },
    
            plotOptions: {
                series: {
                    pointPlacement: 'between'
                },
                windbarb:{
                dataGrouping: {
                    enabled: true,
                        units: [['hour',[2]]],
                        groupPixelWidth: 1
                }
                },
            },
    
              series: [
                { name: 'Temperature', 
                  data: this.temperatures, 
                  type: 'spline', 
                  color: '#FF3333',
                  
                    // marker: {
                    //     enabled: false,
                    //     states: {
                    //         hover: {
                    //             enabled: true
                    //         }
                    //     }
                    // },
                    // tooltip: {
                    //     pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                    //         ' ' +
                    //         '{series.name}: <b>{point.y}°F</b><br/>'
                    // },
                    // zIndex: 1,
                    // negativeColor: '#48AFE8'

                },
                { name: 'Humidity', 
                  data: this.humidities,
                  type: 'column', 
                  color: '#68CFE8',
                  yAxis: 1,
                  groupPadding: 0,
                  pointPadding: 0,
                  grouping: false,
                  dataLabels: {
                      style: {
                          fontSize: '8px',
                          color: '#666'
                      }
                  },
                  tooltip: {
                    valueSuffix: ' %'
                  }
                },
                { name: 'Wind', 
                  data: this.winds, 
                  type: 'windbarb', 
                  color: 'purple' 

                },
                { name: 'Air Pressure', 
                  data: this.pressures, 
                  type: 'spline', 
                  color: '#00FF00',
                  

                }
              ]
            };
          }

          private createChart(): void {
            this.chart = Highcharts.chart(this.container, this.getChartOptions());
          }
        }

        new Meteogram(meteogramJson, 'hourly_chart');
      });
    }
}

    


// class Meteogram {
//   private temperatures: { date: string; lowTemp: number; highTemp: number; symbolName: string }[] = [];
//   private humidities: { date: string; humitidyLevel: number }[] = [];
//   private winds: { date: string; windSpeed: number; direction: number }[] = [];
//   private pressures: { x: number; y: number }[] = [];
//   private chart?: Highcharts.Chart;
//   private container: string;

//   constructor(meteogramJson: any, container: string) {
//     this.container = container;
//     this.createChart();
//     console.log(this.getChartOptions);
//   }

//   private getChartOptions(): Highcharts.Options {
//     this.temperatures = meteogramJson.properties.timeseries.map((entry: any) => {
//       console.log('Entry:', entry); // Log the entry before processing
//       return {
//         x: new Date(entry.time).getTime(),
//         y: entry.data.instant?.details?.air_temperature ?? null, // Check if instant and details exist
//         symbolName: entry.data.next_1_hours?.summary?.symbol_code ?? 0  // Adjust based on exact symbol location
//       };
//     });
    
//     this.humidities = meteogramJson.properties.timeseries.map((entry: any) => ({
//       x: new Date(entry.time).getTime(),
//       y: entry.data.next_1_hours?.details?.humidity ?? 0 
//   }));
    
//     this.winds = meteogramJson.properties.timeseries.map((entry: any) => ({
//       x: new Date(entry.time).getTime(),
//       value: entry.data.instant?.details?.wind_speed ?? 0, // Fallback to 0 if wind data is missing
//       direction: entry.data.instant?.details?.wind_from_direction ?? 0 // Adjust based on actual field names
//     }));
    
//     this.pressures = meteogramJson.properties.timeseries.map((entry: any) => ({
//       x: new Date(entry.time).getTime(),
//       y: entry.data.instant?.details?.air_pressure_at_sea_level ?? 0// Adjust based on your data's field name
//     }));