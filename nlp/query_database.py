"""All operations fetching and processing bill data from MongoDB"""

import pymongo
import json
from bson.json_util import dumps

def find_all_bills_with_subtopics(subtopics):
    """
    Queries MongoDB database for all bills relating to a list of
    subtopics, returns JSON array of bills
    """

    connection = pymongo.MongoClient()
    database = connection.bills
    congress_bills = database.congress

    # Query performance stats
    # print(pprint.pprint(congress_bills.find({'subjects': \
    # {'$in': subtopics}}).explain()))

    bills = list(congress_bills.find({'subjects': {'$in': subtopics}}))

    return dumps(bills)

find_all_bills_with_subtopics(['Michigan'])
