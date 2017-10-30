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
