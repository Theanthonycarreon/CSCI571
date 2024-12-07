//
//  Assignment4App.swift
//  Assignment4
//
//  Created by Anthony Carreon on 11/27/24.
//

import SwiftUI

@main
struct Assignment4App: App {
    var body: some Scene {
        WindowGroup {
            ZStack{
                Image("App_background")
                    .resizable()
                    .edgesIgnoringSafeArea(.all)
                HomeView()
            }
        }
    }
}
