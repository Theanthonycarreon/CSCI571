//
//  WeatherModel.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/7/24.
//
//  Model is the logic


import Foundation
import SwiftyJSON

class WeatherModel {
    private var weatherData = JSON()
    private var status: String? //for image and description
    private var currentTemp: Double?
    private var currentCity: String?
    
    
    
    
    
    //A dummy calculator model to support simple addition operation
    private var operations: Dictionary<String, Operation> = [
        "+": Operation.AdditionOperation({$0 + $1}),
        "=": Operation.Equal
    ]
    private enum Operation {
        case AdditionOperation((Int, Int) -> Int)
        case Equal
    }
    private struct PendingAdditionOperationInfo {
        var additionFunction: (Int, Int) -> Int
        var firstOperand: Int
    }

    private var accumulator = 0  //intemediate result
    private var pending: PendingAdditionOperationInfo?
    var result: Int { get { return accumulator } }

    func setWeather(weather: JSON) {
     //   accumulator = weather.temperature
        if !self.weatherData.isEmpty {
            weatherData = JSON()
        }
        weatherData = weather
        print("Inside setWeather in WeatherModel")
//        print("weatherData", weatherData)
//        print("address:", weatherData["address"])
        
    }
    func setOperand(operand: Int) {
        accumulator = operand
    }
    
    func performOperation(symbol: String) {
            if let operation = operations[symbol] {
                switch operation {
                    case .AdditionOperation(let function):
                        executePendingAdditionOperation()
                        pending = PendingAdditionOperationInfo(additionFunction: function, firstOperand: accumulator)
                    case .Equal:
                        executePendingAdditionOperation()
                }
            }
        }
        
    private func executePendingAdditionOperation() {
        if pending != nil {
            accumulator = pending!.additionFunction(pending!.firstOperand, accumulator)
            pending = nil
        }
    }

}
