import SwiftUI

struct HomeView: View {
    @State private var searchText: String = ""
    @State private var currentPage = 0 // Tracks the current page for UIPageControl
    @State private var pageTurned = false
//    @State private var tabs = ["Today_Tab", "Weekly_Tab", "Weather_Data_Tab"]
//    @State private var tabsNames = ["Today", "Weekly", "Weather Data"]
    @State private var activeTab: String = "Today_Tab"
    fileprivate func getBackground() -> some View {
        return
            Image("App_background")
            .resizable()
            .scaledToFill()
    }
    
    var body: some View {
//        NavigationView{
        
        TodayView(searchText: $searchText, city: "")
//        }
//        TodayView(searchText: $searchText)
               
    }

    
//    var body: some View {
//        NavigationView {
//            ZStack {
//                Image("App_background")
//                    .resizable()
//                    .scaledToFill()
//                    .edgesIgnoringSafeArea(.all)
//                VStack {
//                    NavigationLink(destination: TodayView(searchText: $searchText)) {
//                        Text("Today")
//                    }
//                    
//                    
//                    HStack{
//                        Text("Hello world")
//                    }
//    
////                    .padding(.top, 16)
//                    Spacer()
//                    // Search Bar
////                    HStack {
////                        TextField("Enter City Name", text: $searchText)
////                            .padding()
////                            .background(Color.white)
////                            .padding(.horizontal, 16)
////                    }
////                    .padding(.top, 16)
//                    
//                    
////                    Below does the page bubbles at the bottom
//                    
////                    Spacer()
////                    Text("currentPage: \(currentPage)")
////                    
////                    PageView(pages: pages, currentPage: $currentPage)
////                        .frame(height: 400)
////                    
////                    Spacer()
////                    
////                    PageControl(currentPage: $currentPage, numberOfPages: pages.count)
////                        .padding(.bottom, 16)
////                    
//                }
//            }
//        }
//    }
//    
    
}
#Preview {
//    @Previewable @State var previewSearchText: String = ""
    HomeView()
}
