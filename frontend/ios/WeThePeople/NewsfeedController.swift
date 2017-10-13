//
//  NewsfeedController.swift
//  WeThePeople
//
//  Created by Daniel Bennett on 9/21/17.
//  Copyright © 2017 Daniel Bennett. All rights reserved.
//

import UIKit
import React
import Instabug

class NewsfeedController: UIViewController {

    @IBOutlet weak var newsfeedView: UIView!
    @IBOutlet weak var instabugButton: UIButton!
    @IBAction func instabugButton(_ sender: Any) {
        Instabug.invoke()
    }
    var reactView: RCTRootView!

    override func viewDidLoad() {
        super.viewDidLoad()
        var props: [String : Any] = [:]
        if let voterAddress: Any = UserDefaults.standard.string(forKey: "address") {
            props = ["voterAddress": voterAddress]
        }

        #if DEBUG
            let jsCodeLocation = URL(string: "http://localhost:8081/index.ios.bundle?platform=ios")
        #else
            let jsCodeLocation = CodePush.bundleURL()
        #endif

        reactView = RCTRootView(
            bundleURL: jsCodeLocation,
            moduleName: "WeThePeople",
            initialProperties: props,
            launchOptions: nil)
        view.addSubview(reactView)
    }

    override func viewDidAppear(_ animated: Bool) {
        reactView.frame = view.bounds
        view.sendSubview(toBack: reactView)
    }

}
