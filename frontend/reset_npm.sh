kill $(ps aux | grep 'Xcode' | awk '{print $2}')
rm -rf ~/Library/Developer/Xcode/DerivedData
Watchman watch-del-all
rm -rf node_modules
rm -r ~/.rncache
yarn cache clean
yarn install
react-native link
cd ios/
open WeThePeople.xcworkspace
cd ..
