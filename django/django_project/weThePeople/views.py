from django.shortcuts import render
from django.http import JsonResponse 
from db_connect import test_db, wtp_db

state_abbreviations = {
			"al": True,
			"ak": True,
			"az": True,
			"ar": True,
			"ca": True,
			"co": True,
			"ct": True,
			"de": True,
			"fl": True,
			"ga": True,
			"hi": True,
			"id": True,
			"il": True,
			"in": True,
			"ia": True,
			"ks": True,
			"ky": True,
			"la": True,
			"me": True,
			"md": True,
			"ma": True,
			"mi": True,
			"mn": True,
			"ms": True,
			"mo": True,
			"mt": True,
			"ne": True,
			"nv": True,
			"nh": True,
			"nj": True,
			"nm": True,
			"ny": True,
			"nc": True,
			"nd": True,
			"oh": True,
			"ok": True,
			"or": True,
			"pa": True,
			"ri": True,
			"sc": True,
			"sd": True,
			"tn": True,
			"tx": True,
			"ut": True,
			"vt": True,
			"va": True,
			"wa": True,
			"wv": True,
			"wi": True,
			"wy": True
}

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
	listOfInterests = request.GET.getlist("topic", [])
	if(listOfInterests == []):
		return JsonResponse({"status": "error", "message": "no topics selected as interests"})
	#determine if want national or state level legislation
	relevant_bills = []
	state = request.GET.get("state", "").lower()
	if(state == ""):
		level_code = 0
		for interest in listOfInterests:
			relevant_bills = relevant_bills + list(wtp_db.bills.find({"$and" :[ { "$or": [ {"topic": interest}, {"subtopics": interest}] }, {"level_code": level_code}]}))
	else:
		level_code = 1
		if(state not in state_abbreviations):
			return JsonResponse({"status": "error", "message": "incorrect state abbreviation"})
		for interest in listOfInterests:
			relevant_bills = relevant_bills + list(wtp_db.bills.find({"$and" :[ { "$or": [ {"topic": interest}, {"subtopics": interest}] }, {"level_code": level_code}, {"state": state} ] } ) )
	return JsonResponse(relevant_bills, safe=False)
def create_user(request):
	return JsonResponse({'status': 'not implemented'})

def address(request):
	return JsonResponse({'status': 'not implemented'})