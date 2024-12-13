//
//  WeatherModel.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/7/24.
//
import SwiftUI
import Highcharts

struct WeeklyView: View {
    @State var city: String = ""
    @State private var tabs = ["Today_Tab", "Weekly_Tab", "Weather_Data_Tab"]
    @State private var tabsNames = ["Today", "Weekly", "Weather Data"]
//    @State var searchedLocationViewModel: SearchedLocationViewModel
//    @State var weatherViewModel: WeatherViewModel
    @EnvironmentObject var weatherViewModel: WeatherViewModel

    private var chartOptions: HIOptions {
        let options = HIOptions()
        
        let chart = HIChart()
        chart.type = "arearange"
        options.chart = chart
        
        let title = HITitle()
        title.text = "Temperature Ranges (Min, Max)"
        options.title = title
        
        let xAxis = HIXAxis()
            xAxis.type = "datetime"
            xAxis.labels = HILabels()
            xAxis.labels.format = "{value:%e %b}"
            options.xAxis = [xAxis]

        let yAxis = HIYAxis()
           yAxis.title = HITitle()
           yAxis.title.text = "Values (°F)"
           options.yAxis = [yAxis]
           
           let tooltip = HITooltip()
           tooltip.shared = true
           tooltip.valueSuffix = "°F"
           tooltip.xDateFormat = "%e %b"
           options.tooltip = tooltip
        
        let series = HIArearange()
           series.name = "Temperatures"
           series.data = weatherViewModel.getHighChartsData()
           series.color = HIColor(linearGradient: ["x1": 0, "x2": 0, "y1": 0, "y2": 1], stops: [[0, "#FFA500"], [1, "#87CEEB"]])
           series.marker = HIMarker()
           series.marker.enabled = true
           series.marker.fillColor = HIColor(hexValue: "#66CCFF")
           options.series = [series]


           
        return options
    }


    
    var body: some View {
        ZStack {
            Image("App_background")
                .resizable()
                .scaledToFit()
//                .ignoresSafeArea(.all)
            
            VStack {
                NavigationLink(
                    destination: DayDetailView(city: city, weatherViewModel: _weatherViewModel),
                    label: {
                        HStack {
                            VStack {
                                if let status = weatherViewModel.weekData.first?["status"] as? String {
                                    Image(status)
                                } else {
                                    Text("N/A")
                                }
                            }
                            VStack {
                                HStack {
                                    if let temp = weatherViewModel.weekData.first?["temperature"] as? Double {
                                        Text("\(Int(temp))°F")
                                    } else {
                                        Text("0°F")
                                    }
                                }
                                HStack {
                                    if let status = weatherViewModel.weekData.first?["status"] as? String {
                                        Text(status)
                                    } else {
                                        Text("N/A")
                                    }
                                }
                                HStack {
                                    Text(weatherViewModel.city)
                                }
                            }
                            .foregroundStyle(.black)
                        }
                        .frame(width: 400, height: 175)
                        .background(Color.yellow.opacity(0.3))
                        .cornerRadius(10)
                        .foregroundStyle(.black)
                        .padding(.bottom, 380)
                    }
                )
            }

            ChartView(options: chartOptions)
                .padding(.top, 250)
                .frame(width: 400, height: 600)
        }
//        .onAppear {
//            if weatherViewModel.city != "" {
//                weatherViewModel.getLocation(city: weatherViewModel.city) {
//                    // Perform actions when location is fetched
//                }
//            } else {
//                weatherViewModel.getLocation(city: weatherViewModel.city) {
//                    // Perform actions when location is fetched
//                }
//            }
//        }
    }
}


struct ChartView: UIViewRepresentable {
    let options: HIOptions

    func makeUIView(context: Context) -> HIChartView {
        let chartView = HIChartView(frame: .zero)
        chartView.options = options
        return chartView
    }

    func updateUIView(_ uiView: HIChartView, context: Context) {
        uiView.options = options
    }
}



//#Preview {
//    @Previewable @State var previewCity: String = ""
//    @Previewable @State var presearchedLocationViewModel: SearchedLocationViewModel = SearchedLocationViewModel()
//    @Previewable @State var preWeatherViewModel: WeatherViewModel = WeatherViewModel()
//    WeeklyView(city: previewCity, searchedLocationViewModel: presearchedLocationViewModel, weatherViewModel: preWeatherViewModel)
//}

#Preview {
    WeeklyView()
        .environmentObject(WeatherViewModel()) // Inject WeatherViewModel
}
