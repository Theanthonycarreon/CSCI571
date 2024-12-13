//
//  SharedToolBar.swift
//  Assignment4
//
//  Created by Anthony Carreon on 12/12/24.
//

import SwiftUI

struct SharedToolbarModifier: ViewModifier {
    @Binding var showToolbar: Bool
    var city: String
    @EnvironmentObject var weatherViewModel: WeatherViewModel

    func body(content: Content) -> some View {
        content
            .toolbar(showToolbar ? .visible : .hidden)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Button(action: {
                        // Handle back button action
                        showToolbar = false
                        print("Back button tapped")
                    }) {
                        HStack {
                            Image(systemName: "chevron.left")
                                .font(.system(size: 20))
                            Text("Weather")
                                .font(.system(size: 18))
                                .fontWeight(.bold)
                        }
                    }
                }

                ToolbarItem(placement: .principal) {
                    Text(city)
                        .font(.system(size: 20))
                        .fontWeight(.bold)
                }

                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Twitter action
                        print("Twitter button tapped")
                        weatherViewModel.PostTweet { response in
                            print("Tweet posted with response: \(response)")
                        }
                    }) {
                        Image("twitter")
                            .resizable()
                            .frame(width: 24, height: 24)
                    }
                }
            }
    }
}

extension View {
    func sharedToolbar(showToolbar: Binding<Bool>, city: String) -> some View {
        self.modifier(SharedToolbarModifier(showToolbar: showToolbar, city: city))
    }
}
