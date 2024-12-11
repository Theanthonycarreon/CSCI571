////
////  FirstLoad.swift
////  Assignment4
////
////  Created by Anthony Carreon on 12/10/24.
////
//
//import SwiftUI
//import Alamofire
//
//struct FirstLoad: View {
//    var body: some View {
//        TextField("Enter City Name", text: $searchText)
//            .padding()
//            .textFieldStyle(RoundedBorderTextFieldStyle())
//            .onChange(of: searchText) { newValue in
//                //               print("current input: \(newValue)")
//                weatherViewModel.getCities(newValue) { currCities in
//                    self.cities = currCities
//                    //                       self.ifClicked = false
//                    
//                }
//            }
//        
//        if !cities.isEmpty && !self.ifClicked {
//            List(cities, id: \.self) { city in
//                Text(city)
//                    .onTapGesture {
//                        print("Selected City: \(city)")
//                        self.searchText = city
//                        //                           weatherViewModel.getLocation(city: city)
//                        self.ifClicked = true
//                        self.cities.removeAll()
//                        //call getWeather and create subview
//                        //                           weatherViewModel.
//                    }
//            }
//            .frame(height: 200)
//        }
//    }
//    
//}
