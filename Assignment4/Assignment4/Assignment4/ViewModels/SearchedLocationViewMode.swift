import Foundation
import SwiftUI
import Alamofire
import SwiftyJSON

class SearchedModel: ObservableObject {
    // Properties
    @Published var city: String = ""
    @Published var cities: [String] = []
    @Published var response: String = ""
    @Published var weekData: [[String: Any]] = []
    @Published var userInput: String = ""
    @Published var weatherData: WeatherModel?

    // Methods
    func fetchCities(for input: String, completion: @escaping ([String]) -> Void) {
        let url = "https://assignment3-440805.wl.r.appspot.com/api/autocomplete"
        let parameters = ["input": input]

        AF.request(url, parameters: parameters).responseJSON { response in
            switch response.result {
            case .success(let data):
                let json = JSON(data)
                let predictions = json["predictions"].arrayValue
                let cityNames = predictions.compactMap { $0["terms"].arrayValue.first?["value"].stringValue }
                completion(cityNames)
            case .failure(let error):
                print("Error fetching cities: \(error)")
                completion([])
            }
        }
    }
}
