////
////  PageView 2.swift
////  Assignment4
////
////  Created by Anthony Carreon on 12/11/24.
////
//
import SwiftUI
//
struct PageView: UIViewRepresentable {
    let pages: [String] // Content for each page
    @Binding var currentPage: Int // Binding to update UIPageControl
                                        //returns UIScrollView, can change this
    @State var previousPage = 0
    func makeUIView(context: Context) -> UIScrollView { //first called to initialize it
        let scrollView = UIScrollView()
//            scrollView.isPagingEnabled = true
//            scrollView.showsHorizontalScrollIndicator = false
        scrollView.delegate = context.coordinator //provides us all the scrollView functions
                                //context has the coordinator inside it

        let contentView = UIView() //this is the UI of the UIRepresentable
        scrollView.addSubview(contentView)

        return scrollView
    }
    
    //sends data from SwiftUi to UiKit
    func updateUIView(_ uiView: UIScrollView, context: Context) {
        // Not needed for this implementation
//        uiView.
            self.currentPage = self.currentPage + 1
        
        
    }
    
    //sends data from UiKit to SwiftUi
    func makeCoordinator() -> Coordinator { //used to communicated changes from your view to other parts of your swiftUI interface
        Coordinator(self) //self has the binding currentPage
    }

    class Coordinator: NSObject, UIScrollViewDelegate {
        var parent: PageView

        init(_ parent: PageView) {
            self.parent = parent //initialized parent , the _ refers to the binding of currentPage
        }

        func scrollViewDidEndDecelerating(_ scrollView: UIScrollView) { //this is where the scroll is replicated to SwiftUI
            let page = Int(scrollView.contentOffset.x / scrollView.frame.size.width)
            if page != parent.currentPage {
                parent.currentPage = 1
            }
        }
    }
}

struct PageControl: UIViewRepresentable {
    @Binding var currentPage: Int
    var numberOfPages: Int

    func makeUIView(context: Context) -> UIPageControl { //first called when PageControl is called
        let pageControl = UIPageControl()
        pageControl.numberOfPages = numberOfPages
        pageControl.currentPage = currentPage
        pageControl.pageIndicatorTintColor = .gray
        pageControl.currentPageIndicatorTintColor = .white
        
        return pageControl
    }

    func updateUIView(_ uiView: UIPageControl, context: Context) {
        uiView.currentPage = currentPage
//            print("updateUIView - currentPage: \(currentPage)")
    }
}




#Preview {
//    @Previewable @State var previewSearchText: String = ""
    @Previewable @State var previewPages: [String] = [""]
    @Previewable @State var previewCurrent: Int = 0
    PageView(pages: previewPages, currentPage: $previewCurrent)
}
