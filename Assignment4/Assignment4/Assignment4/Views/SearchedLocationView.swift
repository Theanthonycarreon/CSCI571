////
////  WeatherModel.swift
////  Assignment4
////
////  Created by Anthony Carreon on 12/7/24.
////
import SwiftUI
import Alamofire
import SwiftSpinner

struct SearchedLocationView: View {
//    @State private var searchText: String = ""
    @ObservedObject var weatherViewModel: WeatherViewModel
    @State var city: String

    var body: some View {
        HStack {
            Text("Here is where i implement the page after searching for a city")
        }
        HStack{
            Text("City: \(weatherViewModel.city)")
        }
        .onAppear {
            SwiftSpinner.show("Fetching Weather Details for \(city)...")
            print("City: \(weatherViewModel.city)")
            weatherViewModel.getLocation(city: city) {
            SwiftSpinner.hide()
                print("City: \(weatherViewModel.city)")
            }
        }
    }
    
}
