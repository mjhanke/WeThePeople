from django.shortcuts import render
from django.http import JsonResponse
from db_connect import test_db, wtp_db

def index(request):
	return render(request, 'weThePeople/index.html')
# Create your views here
def testdb(request):
#	from pymongo import MongoClient
#	client = MongoClient('localhost', 27017)
#	test_db = client.test
	people_collection = test_db.people
	post = {
		"name": "Taylor",
		"favorite_saying": "Curt is my HIRO"
	}
	people_collection.insert(post)
	person = people_collection.find_one({"name": "Taylor"})
	del person['_id']
	people_collection.delete_many({})
#	json_person = JSONEncoder().encode(person)


#	people_collection = test_db.people
#	person = {"name": "Taylor",
#		"favorite_saying": "Curt is my HIRO"
#	}
#	people_collection.insert_one(person)
#	document = people_collection.find_one()
#	people_collection.delete_many({"name": "Taylor"})
	return JsonResponse(person)
