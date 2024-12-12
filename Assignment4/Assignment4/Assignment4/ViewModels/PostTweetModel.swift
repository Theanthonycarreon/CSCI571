//
//  PostTweet.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/11/24.
//

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

class PostTweetModel: ObservableObject { // ViewModels usually inherits “ObservableObject”, it will send updates to Views
//    private var customModel = WeatherModel()
//    @Published var city : String = ""
////    @Published var status : String = ""
////    @Published var currentTemp : Double = 0
////    @Published var humidity : Double = 0
////    @Published var windSpeed : Double = 0
////    @Published var visibility : Double = 0
////    @Published var pressure : Double = 0
//    @Published var weekData : [[String:Any]] = []
//    @Published var userInput: String = ""
//    @Published var cities: [String] = []
//    
//    
//    @Published var response: String = ""
//    @Published var displayValue: Int = 0 // ViewModel have @Published property wrapper.
//    @Published var lastSymbol: String = "" // ViewModels will only send changes to View if those fields are modified.
//    @Published var weatherData: WeatherModel?
    
    
    

    func PostTweet(_ weatherPost: String, completion: @escaping ([String]) -> Void)  {
//        displayValue = displayValue*10 + digit
        let url = "https://assignment3-440805.wl.r.appspot.com/api/postTweet"
        let parameters = ["text": weatherPost]

        AF.request(url, parameters: parameters).responseJSON { response in
           // Handle the response
           switch response.result {
                   case .success(let data):
                        let json = JSON(data)
                        print(json)
               
                   case .failure(let error):
                       print("Error:", error)
                       completion([])
                   }
           }
    }
    
}
