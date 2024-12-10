//
//  WeatherModel.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/7/24.
//
// The UI of the of the app

import SwiftUI
import Alamofire

struct TodayView: View {
    @ObservedObject var weatherViewModel: 
    WeatherViewModel = WeatherViewModel()
//    @State var searchText: String = "" //change to ""
    @Binding var searchText: String //change to ""
    @State private var cities: [String] = []
    fileprivate func weeklyData(for dayData: [String: Any]) -> some View {
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
                        .frame(width:20, height: 20 )
                } else {
                    Text("N/A")
                }
            }
            VStack (spacing:15) {
                Image("sun-rise")
            }
            VStack {
                Image("sun-set")
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
        VStack{
//            HStack(){ //search bar
//                NavigationView{
//                    
//                }
            TextField("Enter City Name", text: $searchText)
            .padding()
            .textFieldStyle(RoundedBorderTextFieldStyle())
            .onChange(of: searchText) { newValue in
               print("current input: \(newValue)")
               weatherViewModel.getCities(newValue) { currCities in
                   self.cities = currCities
               }
            }

            if !cities.isEmpty {
               List(cities, id: \.self) { city in
                   Text(city)
               }
               .frame(height: 200)
            }
            Spacer()
            
            HStack{
                VStack{
                    if let status = weatherViewModel.weekData.first?["status"] as? String {
                        Image(status)
                    } else {
                        Text("N/A")
                    }
                }
                VStack{
                    HStack{
                        if let temp = weatherViewModel.weekData.first?["temperature"] as? Double{
                            Text("\(Int(temp))°F")
                        } else {
                            Text("0°F")
                        }

                    }
                    HStack{
                        if let status = weatherViewModel.weekData.first?["status"] as? String {
                            Text(status)
                        } else {
                            Text("N/A")
                        }
                    }
                    HStack{
                        Text(weatherViewModel.city)
                            
                    }
                }
            }
            .frame(width:400, height: 175)
            .background(Color.yellow.opacity(0.3))
            .cornerRadius(10)
            HStack{ //day info
                VStack{
                    HStack{
                        VStack{
                            Text("Humidity")
                        }
                        VStack{
                            Text("Wind Speed")
                        }
                        VStack{
                            Text("Visibility")
                        }
                        VStack{
                            Text("Pressure")
                        }
                    }
                    HStack{
                        VStack{
                            Image("Humidity")
                        }
                        VStack{
                            Image("WindSpeed")
                        }
                        VStack{
                            Image("Visibility")
                        }
                        VStack{
                            Image("Pressure")
                        }
                    }
                    HStack{
                        VStack{
                           if let humidity = weatherViewModel.weekData.first?["humidity"] as? Double{
                               Text("\(Int(humidity)) %")
                           } else {
                               Text("0 %")
                           }
                        }
                        VStack{
                            if let windSpeed = weatherViewModel.weekData.first?["windSpeed"] as? Double{
                                Text("\(String(format: "%.2f", windSpeed)) mph")
                            } else {
                                Text("0 mph")
                            }
                        }
                        VStack{
                            if let visibility = weatherViewModel.weekData.first?["visibility"] as? Double{
                                Text("\(String(format: "%.2f", visibility)) mi")
                            } else {
                                Text("0 mi")
                            }
                        }
                        VStack{
                            if let pressureSeaLevel = weatherViewModel.weekData.first?["pressureSeaLevel"] as? Double{
                                Text("\(String(format: "%.2f", pressureSeaLevel)) inHg")
                            } else {
                                Text("0 inHg")
                            }
                        }
                    }
                }
                .frame(width:400, height: 175)
            }
            VStack{
                //// prompt: how to iterate through weekData? - 2 lines https://chatgpt.com/share/67577826-624c-800b-ab2b-8ccb7f5d4e25
                ForEach(weatherViewModel.weekData.indices.dropFirst(), id: \.self) { index in
                    HStack{
                        weeklyData(for: weatherViewModel.weekData[index])
                    }
                }
            }
            .frame(width:400, height: 250)
            .background(Color.yellow.opacity(0.3))
            .cornerRadius(10)
        }
        .onAppear(){
            weatherViewModel.getCurrentLocation()
        }
        .environmentObject(weatherViewModel)
    }
    
}


#Preview {
    @Previewable @State var previewSearchText: String = ""
    TodayView(searchText: $previewSearchText)
}
//struct TodayView_Previews: PreviewProvider {
//    static var previews: some View {
//        @State var previewSearchText: String = ""
//        TodayView(searchText: $previewSearchText)
//            .previewDevice("iPhone 16")
//    }
//}


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


struct NumericButtonView: View {
    @EnvironmentObject var weatherViewModel: WeatherViewModel
    //You can also pass data to all sub-Views using EnvironmentObject
    var digit: Int
    var body: some View {
        Button(action: {weatherViewModel.digitTouched(digit)}, label: {
            ZStack {
                Rectangle()
                    .foregroundColor(.gray)
                Text("\(digit)")
                    .font(.title)
                    .foregroundColor(.white)
                    .padding()
            }
        })
        
    }
}



struct OperatorButtonView: View {
    @EnvironmentObject var weatherViewModel: WeatherViewModel
    
    var symbol: String
    var body: some View {
        Button(action: {
            weatherViewModel.performOperation(symbol)
        },
        label: {
            ZStack {
                Rectangle()
                    .foregroundColor(.gray)
                Text("\(symbol)")
                    .font(.title)
                    .foregroundColor(.white)
                    .padding()
            }
        })
    }
}

