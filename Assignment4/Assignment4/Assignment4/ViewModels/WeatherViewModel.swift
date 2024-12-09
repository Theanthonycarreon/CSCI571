//
//  WeatherModel.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/7/24.
//
// Acts as a bridge between the UI (WeatherView) and the model (WeatherModel)

import Foundation
import Alamofire
import SwiftyJSON

class WeatherViewModel: ObservableObject { // ViewModels usually inherits “ObservableObject”, it will send updates to Views
    private var model = WeatherModel()
    @Published var city : String = ""
    
    @Published var response: String = ""
    @Published var displayValue: Int = 0 // ViewModel have @Published property wrapper.
    @Published var lastSymbol: String = "" // ViewModels will only send changes to View if those fields are modified.
    @Published var weatherData: WeatherModel?
    
    
    func getCurrentLocation() {
        let url = "https://ipinfo.io"
        let parameters = ["token": "5b2286d51fefe2"]

        AF.request(url, parameters: parameters).responseJSON { response in
           // Handle the response
           switch response.result {
                   case .success(let data):
                        let json = JSON(data)
               if let city = json["city"].string, let state = json["region"].string {
                   if let returnedJSON = json["loc"].string {
                       let coords = returnedJSON.split(separator: ",")
                       let inputLatitude = String(coords[0])
                       let inputLongitude = String(coords[1])
                       self.getWeather(city: city, state: state, latitude: inputLatitude, longitude: inputLongitude)
                   }
               }
                   case .failure(let error):
                       print("Error:", error)
                   }
           }
        }
    
    func digitTouched(_ digit: Int) {
        displayValue = displayValue*10 + digit
    }
    
    func performOperation(_ symbol: String) {
        lastSymbol = symbol
        model.setOperand(operand: displayValue)
        model.performOperation(symbol: symbol)
        if symbol == "=" {
            displayValue = model.result
        }
        else {
            displayValue = 0
        }
    }
    private func getWeather(city: String, state: String, latitude: String, longitude: String) {
        let url = "https://assignment3-440805.wl.r.appspot.com/api/weather/"
        let parameters = ["city": city, "state": state ,"lat": latitude, "long": longitude]
        var json = JSON()

        AF.request(url, parameters: parameters).responseJSON { response in
           // Handle the response
           switch response.result {
                   case .success(let data):
                        json = JSON(data)
                        self.model.setWeather(weather: json)
                        if let cityName = json["address"].string {
                                   self.city = cityName
                        }
                   case .failure(let error):
                       print("Error:", error)
                   }
           }
    }
}
