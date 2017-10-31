"""Interactions between MongoDB database and congress bill json"""
import os
import json
import codecs
import pymongo
from bson.json_util import loads

def load_json_to_database():
    """
    Iterates through files generated by congress bill scraper and adds them
    to MongoDB database
    """
    connection = pymongo.MongoClient()
    database = connection.bills
    congress_bills = database.congress

    PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'congress/data/115/bills'))

    bills = []

    # Load all scrapped bill json files
    for path, dirs, files in os.walk(PATH):
        for filename in files:
            fullpath = os.path.join(path, filename)
            print(fullpath)

            if filename == 'data.json':
                with codecs.open(fullpath, 'r', encoding='utf-8',
                                 errors='replace') as data:
                    print(fullpath)
                    bill = json.load(data)
                    # bill = json.load(data.read())
                    bills.append(bill)

    for bill in bills:
        # Since we have a relatively small (< 10,000) number of bills, we
        # replace every one, without checking if the contents have changed.
        # True flag is an "upsert": performs an insert if nothing found
        congress_bills.replace_one({'bill_id': bill['bill_id']}, bill, True)
from pymongo import MongoClient
def insert_bills(bill):
        client = MongoClient()
        db = client.wtp
        db.bills.replace_one({'bill_id': bill['bill_id']}, bill, True)
