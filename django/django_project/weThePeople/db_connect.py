from pymongo import MongoClient

client = MongoClient('localhost', 27017)
test_db = client.test
wtp_db = client.wtp
