//
//  ContentView.swift
//  Assignment4
//
//  Created by Anthony Carreon on 11/27/24.
//
//
import SwiftUI

struct HomeView: View {
    @State private var searchText: String = ""
    var body: some View {
        NavigationView {
            ZStack {
                Image("App_background")
                    .resizable()
                    .scaledToFill()
    //                .edgesIgnoringSafeArea([.bottom])
                    .edgesIgnoringSafeArea(.all)
                TodayView(searchText: $searchText)
    //            TodayView()
            }
        }
//        ZStack {
//            Image("App_background")
//                .resizable()
//                .scaledToFill()
////                .edgesIgnoringSafeArea([.bottom])
//                .edgesIgnoringSafeArea(.all)
//            TodayView(searchText: $searchText)
////            TodayView()
//        }
    }
}

#Preview {
    HomeView()
}
