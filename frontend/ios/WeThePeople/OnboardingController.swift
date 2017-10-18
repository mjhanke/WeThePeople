//
//  OnboardingController.swift
//  WeThePeople
//
//  Created by Daniel Bennett on 8/8/17.
//  Copyright © 2017 Daniel Bennett. All rights reserved.
//

import UIKit
import SwiftyJSON

class OnboardingController: UIViewController {

    @IBOutlet weak var viewTitle: UILabel!
    @IBOutlet weak var viewSubtitle: UITextView!
    @IBOutlet weak var magneticView: MagneticView!

    var type: OnboardingViewType = .topicSelect

    var magnetic: Magnetic {
        return magneticView.magnetic
    }

    var topicNodes = [TopicNode]()
    var selectedNodes = [TopicNode]()

    let generator = UIImpactFeedbackGenerator(style: .medium)

    override func viewDidLoad() {
        super.viewDidLoad()
        loadTopicNodes()
        addTopicNodesToScreen()
        switch self.type {
        case .topicSelect:
            viewTitle.text = "Tell us what you're into."
            viewSubtitle.text = "Tap on the topics you like. Swipe to reveal more."
        case .subtopicSelect:
            viewTitle.text = "Choose a few favorites."
            viewSubtitle.text = "Tap on the topics you like. Swipe to reveal more."
        }

        let doneButton = UIBarButtonItem(barButtonSystemItem: .done,
                                         target: self, action: #selector(nextButtonTapped))
        doneButton.isEnabled = false
        self.navigationItem.rightBarButtonItem = doneButton
        magneticView.magnetic.magneticDelegate = self

    }

    func nextButtonTapped() {

        switch type {
        case .topicSelect:
            let nextVC = OnboardingController()
            nextVC.type = .subtopicSelect
            nextVC.selectedNodes = selectedNodes
            navigationController?.pushViewController(nextVC, animated: true)
            break
        case .subtopicSelect:
            let nextVC = NewsfeedController()
            UserDefaults.standard.set(true, forKey: "finishedOnboarding")
            present(nextVC, animated: true, completion: nil)
            break
        }

    }

    func loadTopicNodes() {
        do {
            if let file = Bundle.main.url(forResource: "topic_hierarchy_edited",
              withExtension: "json") {
                let data = try Data(contentsOf: file)
                let topicsJson = JSON(data: data)
                for topicJson in topicsJson {
                    topicNodes.append(TopicNode(topicJson.1))
                }
            } else {
                print("no file")
            }
        } catch {
            print(error.localizedDescription)
        }
    }

    func addTopicNodesToScreen() {
        switch type {
        case .topicSelect:
            assert(selectedNodes.isEmpty)
            for topic in topicNodes {
                let image = UIImage(named: topic.image_name)
                if image != nil {
                    let node = Node(text: topic.topic_display_name, image: image!,
                                    color: topic.color, radius: 55)

                    magnetic.addChild(node)
                }
            }
        case .subtopicSelect:
            assert(!selectedNodes.isEmpty)
            for topic in selectedNodes {
                let image = UIImage(named: topic.image_name)
                let subtopics = topic.subtopic_display_names
                for i in stride(from: 0, to: subtopics.count/*[subtopics.count, 5].min()!*/, by: 1) {
                    let node = Node(text: subtopics[i], image: image!,
                                    color: topic.color, radius: 60)
                    magnetic.addChild(node)
                }
            }
        }
    }

}

extension OnboardingController: MagneticDelegate {
    func magnetic(_ magnetic: Magnetic, didSelect node: Node) {
        let topicName = node.label.text
        if let i = topicNodes.index(where: { $0.topic_display_name == topicName }) {
            selectedNodes.append(topicNodes[i])
        }
        self.navigationItem.rightBarButtonItem?.isEnabled = true
        generator.impactOccurred()
    }

    func magnetic(_ magnetic: Magnetic, didDeselect node: Node) {
        let topicName = node.label.text
        if let i = selectedNodes.index(where: { $0.topic_display_name == topicName }) {
            selectedNodes.remove(at: i)
        }
        if selectedNodes.isEmpty {
            self.navigationItem.rightBarButtonItem?.isEnabled = false
        }
        generator.impactOccurred()
    }
}

class TopicNode {
    let topic_display_name: String
    let should_show_to_users: Bool
    let image_name: String
    var subtopic_display_names = [String]()
    var group_id: Int
    init(_ jsonTopic: JSON) {
        topic_display_name = jsonTopic["topic_display_name"].stringValue
        should_show_to_users = jsonTopic["should_show_to_users"].boolValue
        image_name = jsonTopic["image_name"].stringValue
        group_id = jsonTopic["group_id"].intValue
        let subtopics = jsonTopic["subtopic_display_names"].arrayValue
        for subtopic in subtopics {
            subtopic_display_names.append(subtopic.stringValue)
        }
    }
    var color: UIColor {
        return TopicNode.colorMap[group_id]
    }
    static var colorMap: [UIColor] = [.white, .blue, .pink, .purple, .yellow, .green, .orange]
}

enum OnboardingViewType {
    case topicSelect
    case subtopicSelect
}
