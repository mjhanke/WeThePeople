kill $(ps aux | grep 'Xcode' | awk '{print $2}')
rm -rf ~/Library/Developer/Xcode/DerivedData
Watchman watch-del-all
rm -rf node_modules
yarn install
rm -fr $TMPDIR/react-*
cd ios/
open WeThePeople.xcworkspace
cd ..
yarn start -- --reset-cache
