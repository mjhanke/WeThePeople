from django.shortcuts import render
from django.http import JsonResponse 
from db_connect import test_db, wtp_db

def index(request):
	return render(request, 'weThePeople/index.html')
# Create your views here
def testdb(request):
	people_collection = test_db.people
	post = {
		"name": "Taylor",
		"favorite_saying": "Curt is my HIRO"
	}
	people_collection.insert(post)
	person = people_collection.find_one({"name": "Taylor"})
	del person['_id']
	people_collection.delete_many({})
	return JsonResponse(person)

def get_bills(request):
	if(request.method != 'GET'):
		return JsonResponse({"status": "error", "message": "request method should be GET"})
	#get interests
	interestsString = request.GET.get("topics", "")
	if(interestsString == ""):
		return JsonResponse({"status": "error", "message": "no topics selected as interests"})
	listOfInterests = interestsString.split(',')
	#get national legislation
	relevant_bills = []
	for interest in listOfInterests:
		relevant_bills = relevant_bills + list(wtp_db.bills.find({"$and" :[ { "$or": [ {"topic": interest }, { "subtopics": interest}] }, {"level_code": 0}]}))
	return JsonResponse(relevant_bills, safe=False)

def create_user(request):
	return JsonResponse({'status': 'not implemented'})

def address(request):
	return JsonResponse({'status': 'not implemented'})