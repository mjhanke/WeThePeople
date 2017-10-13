//
//  TopicBubbleController.swift
//  WeThePeople
//
//  Created by Daniel Bennett on 8/5/17.
//  Copyright © 2017 Daniel Bennett. All rights reserved.
//

import UIKit
import SpriteKit

class TopicBubbleController: UIViewController {

    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var subtitleTextView: UITextView!
    @IBOutlet weak var magneticView: MagneticView!

    var magnetic: Magnetic {
        return magneticView.magnetic
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        for topic in topics {
            let image = UIImage(named: topic.lowercased().replacingOccurrences(of: " ", with: "_"))
            if image != nil {
                let node = Node(text: topic, image: image!, color: UIColor.colors.randomItem(), radius: 47)
                magnetic.addChild(node)
            }
        }
    }

    func setFonts() {
        titleLabel.font = UIFont(name: "OpenSans-Light", size: titleLabel.font.pointSize)
        subtitleTextView.font = UIFont(name: "OpenSans-Light", size: titleLabel.font.pointSize)
    }

    let topics: [String] = [
        "Agriculture",
        "Animals",
        "Armed Forces",
        "Arts",
        "Civil Rights",
        "Commerce",
        "Congress",
        "Crime",
        "Economics",
        "Education",
        "Emergency Mgmt",
        "Energy",
        "Environmental Protection",
        "Families",
        "Finance",
        "Foreign Trade",
        "Gov't Operations",
        "Health",
        "Housing",
        "Immigration",
        "Int'l Affairs",
        "Labor",
        "Law",
        "Native Americans",
        "Public Lands",
        "Science",
        "Social Sciences",
        "Social Welfare",
        "Sports",
        "Taxation",
        "Transportation",
        "Water Resources"
    ]
}

// MARK: - MagneticDelegate
extension TopicBubbleController: MagneticDelegate {

    func magnetic(_ magnetic: Magnetic, didSelect node: Node) {
        print("didSelect -> \(node)")
    }

    func magnetic(_ magnetic: Magnetic, didDeselect node: Node) {
        print("didDeselect -> \(node)")
    }

}


