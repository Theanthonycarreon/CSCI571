//
//  FirstLoad.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/10/24.
//

import SwiftUI
import Alamofire
import Highcharts
import UIKit

struct WeatherDataView: View {
    @State var city: String = ""
    
    var body: some View {
        ZStack{
            Image("App_background")
                .resizable()
                .scaledToFit()
//                .edgesIgnoringSafeArea([.bottom])
//        }
            VStack{
                HStack{
                    Text("City here and navigation bar & twitter button")
                        
                }
//                Spacer()
                
                HStack {
                    VStack{
                        HStack{
                            Image("Precipitation")
//                                .frame(width:50,height:50)
                                .resizable()
                                .scaledToFit()
                                .frame(width:50,height:50)
                                .padding(.trailing,50)
                            Text("Precipitation: ")
                            Text("%")
                        }
                        HStack{
                            Image("Humidity")
                                .resizable()
                                .scaledToFit()
                                .frame(width:50,height:50)
                                .padding(.trailing,75)
                            Text("Humidity: ")
                            Text("%")
                        }
                        HStack{
                            Image("CloudCover")
                                .resizable()
                                .scaledToFit()
                                .frame(width:50,height:50)
                                .padding(.trailing,50)
                            Text("Cloud Cover: ")
                            Text("%")
                        }
                        
                    }
                    
                }
                .frame(width: 350, height: 175)
                .background(Color.yellow.opacity(0.3))
                .cornerRadius(10)
                .foregroundStyle(.black)
                .padding(.bottom, 500)
                
                
//                HStack{
//                    Text("Weather Data Chart goes here")
//                }
//                .padding(.bottom, 30)
            }
            VStack{
                HStack{
                    SolidGaugeChartView()
                }
                .padding(.top, 260)
            }
        }
    }
}






#Preview {
    @Previewable @State var previewCity: String = ""
    WeatherDataView(city: previewCity)
}


struct SolidGaugeChartView: UIViewRepresentable {
    func makeUIView(context: Context) -> HIChartView {
        let chartView = HIChartView(frame: .zero)
        chartView.plugins = ["solid-gauge"]

        let options = HIOptions()

        let chart = HIChart()
        chart.type = "solidgauge"
        chart.height = "110%"
        options.chart = chart

        let title = HITitle()
        title.text = "Activity"
        title.style = HICSSObject()
        title.style.fontSize = "24px"
        options.title = title

        let tooltip = HITooltip()
        tooltip.borderWidth = 0
        tooltip.shadow = HIShadowOptionsObject()
        tooltip.shadow.opacity = 0
        tooltip.style = HICSSObject()
        tooltip.style.fontSize = "16px"
        tooltip.valueSuffix = "%"
        tooltip.pointFormat = "{series.name}<br><span style=\"font-size:2em; color: {point.color}; font-weight: bold\">{point.y}</span>"
        tooltip.positioner = HIFunction(jsFunction: "function (labelWidth) { return { x: (this.chart.chartWidth - labelWidth) / 2, y: (this.chart.plotHeight / 2) + 15 }; }")
        options.tooltip = tooltip

        let pane = HIPane()
        pane.startAngle = 0
        pane.endAngle = 360

        let background1 = HIBackground()
        background1.backgroundColor = HIColor(rgba: 106, green: 165, blue: 231, alpha: 0.35)
        background1.outerRadius = "112%"
        background1.innerRadius = "88%"
        background1.borderWidth = 0

        let background2 = HIBackground()
        background2.backgroundColor = HIColor(rgba: 51, green: 52, blue: 56, alpha: 0.35)
        background2.outerRadius = "87%"
        background2.innerRadius = "63%"
        background2.borderWidth = 0

        let background3 = HIBackground()
        background3.backgroundColor = HIColor(rgba: 130, green: 238, blue: 106, alpha: 0.35)
        background3.outerRadius = "62%"
        background3.innerRadius = "38%"
        background3.borderWidth = 0

        pane.background = [background1, background2, background3]
        options.pane = [pane]

        let yAxis = HIYAxis()
        yAxis.min = 0
        yAxis.max = 100
        yAxis.lineWidth = 0
        yAxis.tickPosition = ""
        options.yAxis = [yAxis]

        let plotOptions = HIPlotOptions()
        plotOptions.solidgauge = HISolidgauge()
        let dataLabels = HIDataLabels()
        dataLabels.enabled = false
        plotOptions.solidgauge.dataLabels = [dataLabels]
        plotOptions.solidgauge.linecap = "round"
        plotOptions.solidgauge.stickyTracking = false
        plotOptions.solidgauge.rounded = true
        options.plotOptions = plotOptions

        let move = HISolidgauge()
        move.name = "Move"
        let moveData = HIData()
        moveData.color = HIColor(rgba: 106, green: 165, blue: 231, alpha: 1)
        moveData.radius = "112%"
        moveData.innerRadius = "88%"
        moveData.y = 80
        move.data = [moveData]

        let exercise = HISolidgauge()
        exercise.name = "Exercise"
        let exerciseData = HIData()
        exerciseData.color = HIColor(rgba: 51, green: 52, blue: 56, alpha: 1)
        exerciseData.radius = "87%"
        exerciseData.innerRadius = "63%"
        exerciseData.y = 65
        exercise.data = [exerciseData]

        let stand = HISolidgauge()
        stand.name = "Stand"
        let standData = HIData()
        standData.color = HIColor(rgba: 130, green: 238, blue: 106, alpha: 1)
        standData.radius = "62%"
        standData.innerRadius = "38%"
        standData.y = 50
        stand.data = [standData]

        options.series = [move, exercise, stand]

        chartView.options = options
        return chartView
    }

    func updateUIView(_ uiView: HIChartView, context: Context) {}
}
