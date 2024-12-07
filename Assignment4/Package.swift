// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "Assignment4",
    platforms: [
	.macOS(.v10_14),
        .iOS(.v14) // Ensure we target iOS 14 or later
    ],
    products: [
        .library(
            name: "Assignment4",
            targets: ["Assignment4"]
        ),
    ],
    dependencies: [
        .package(url: "https://github.com/Alamofire/Alamofire.git", from: "5.10.2"),
        .package(url: "https://github.com/icanzilb/SwiftSpinner.git", from: "2.2.0"),
        .package(url: "https://github.com/SwiftyJSON/SwiftyJSON.git", from: "5.0.2"),
        .package(url: "https://github.com/scalessec/Toast-Swift.git", from: "5.1.1"),
        .package(url: "https://github.com/highcharts/highcharts-ios.git", from: "11.4.8"),
	.package(url: "https://github.com/mongodb/mongo-swift-driver.git", from: "1.3.0")

    ],
    targets: [
        .target(
            name: "Assignment4",
            dependencies: [
                "Alamofire",
                "SwiftSpinner",
                "SwiftyJSON",
		.product(name: "MongoSwiftSync", package: "mongo-swift-driver"),
                .product(name: "Toast", package: "Toast-Swift"), // Corrected product name for Toast-Swift
                .product(name: "Highcharts", package: "highcharts-ios") // Corrected product name for Highcharts
            ]
        ),
        .testTarget(
            name: "Assignment4Tests",
            dependencies: ["Assignment4"]
        ),
    ]
)
