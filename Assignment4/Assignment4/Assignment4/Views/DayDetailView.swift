//
//  DayDetails.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/11/24.
//

import SwiftUI
import Alamofire

struct DayDetailView: View {
    @State var city: String = ""
    @State private var tabs = ["Today_Tab", "Weekly_Tab", "Weather_Data_Tab"]
    @State private var tabsNames = ["Today", "Weekly", "Weather Data"]
    @State var searchedLocationViewModel: SearchedLocationViewModel
    @State var weatherViewModel: WeatherViewModel
    fileprivate func getBackground() -> some View {
        return
        ZStack {
            Image("App_background")
                .resizable()
                .scaledToFill()
            
            VStack{
                HStack{
                    //column 1
                    VStack{
                        Image("WindSpeed")
                        if let windSpeed = searchedLocationViewModel.weekData.first?["windSpeed"] as? Double{
                            Text("\(String(format: "%.2f", windSpeed)) mph")
                                .padding(.bottom,5)
                        } else {
                            Text("0 mph")
                                .padding(.bottom,5)
                        }
                        //                                .padding(.bottom,5)
                        Text("Wind Speed")
                    }
                    .background(.white)
                    .opacity(0.5)
                    .padding(.trailing, 25)
                    //                    .foregroundStyle(.black)
                    //column 2
                    VStack{
                        Image("Pressure")
                        if let pressureSeaLevel = searchedLocationViewModel.weekData.first?["pressureSeaLevel"] as? Double{
                            Text("\(String(format: "%.2f", pressureSeaLevel)) inHg")
                                .padding(.bottom,5)
                        } else {
                            Text("0 inHg")
                                .padding(.bottom,5)
                        }
                        //                                .padding(.bottom,5)
                        Text("Pressure")
                        
                    }
                    .background(.white)
                    .opacity(0.5)
                    .padding(.trailing, 25)
                    // column 3
                    VStack{
                        Image("Precipitation")
                        if let precipitation = searchedLocationViewModel.weekData.first?["precipitationProbability"] as? Double{
                            Text("\(Int(precipitation))%")
                                .padding(.bottom,5)
                        } else {
                            Text("0%")
                                .padding(.bottom,5)
                        }
                        Text("Precipitation")
                        
                    }
                    .background(.white)
                    .opacity(0.5)
                }
                .padding(.bottom, 300)
            }
            
            VStack{
                HStack{
                    //column 1
                    VStack{
                        Image("Temperature")
                        if let temp = searchedLocationViewModel.weekData.first?["temperature"] as? Double{
                            Text("\(Int(temp))°F")
                                .padding(.bottom,5)
                        } else {
                            Text("0°F")
                                .padding(.bottom,5)
                        }
                        Text("Temperature")
                    }
                    .background(.white)
                    .opacity(0.5)
                    .padding(.trailing, 30)
                    //column 2
                    VStack{
                        if let status = searchedLocationViewModel.weekData.first?["status"] as? String {
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
                    .background(.white)
                    .opacity(0.5)
                    .padding(.trailing, 30)
                    // column 3
                    VStack{
                        Image("Humidity")
                        if let humidity = searchedLocationViewModel.weekData.first?["humidity"] as? Double {
                            Text("\(Int(humidity))%")
                                .padding(.bottom,5)
                        } else {
                            Text("N/A")
                                .padding(.bottom,5)
                        }
                        Text("Humidity")
                        
                    }
                    .background(.white)
                    .opacity(0.5)
                }
                .padding(.top,30)
                
            }
            VStack{
                HStack{
                    //column 1
                    VStack{
                        Image("Visibility")
                        if let visibility = searchedLocationViewModel.weekData.first?["visibility"] as? Double {
                            Text("\(String(format: "%.2f", visibility)) mi")
                                .padding(.bottom,5)
                        } else {
                            Text("N/A")
                                .padding(.bottom,5)
                        }
                        Text("Visibility")
                    }
                    .background(.white)
                    .opacity(0.5)
                    .padding(.trailing, 25)
                    //column 2
                    VStack{
                        Image("CloudCover")
                        if let cloudCover = searchedLocationViewModel.weekData.first?["cloudCover"] as? Double {
                            Text("\(Int(cloudCover))%")
                                .padding(.bottom,5)
                        } else {
                            Text("N/A")
                                .padding(.bottom,5)
                        }
                        Text("Cloud Cover")
                        
                    }
                    .background(.white)
                    .opacity(0.5)
                    .padding(.trailing, 25)
                    // column 3
                    VStack{
                        Image("UVIndex")
                        if let uVIndex = searchedLocationViewModel.weekData.first?["uVIndex"] as? Double {
                            Text("\(Int(uVIndex))")
                                .padding(.bottom,5)
                        } else {
                            Text("N/A")
                                .padding(.bottom,5)
                        }
                        Text("UVIndex")
                        
                    }
                    .background(.white)
                    .opacity(0.5)
                }
                .padding(.top, 350)
                
            }
        }
        
        
        
    }//end of getBackgroundFunction
    
    var body: some View {
        
        TabView (selection: $tabs) {
            
            getBackground()
                .tabItem{
                    Image(tabs[0])
                    Text(tabsNames[0])
                }
            WeeklyView(city: city, searchedLocationViewModel: searchedLocationViewModel, weatherViewModel: weatherViewModel)
                .tabItem{
                    Image(tabs[1])
                    Text(tabsNames[1])
                }
            WeatherDataView(city: city)
                .tabItem{
                    Image(tabs[2])
                    Text(tabsNames[2])
                }
        }
        .onAppear {
            if searchedLocationViewModel.city != ""{
                searchedLocationViewModel.getLocation(city: searchedLocationViewModel.city){
                    
                }
            } else {
                weatherViewModel.getLocation(city: weatherViewModel.city){
                    
                }
            }
        }
    }
}
    

           
    
    

#Preview {
    @Previewable @State var previewCity: String = ""
    @Previewable @State var presearchedLocationViewModel: SearchedLocationViewModel = SearchedLocationViewModel()
    @Previewable @State var preWeatherViewModel: WeatherViewModel = WeatherViewModel()
    DayDetailView(city: previewCity, searchedLocationViewModel:presearchedLocationViewModel, weatherViewModel: preWeatherViewModel)
}
