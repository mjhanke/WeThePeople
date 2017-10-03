# This script sets up a fresh Debian 8 instance for use with WeThePeople
# Run this script with "sudo", many of these operations require root permissions
# MongoDB currently only works with Debian 8 (not Debian 9, the latest)

# Install required dependencies for congress scraper
apt-get update -y
apt-get install -y git python-dev libxml2-dev libxslt1-dev libz-dev python-pip

# Clone the WeThePeople repository
git clone https://gitlab.eecs.umich.edu/danbenn/WeThePeople.git
cd WeThePeople/
git checkout Development
cd backend/

# Install required Python packages for congress scraper
pip install -r congress/requirements.txt

echo "Preparing to download all bill metadata..."

# Give the bill fetching script permission to run
chmod u+x fetch_bills.sh

# Download all bill metadata for current session of Congress
# ./fetch_bills.sh

echo "Installing MongoDB..."
# Import the MongoDB public key used by the package management system
apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
echo "deb http://repo.mongodb.org/apt/debian jessie/mongodb-org/3.4 main" | tee /etc/apt/sources.list.d/mongodb-org-3.4.list
apt-get update
apt-get install -y mongodb-org
export PATH="$PATH:/usr/local/mongodb/bin"
mkdir -p /data/db
chown $USER /data/db
# Start MongoDB background service
service mongod stop
mongod &

echo "Installing Docker..."
# Install dependencies for Docker
apt-get install -y apt-transport-https ca-certificates curl \
  python-software-properties software-properties-common
# Import the Docker public key
curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -
add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/debian \
   $(lsb_release -cs) \
   stable"
apt-get update
apt-get install docker-ce
# Test whether installation was successful
docker run hello-world

# GNU screen is a utility for handling long-running processes.
apt-get install screen
screen -S "nginx_flask_screen" -d -m




echo "gcloud machine setup completed."
