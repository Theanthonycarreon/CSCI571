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
    @State private var searchText: String = "searchText" //change to ""
//    @StateObject private var weatherViewModel = WeatherViewModel()
    
    fileprivate func weeklyData() -> HStack<TupleView<(VStack<Text>, VStack<Text>, VStack<Text>, VStack<Text>)>> {
        return //weekly weather
            HStack{
                VStack{
                    Text("date")
                }
                VStack{
                    Text("stauts IMG")
                }
                VStack{
                    Text("SunRiseIMG")
                }
                VStack{
                    Text("SunSetIMG")
                }
            }
    }
    
    var body: some View {
                VStack{
//                    let weather = weatherViewModel.weather
                    HStack(){ //search bar
                        Text("search bar here")
                    }
                    Spacer()
                    
                    HStack{
                        VStack{
//                            Image()
                                Text("Image")
                        }
                        VStack{
                            HStack{
                                Text("Temp-F")
                            }
                            HStack{
                                Text("description")
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
                                    Text("IMG")
                                }
                                VStack{
                                    Text("IMG")
                                }
                                VStack{
                                    Text("IMG")
                                }
                                VStack{
                                    Text("IMG")
                                }
                            }
                            HStack{
                                VStack{
                                    Text("temp%")
                                }
                                VStack{
                                    Text("speed mph")
                                }
                                VStack{
                                    Text("visibility mi")
                                }
                                VStack{
                                    Text("Pressure inHg")
                                }
                            }
                        }
                        .frame(width:400, height: 175)
                    }
                    VStack{
                        ForEach(0..<6){ index in
                            HStack{
                                weeklyData()
                            }
                        }
                    }
                    .frame(width:400, height: 175)
                    .background(Color.yellow.opacity(0.3))
                    .cornerRadius(10)
                    .onAppear(){
                        weatherViewModel.getCurrentLocation()
                    }
                }
    }
}
           
//                    List(parks) { park in
//                        NavigationLink(park.name, value: park)
//                    }
//                    .navigationDestination(for: Park.self) { park in
//                        ParkDetails(park: park)
//                    }
                
            //            Spacer()
            //                    VStack{
            //                NavigationSplitView {
            //                    .searchable(text: $searchText)
            //                }
            //                SearchBar(searchText: $searchText)

//        VStack (spacing: 20){
//            ZStack {
//                Rectangle()
//                    .foregroundColor(.blue)
//                HStack {
//                    Text(weatherViewModel.lastSymbol)
//                        .font(.largeTitle)
//                        .foregroundColor(.white)
//                        
//                    Spacer()
//                    Text("\(weatherViewModel.displayValue)")
//                        .font(.largeTitle)
//                        .foregroundColor(.white)
//                }
//                .padding()
//            }
//            .frame(height: 100)
//            Group {
//                HStack (spacing: 20) {
//                    NumericButtonView(digit: 7)
//                    NumericButtonView(digit: 8)
//                    NumericButtonView(digit: 9)
//                }
//                HStack (spacing: 20) {
//                    NumericButtonView(digit: 4)
//                    NumericButtonView(digit: 5)
//                    NumericButtonView(digit: 6)
//                }
//                HStack (spacing: 20) {
//                    NumericButtonView(digit: 1)
//                    NumericButtonView(digit: 2)
//                    NumericButtonView(digit: 3)
//                }
//                HStack (spacing: 20) {
//                    OperatorButtonView(symbol: "+")
//                    NumericButtonView(digit: 0)
//                    OperatorButtonView(symbol: "=")
//                }
//            }
//            .frame(height: 100)
//        }
//        .padding()
//        .environmentObject(weatherViewModel)
//    }


struct TodayView_Previews: PreviewProvider {
    static var previews: some View {
        TodayView()
            .previewDevice("iPhone 16")
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

