//
//  AddressInputController.swift
//  WeThePeople
//
//  Created by Daniel Bennett on 8/8/17.
//  Copyright © 2017 Daniel Bennett. All rights reserved.
//

import UIKit

class AddressInputController: UIViewController {

    @IBOutlet weak var textField: UITextField!
    @IBOutlet weak var nextButton: LoadingButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        textField.becomeFirstResponder()
        setupNextButton()
    }

    func setupNextButton() {
        nextButton.addTarget(self, action: #selector(nextButtonTapped), for: .touchUpInside)
        nextButton.layer.cornerRadius = 2
        nextButton.alpha = 0.5
        nextButton.isEnabled = false
        NotificationCenter.default.addObserver(
            self,
            selector: #selector(textChanged(sender:)),
            name: NSNotification.Name.UITextFieldTextDidChange,
            object: nil)
    }

    func textChanged(sender: NSNotification) {
        if textField.hasText {
            nextButton.alpha = 1
            nextButton.isEnabled = true
        } else {
            nextButton.alpha = 0.5
            nextButton.isEnabled = false
        }
    }

    func nextButtonTapped() {
        assert(textField.hasText)
        textField.resignFirstResponder()
        let address = textField.text!
        UserDefaults.standard.set(address, forKey: "address")
        let topicBubbles = OnboardingController()
        topicBubbles.type = .topicSelect
        navigationController?.pushViewController(topicBubbles, animated: true)
    }
}
