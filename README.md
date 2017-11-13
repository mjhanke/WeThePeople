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


## Backend - Server
Backend code for API requests is maintained in the `django` folder, which has been cloned onto our DigitalOcean droplet at `wethepeople.tech`. To start the `mongo` service, run `service mongod start`. To start the Gunicorn service, run `service gunicorn start`. In `django/django_project/weThePeople`, `views.py` and `urls.py` do the heavy-lifting for API requests and responses.

## Backend - Bill Stuff
Backend code for bill fetching and insertions is maintain in the `nlp` folder. The end-all script to run is `nlp/fetch_bills.sh`, which uses some Python and Bash scripts in the `congress` folder to fetch bills and insert them into the database. This is automated every-6-hourly with a cronjob, which is set to:
`cd /home/nlp && source /root/.virtualenvs/congress/bin/activate && ./fetch_bills.sh >> /home/nlp/cronjob.log 2>&1 && deactivate`.

## Backend - Interface
The backend provided the following API routes:
```
api/v1/get_bills
api/v1/get_bill_by_id
api/v1/user_reaction
api/v1/get_newsfeed_bills
```
