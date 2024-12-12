//
//  WeatherModel.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/7/24.
//
// The UI of the of the app

import SwiftUI
import Alamofire
import SwiftSpinner

struct TodayView: View {
    @ObservedObject var weatherViewModel = WeatherViewModel()
    @ObservedObject var searchedLocationViewModel = SearchedLocationViewModel()
//    @State var searchText: String = "" //change to ""
    @Binding var searchText: String //change to ""
    @State private var cities: [String] = []
    @State private var ifClicked: Bool = false
    @State private var tabs = ["Today_Tab", "Weekly_Tab", "Weather_Data_Tab"]
    @State private var tabsNames = ["Today", "Weekly", "Weather Data"]
    @State var city: String
    
    
    
    
    
    fileprivate func weeklyData(for dayData: [String: Any]) -> some View {
        return
            HStack {
                VStack (spacing:10){
                    if let date = dayData["date"] as? String {
                        Text(date)
                    } else {
                        Text("N/A")
                    }
                }
                VStack (spacing:15){
                    if let status = dayData["status"] as? String {
                        Image(status)
                        // prompt: how to scale the image? - 2 lines https://chatgpt.com/share/67577826-624c-800b-ab2b-8ccb7f5d4e25
                            .resizable()
                            .scaledToFit()
                            .frame(width: 32, height: 32)
                    } else {
                        Text("N/A")
                    }
                }
                .padding(.trailing,30)
                VStack {
                    Image("sun-rise")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 32, height: 32)
                }
                .padding(.trailing, 40)
                .padding(.leading, 40)
                VStack {
                    Image("sun-set")
                        .resizable()
                        .scaledToFit()
                        .frame(width: 32, height: 32)
                }
            }
        }
        var filteredWeekData: [[String: Any]] {
               if searchText.isEmpty {
                   return weatherViewModel.weekData
               } else {
                   return weatherViewModel.weekData.filter { day in
                       if let city = day["city"] as? String {
                           return city.localizedCaseInsensitiveContains(searchText)
                       }
                       return false
                   }
               }
           }
    

    var body: some View {
        NavigationView {
            ZStack{
                Image("App_background")
//                    .frame(height: 100)
                    .resizable()
                    .scaledToFit()
//                    .ignoresSafeArea(.all)
                //        }
                //                .edgesIgnoringSafeArea([.bottom])
                                .edgesIgnoringSafeArea(.all)
                
                
                VStack {
                    TextField("Enter City Name", text: $searchText)
                        .padding(.horizontal,10)
                        .background(Color.white)
                        .onChange(of: searchText) { newValue in
                            weatherViewModel.getCities(newValue) { currCities in
                                if newValue.isEmpty {
                                    self.cities = []
                                } else {
                                    self.cities = currCities
                                }
                            }
                        }
                    
                    if !cities.isEmpty && !ifClicked {
                        List(cities, id: \.self) { city in
                            NavigationLink(
                                destination: SwiftSpinnerView(city: city, weatherViewModel: weatherViewModel)
                                    .onAppear {
                                        // Clear the cities list when navigating
                                        self.cities = []
                                    },
                                label: {
                                    Text(city)
                                }
                            )
                        }
                        .frame(height: 200)
                    }
                    Spacer()
                }
                .zIndex(1)
                
                
                VStack{
                    Button(action: {
                        // Action for the button
                        if !weatherViewModel.favoriteCities.contains(city) {
                            weatherViewModel.addFavorite(city: city)
                            print("Add to Favorites")
                        } else {
                            weatherViewModel.removeFavorite(city: city)
                        }
                        
                    }) {
                        Image(weatherViewModel.showThisButton) // Use SF Symbol or a custom image
                            .resizable()
                            .scaledToFit()
                            .frame(width: 25, height: 25) // Adjust the size of the image
                    }
                    .padding(.leading, 320)
                    
                    
                    NavigationLink(
                        destination: DayDetailView(city: city, searchedLocationViewModel: searchedLocationViewModel, weatherViewModel: weatherViewModel),
                        label: {
                            HStack{
                                VStack{
                                    if let status = weatherViewModel.weekData.first?["status"] as? String {
                                        Image("Cloudy")
                                            .resizable()
                                            .scaledToFit()
                                            .frame(width:150, height: 150 )
//                                            .padding(.trailing,10)
                                    } else {
                                        Image("Cloudy")
                                            .resizable()
                                            .scaledToFit()
                                            .frame(width:150, height: 150 )
//                                            .padding(.trailing,20)
                                    }
                                }
                                VStack (spacing:15){
                                    HStack{
                                        if let temp = weatherViewModel.weekData.first?["temperature"] as? Double{
                                            Text("\(Int(temp))°F")
                                                .font(.system(size: 30)) // Set font size
                                                .fontWeight(.bold)
                                        } else {
                                            Text("0°F")
                                                .font(.system(size: 30)) // Set font size
                                                .fontWeight(.bold)
                                        }
                                        
                                    }
                                    HStack{
                                        if let status = weatherViewModel.weekData.first?["status"] as? String {
                                            Text(status)
                                                .font(.system(size: 20)) // Set font size
                                                .fontWeight(.bold)
                                        } else {
                                            Text("N/A")
                                                .font(.system(size: 20)) // Set font size
                                                .fontWeight(.bold)
                                        }
                                    }
                                    HStack{
                                        Text(weatherViewModel.city.split(separator: ",").first?.trimmingCharacters(in: .whitespacesAndNewlines) ?? weatherViewModel.city)
                                            .frame(width: 100)
                                            .font(.system(size: 14))
                                            .fontWeight(.bold)
                                        
                                    }
                                }
                                .padding(.top, 30)
                                .padding(.trailing,50)
                                .foregroundStyle(.black)
                            }
                            .frame(width: 350, height: 175)
                            .background(Color.yellow.opacity(0.3))
                            .cornerRadius(10)
                            .foregroundStyle(.black)
                            .padding(.bottom, 450)
                        }
                    )
                    
                    
                }
                VStack{
                    HStack(spacing:15){
                        VStack{
                            Text("Humidity")
                                .fontWeight(.bold)
                        }
                        VStack{
                            Text("Wind Speed")
                                .fontWeight(.bold)
                        }
                        VStack{
                            Text("Visibility")
                                .fontWeight(.bold)
                        }
                        VStack{
                            Text("Pressure")
                                .fontWeight(.bold)
                        }
                    }
                    HStack(spacing:20){
                        VStack{
                            Image("Humidity")
                                .resizable()
                                .scaledToFit()
                                .frame(width:75,height:75)
                        }
                        VStack{
                            Image("WindSpeed")
                                .resizable()
                                .scaledToFit()
                                .frame(width:75,height:75)
                        }
                        VStack{
                            Image("Visibility")
                                .resizable()
                                .scaledToFit()
                                .frame(width:75,height:75)
                        }
                        VStack{
                            Image("Pressure")
                                .resizable()
                                .scaledToFit()
                                .frame(width:75,height:75)
                        }
                    }
                    HStack(spacing:25){
                        VStack{
                            if let humidity = weatherViewModel.weekData.first?["humidity"] as? Double{
                                Text("\(Int(humidity)) %")
                                    .fontWeight(.bold)
                            } else {
                                Text("0 %")
                                    .fontWeight(.bold)
                            }
                        }
                        VStack{
                            if let windSpeed = weatherViewModel.weekData.first?["windSpeed"] as? Double{
                                Text("\(String(format: "%.2f", windSpeed)) mph")
                                    .fontWeight(.bold)
                            } else {
                                Text("0 mph")
                                    .fontWeight(.bold)
                            }
                        }
                        VStack{
                            if let visibility = weatherViewModel.weekData.first?["visibility"] as? Double{
                                Text("\(String(format: "%.2f", visibility)) mi")
                                    .fontWeight(.bold)
                            } else {
                                Text("0 mi")
                                    .fontWeight(.bold)
                            }
                        }
                        VStack{
                            if let pressureSeaLevel = weatherViewModel.weekData.first?["pressureSeaLevel"] as? Double{
                                Text("\(String(format: "%.2f", pressureSeaLevel)) inHg")
                                    .fontWeight(.bold)
                            } else {
                                Text("0 inHg")
                                    .fontWeight(.bold)
                            }
                        }
                    }
                    .padding(.bottom, 150)
                    VStack {
                        ForEach(weatherViewModel.weekData.indices, id: \.self) { index in
                            let dayData = weatherViewModel.weekData[index]
                            HStack {
                                // Date column
                                VStack(spacing: 10) {
                                    if let date = dayData["date"] as? String {
                                        Text(date)
                                    } else {
                                        Text("N/A")
                                    }
                                }
                                
                                // Weather status column
                                VStack(spacing: 15) {
                                    if let status = dayData["status"] as? String {
                                        Image(status)
                                            .resizable()
                                            .scaledToFit()
                                            .frame(width: 32, height: 32)
                                    } else {
                                        Text("N/A")
                                    }
                                }
                                .padding(.trailing, 30)
                                
                                // Sunrise image column
                                VStack {
                                    Image("sun-rise")
                                        .resizable()
                                        .scaledToFit()
                                        .frame(width: 32, height: 32)
                                }
                                .padding(.trailing, 40)
                                .padding(.leading, 40)
                                
                                // Sunset image column
                                VStack {
                                    Image("sun-set")
                                        .resizable()
                                        .scaledToFit()
                                        .frame(width: 32, height: 32)
                                }
                            }
                        }
                    }
//                    .padding(.bottom, 200)
                    .frame(width: 350)
                    .background(Color.yellow)
                    .cornerRadius(10)
                }

                
                .padding(.top, 200)
                .onAppear {
                                SwiftSpinner.show("Fetching Weather Details for \(city)...")
                    print("searchedLocationViewModel.city: \(weatherViewModel.city)")
                    weatherViewModel.getLocation(city: city) {
                                        SwiftSpinner.hide()
                        print("searchedLocationViewModel.city: \(weatherViewModel.city)")
                    }
                }
            }
            .navigationTitle("Weather")
             .navigationBarHidden(true)
        }
    }
    
       
}
    
    
    
    
#Preview {
    @Previewable @State var previewSearchText: String = ""
    @Previewable @State var previewCity: String = ""
    TodayView(searchText: $previewSearchText, city: previewCity)
}


struct UserCityInput: View {
    @EnvironmentObject var weatherViewModel: WeatherViewModel
    //You can also pass data to all sub-Views using EnvironmentObject
    var currInput: String
    var body: some View {
//        Button(action: {weatherViewModel.digitTouched(currInput)}, label: {
            ZStack {
                Rectangle()
                    .foregroundColor(.gray)
//                Text("\(digit)")
                    .font(.title)
                    .foregroundColor(.white)
                    .padding()
            }
//        })
        
    }
}


