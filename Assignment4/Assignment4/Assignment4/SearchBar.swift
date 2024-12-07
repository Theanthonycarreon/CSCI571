import SwiftUI
import UIKit

struct SearchBar: UIViewRepresentable {
    @Binding var searchText: String

    // Create the UISearchBar
    func makeUIView(context: Context) -> UISearchBar {
        let searchBar = UISearchBar()
        searchBar.placeholder = "Enter City Name"
        searchBar.delegate = context.coordinator
        return searchBar
    }

    // Update the UISearchBar
    func updateUIView(_ uiView: UISearchBar, context: Context) {
        uiView.text = searchText
    }

  
    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UISearchBarDelegate {
        var parent: SearchBar

        init(_ parent: SearchBar) {
            self.parent = parent
        }

        func searchBar(_ searchBar: UISearchBar, textDidChange searchText: String) {
            parent.searchText = searchText
        }

        func searchBarSearchButtonClicked(_ searchBar: UISearchBar) {
            searchBar.resignFirstResponder() // Dismiss keyboard
        }
    }
}
