//
//  DayDetails.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/11/24.
//

import SwiftUI
import Alamofire
import SwiftSpinner

struct DayDetailView: View {
    @State var city: String = ""
    @State private var tabs = ["Today_Tab", "Weekly_Tab", "Weather_Data_Tab"]
    @State private var tabsNames = ["Today", "Weekly", "Weather Data"]
    //    @Binding var searchedLocationViewModel: SearchedLocationViewModel
    @EnvironmentObject var weatherViewModel: WeatherViewModel
    @State private var selectedTab: String = "Today"
    @State private var showToolbar: Bool = true
    @State private var cities: [String] = []
    
    
    fileprivate func getBackground() -> some View {
        return
        ZStack {
            Image("App_background")
                .resizable()
                .scaledToFit()
            
            VStack{
                HStack{
                    //column 1
                    VStack{
                        Image("WindSpeed")
                        if let windSpeed = weatherViewModel.weekData.first?["windSpeed"] as? Double{
                            Text("\(String(format: "%.2f", windSpeed)) mph")
                                .padding(.bottom,5)
                        } else {
                            Text("0 mph")
                                .padding(.bottom,5)
                        }
                        //                                .padding(.bottom,5)
                        Text("Wind Speed")
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                    .padding(.trailing, 25)
                    
                    //column 2
                    VStack{
                        Image("Pressure")
                        if let pressureSeaLevel = weatherViewModel.weekData.first?["pressureSeaLevel"] as? Double{
                            Text("\(String(format: "%.2f", pressureSeaLevel)) inHg")
                                .padding(.bottom,5)
                        } else {
                            Text("0 inHg")
                                .padding(.bottom,5)
                        }
                        //                                .padding(.bottom,5)
                        Text("Pressure")
                        
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                    .padding(.trailing, 25)
                    // column 3
                    VStack{
                        Image("Precipitation")
                        if let precipitation = weatherViewModel.weekData.first?["precipitationProbability"] as? Double{
                            Text("\(Int(precipitation))%")
                                .padding(.bottom,5)
                        } else {
                            Text("0%")
                                .padding(.bottom,5)
                        }
                        Text("Precipitation")
                        
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                }
                .padding(.bottom, 300)
            }
            
            VStack{
                HStack{
                    //column 1
                    VStack{
                        Image("Temperature")
                        if let temp = weatherViewModel.weekData.first?["temperature"] as? Double{
                            Text("\(Int(temp))°F")
                                .padding(.bottom,5)
                        } else {
                            Text("0°F")
                                .padding(.bottom,5)
                        }
                        Text("Temperature")
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                    .padding(.trailing, 25)
                    //column 2
                    VStack{
                        if let status = weatherViewModel.weekData.first?["status"] as? String {
                            Image(status)
                                .resizable()
                                .frame(width: 75, height: 75)
                                .padding(.bottom,10)
                            Text(status)
                        } else {
                            Text("N/A")
                            Text("N/A")
                        }
                        
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                    .padding(.trailing, 23)
                    // column 3
                    VStack{
                        Image("Humidity")
                        if let humidity = weatherViewModel.weekData.first?["humidity"] as? Double {
                            Text("\(Int(humidity))%")
                                .padding(.bottom,5)
                        } else {
                            Text("N/A")
                                .padding(.bottom,5)
                        }
                        Text("Humidity")
                        
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                }
                .padding(.top,30)
                
            }
            VStack{
                HStack{
                    //column 1
                    VStack{
                        Image("Visibility")
                        if let visibility = weatherViewModel.weekData.first?["visibility"] as? Double {
                            Text("\(String(format: "%.2f", visibility)) mi")
                                .padding(.bottom,5)
                        } else {
                            Text("N/A")
                                .padding(.bottom,5)
                        }
                        Text("Visibility")
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                    .padding(.trailing, 25)
                    //column 2
                    VStack{
                        Image("CloudCover")
                        if let cloudCover = weatherViewModel.weekData.first?["cloudCover"] as? Double {
                            Text("\(Int(cloudCover))%")
                                .padding(.bottom,5)
                        } else {
                            Text("N/A")
                                .padding(.bottom,5)
                        }
                        Text("Cloud Cover")
                        
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                    .padding(.trailing, 25)
                    // column 3
                    VStack{
                        Image("UVIndex")
                        if let uVIndex = weatherViewModel.weekData.first?["uVIndex"] as? Double {
                            Text("\(Int(uVIndex))")
                                .padding(.bottom,5)
                        } else {
                            Text("0")
                                .padding(.bottom,5)
                        }
                        Text("UVIndex")
                        
                    }
                    .frame(width:100, height:150)
                    .background(Color.white.opacity(0.3))
                    .cornerRadius(10)
                    .foregroundStyle(.black)
                }
                
                .padding(.top, 350)
                
            }
            
            
        }
                    .sharedToolbar(showToolbar: $showToolbar, city: weatherViewModel.city)
                    .navigationTitle("Weather")
                    .navigationBarTitleDisplayMode(.inline)
        
        //        .padding(.bottom,50)
        
    }//end of getBackgroundFunction
    
    var body: some View {
        
        TabView (selection: $selectedTab) {
            getBackground()
                .tabItem {
                    Image(tabs[0])
                    Text(tabsNames[0])
                }
                .tag("Today_Tab")
            WeeklyView(city: city, weatherViewModel: _weatherViewModel)
                .tabItem {
                    Image(tabs[1])
                    Text(tabsNames[1])
                }
                .tag("Weekly_Tab")
            
            // Weather Data View
            WeatherDataView(weatherViewModel: _weatherViewModel)
                .tabItem {
                    Image(tabs[2])
                    Text(tabsNames[2])
                }
                .tag("Weather_Data_Tab")
            
                .onChange(of: selectedTab) { newValue in
                    print("Switched to tab: \(newValue)")
                }
        }
    }
}
    

           
#Preview {
    DayDetailView(city: "Los Angeles")
        .environmentObject(WeatherViewModel()) // Inject WeatherViewModel
}
