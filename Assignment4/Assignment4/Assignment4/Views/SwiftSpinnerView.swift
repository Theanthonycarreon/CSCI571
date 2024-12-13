//
//  SwiftSpinnerView.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/10/24.
//
//import SwiftUI
//import Foundation
//import SwiftSpinner
//
//struct SwiftSpinnerView: View {
//    @State var city: String
//    @Binding var weatherViewModel: WeatherViewModel
//    @ObservedObject var searchedLocationViewModel: SearchedLocationViewModel = SearchedLocationViewModel()
//    @State var searchText: String = ""
//    
//    var body: some View {
//        SearchedLocationView(weatherViewModel: weatherViewModel, searchedLocationViewModel: searchedLocationViewModel, searchText: $searchText, city: city)
////        TodayView(searchText: $city)
//        .onAppear {
//            SwiftSpinner.show("Fetching Weather Details for \(city)...")
//            weatherViewModel.getLocation(city: city) {
//            SwiftSpinner.hide()
//            }
//        }
//        
//    }
//}
//
//#Preview {
//    @Previewable @State var previewCity: String = ""
//    @Previewable @Binding var preweatherViewModel: WeatherViewModel
//    SwiftSpinnerView(city: previewCity, weatherViewModel: $preweatherViewModel)
//}

