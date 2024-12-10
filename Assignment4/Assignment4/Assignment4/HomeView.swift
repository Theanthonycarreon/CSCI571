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
        ZStack {
            Image("App_background")
                .resizable()
                .scaledToFill() 
                .edgesIgnoringSafeArea(.all)
                TodayView()
        }
    }
}

#Preview {
    HomeView()
}
