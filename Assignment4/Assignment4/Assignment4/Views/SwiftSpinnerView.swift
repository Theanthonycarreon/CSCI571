////
////  SwiftSpinnerView.swift
////  Assignment4
////
////  Created by Anthony Carreon on 12/10/24.
////
//import SwiftUI
//import Foundation
//import SwiftSpinner
//
//struct SwiftSpinnerView: View {
//    @State var city: String
//    @ObservedObject var weatherViewModel: WeatherViewModel
//    
//    var body: some View {
//        SearchedLocationView(weatherViewModel: weatherViewModel, city: city)
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
//    @Previewable @ObservedObject var preweatherViewModel: WeatherViewModel = WeatherViewModel()
//    SwiftSpinnerView(city: previewCity, weatherViewModel: preweatherViewModel)
//}
//
