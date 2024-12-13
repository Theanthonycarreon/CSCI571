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
import Highcharts


class WeatherViewModel: ObservableObject { // ViewModels usually inherits “ObservableObject”, it will send updates to Views
    private var model = WeatherModel()
    @Published var city : String = ""
//    @Published var status : String = ""
//    @Published var currentTemp : Double = 0
//    @Published var humidity : Double = 0
//    @Published var windSpeed : Double = 0
//    @Published var visibility : Double = 0
//    @Published var pressure : Double = 0
    @Published var weekData : [[String:Any]] = []
    @Published var userInput: String = ""
    @Published var cities: [String] = []
    
    
    @Published var response: String = ""
    @Published var displayValue: Int = 0 // ViewModel have @Published property wrapper.
    @Published var lastSymbol: String = "" // ViewModels will only send changes to View if those fields are modified.
    @Published var weatherData: WeatherModel?
    @Published var favoriteCities: [String] = []
    @Published var changeFavoriteSign = false
    private var differentButtons: [String] = ["plus-circle", "close-circle"]
    @Published var showThisButton = "plus-circle"
    @Published var tweet: String = ""
    
    
    func PostTweet(completion: @escaping ([String]) -> Void)  {
        
        
                print("Inside PostTweet()")
        //        print("weatherData \(weatherData)")
        tweet = ""
        //        HStack {
        if let temp = weekData.first?["temperature"] as? Double,
           let status = weekData.first?["status"] as? String,
        let currCity = city.split(separator: ",").first?.trimmingCharacters(in: .whitespacesAndNewlines) {
            tweet = "The current temperature at \(currCity) is \(Int(temp))°F. The weather conditions are \(status) #CSCI571WeatherSearch"
            if let encodedTweet = tweet.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed),
                      let tweetURL = URL(string: "https://twitter.com/intent/tweet?text=\(encodedTweet)") {
                       
                       // Open the URL in the browser
                       UIApplication.shared.open(tweetURL, options: [:], completionHandler: nil)
                   } else {
                       print("Failed to encode tweet or create URL.")
                   }
        }
        tweet = ""
    }
    
    
    
    func getLocation(city: String, completion: @escaping () -> Void) {
        if city == "" {            let url = "https://ipinfo.io"
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
                   completion()
                       case .failure(let error):
                           print("Error:", error)
                       }
               }
        } else {
            self.getWeather(city: city, state: "", latitude: "", longitude: "")
            completion()
        }
        
        }
    
    func removeFavorite(city: String) {
        if let index = favoriteCities.firstIndex(of: city) {
                favoriteCities.remove(at: index)
            changeFavoriteSign = true
            showThisButton = "plus-circle"
        } else {
            changeFavoriteSign = false
        }
    }
    
    func addFavorite(city: String){
        print("Inside addFavorite")
        if !favoriteCities.contains(city) {
            favoriteCities.append(city)
            changeFavoriteSign = true
            showThisButton = "close-circle"
        } else {
            changeFavoriteSign = false
        }
    }
    
    func getHighChartsData() -> [[Any]] {
           return weekData.compactMap { dayData in
               if let startTime = dayData["startTime"] as? String,
                  let temperatureMin = dayData["temperatureMin"] as? Double,
                  let temperatureMax = dayData["temperatureMax"] as? Double {
                   let timestamp = ISO8601DateFormatter().date(from: startTime)?.timeIntervalSince1970 ?? 0
                   return [timestamp * 1000, temperatureMin, temperatureMax]
               }
               return nil
           }
       }
    
    
    
    func getCities(_ currUserInput: String, completion: @escaping ([String]) -> Void)  {
//        displayValue = displayValue*10 + digit
        let url = "https://assignment3-440805.wl.r.appspot.com/api/autocomplete"
        let parameters = ["input": currUserInput]
        var cityNames: [String] = []

        AF.request(url, parameters: parameters).responseJSON { response in
           // Handle the response
           switch response.result {
                   case .success(let data):
                        let json = JSON(data)
//               print(json)
               // prompt: how properly save the data? - 6 lines https://chatgpt.com/share/67577826-624c-800b-ab2b-8ccb7f5d4e25
               // Extract all city names as Strings
                        let predictions = json["predictions"].arrayValue // Access the predictions array

                        // Extract all city names as Strings
                           cityNames = predictions.compactMap { prediction in
                           prediction["terms"].arrayValue.first?["value"].stringValue
                        }

                        // Check if all city names are the same
                        if Set(cityNames).count == 1, let uniqueCity = cityNames.first {
                           // If all names are the same, keep only one instance
                           cityNames = [uniqueCity]
                        } else {
                           // Remove duplicates and keep unique city names
                           cityNames = Array(Set(cityNames))
                        }

                        // Update the `cities` property
                        self.cities = cityNames
                        completion(cityNames)
//                        print("Cities:", self.cities)
               
                   case .failure(let error):
                       print("Error:", error)
                       completion([])
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
    fileprivate func setData(weatherData: JSON) {
//        print("Inside setData:  \(weatherData)")
//            self.city = ""
//            self.weekData.removeAll()
        // prompt: how to check if address is a string or array? - 7 lines https://chatgpt.com/share/67577826-624c-800b-ab2b-8ccb7f5d4e25
        let cityName: String?
            if let addressString = weatherData["address"].string {
                cityName = addressString
            } else if let addressArray = weatherData["address"].array {
                cityName = addressArray.compactMap { $0.string }.joined(separator: ", ")
            } else {
                cityName = nil
            }
        
           if let cityName = cityName, let data = weatherData["weatherData"]["data"]["timelines"].array,
           let week = data.first?["intervals"].array {
            self.city = cityName
            print("in setData \(self.city)")
            for day in week {
                // prompt: how properly save the data? - 13 lines https://chatgpt.com/share/67577826-624c-800b-ab2b-8ccb7f5d4e25
                guard let startTime = day["startTime"].string,
                      let values = day["values"].dictionaryObject else {
                    continue
                }

                // Parse "startTime" into a Date and format it as "MM/dd/yyyy"
                let isoFormatter = ISO8601DateFormatter()
                let dateFormatter = DateFormatter()
                dateFormatter.dateFormat = "MM/dd/yyyy"
                
                let formattedDate: String
                if let date = isoFormatter.date(from: startTime) {
                    formattedDate = dateFormatter.string(from: date)
                } else {
                    formattedDate = "Invalid Date" // Fallback in case of parsing failure
                }

                // Add the formatted date to the daily data
                var dailyData = values
                dailyData["date"] = formattedDate
                
                // Append to weekData
                self.weekData.append(dailyData)
            }
            print("inside setWeather")
//            print("Processed weekData: \(self.weekData)")
        }
    }
    
    private func getWeather(city: String, state: String, latitude: String, longitude: String) {
        let url = "https://assignment3-440805.wl.r.appspot.com/api/weather/"
        let parameters = ["city": city, "state": state ,"lat": latitude, "long": longitude]
        var json = JSON()
        self.weekData = []
        self.city.removeAll()
       self.weatherData = nil

        AF.request(url, parameters: parameters).responseJSON { response in
           // Handle the response
           switch response.result {
                   case .success(let data):
                        json = JSON(data)
//                        self.model = WeatherModel()
//                        self.weatherData = nil
        
//               self.weatherData = WeatherViewModel?
//                    weatherData = WeatherViewModel()
//               print(json)
                        self.model.setWeather(weather: json)
                        self.setData(weatherData: json)
                   case .failure(let error):
                       print("Error:", error)
                   }
           }
    }
}
