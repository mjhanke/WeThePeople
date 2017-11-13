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


##Backend
Backend code for API requests is maintained in the `django` folder, which has been cloned onto our DigitalOcean droplet at `wethepeople.tech`. To start the `mongo` service, run `service mongo start`. To start the Django server, run `CURT PUT THAT COMMAND HERE`. To start the Gunicorn service, run `service gunicorn start`. In `django/django_project/weThePeople`, `views.py` and `urls.py` do the heavy-lifting for API requests and responses.

Backend code for bill fetching and insertions is maintain in the `nlp` folder. The end-all script to run is `nlp/fetch_bills.sh`, which uses some Python and Bash scripts in the `congress` folder to fetch bills and insert them into the database. This is automated every-6-hourly with a cronjob, which is set to `cd /home/nlp && source /root/.virtualenvs/congress/bin/activate && ./fetch_bills.sh >> /home/nlp/cronjob.log 2>&1 && deactivate`.