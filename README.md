# WeThePeople

## Getting Started 

To run the iOS app:

Navigate to the "frontend" folder and do:

```bash
brew install yarn
yarn install
cd ios/
sudo gem install cocoapods
pod install
open WeThePeople.xcworkspace
cd ..
yarn start
brew cask install fastlane
export PATH="$HOME/.fastlane/bin:$PATH"
match init
```

There will be an error in one of the React files. Change "RCTAnimation/" to "React/". 

Sorry about the hack.

If you'd like to run WeThePeople on your physical iPhone:

1) Find UUID of your iPhone by visiting http://get.udid.io/ on Safari on your phone.

2) I (Dan) will need to run ```fastlane run register_device```, follow prompts, then ```match development --force```

3) On your computer, run ```match development --force``` to download the updated certs


```python
"""
create-user/
Args:
    state(string): the state that the user inputs as location
    topics(array of strings): topics that the user inputs they’re interested in
Returns:
    token(string): token associated with a user


bills/
Args:
    token(string): token associated with a user
    state(bool): whether or not to return state level bills
    national(bool): whether or not to return national level bills
Returns:
    state(list): list of state level bill objects
    national(list): list of national level bill objects
"""
```
