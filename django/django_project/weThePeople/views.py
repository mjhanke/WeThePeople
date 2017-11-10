from django.shortcuts import render
from django.http import JsonResponse 
from db_connect import test_db, wtp_db
from bson.objectid import ObjectId
from django.views.decorators.csrf import csrf_exempt		

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

# -1 is <, 0 is ==, 1 is >
def bill_compare(bill1, bill2):
	d1 = bill1.get('actions', [-1])[-1]
	d2 = bill2.get('actions', [-1])[-1]

	# if either doesn't have a date/failed to read or something
	if d1 == -1:
		return -1
	if d2 == -1:
		return 1

	d1 = d1['date']
	d2 = d2['date']

	# one year is more recent
	if d1.split('-')[0] != d2.split('-')[0]:
		return int(d1.split('-')[0]) - int(d2.split('-')[0])
	# one month is more recent
	if d1.split('-')[1] != d2.split('-')[1]:
		return int(d1.split('-')[1]) - int(d2.split('-')[1])
	# one day is more recent
	if d1.split('-')[2] != d2.split('-')[2]:
		return int(d1.split('-')[2]) - int(d2.split('-')[2])

	# must be same date
	return 0


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
		#get the national bills
		level_code = 0
		for interest in listOfInterests:
			relevant_bills = relevant_bills + list(wtp_db.bills.find({"$and" :[ { "$or": [ {"topic": interest}, {"subtopics": interest}] }, {"level_code": level_code}]}))
	else:
		level_code = 1
		#make sure the state code is valid
		if(state not in state_abbreviations):
			return JsonResponse({"status": "error", "message": "incorrect state abbreviation"})
		#get the state bills
		for interest in listOfInterests:
			relevant_bills = relevant_bills + list(wtp_db.bills.find({"$and" :[ { "$or": [ {"topic": interest}, {"subtopics": interest}] }, {"level_code": level_code}, {"state": state} ] } ) )
	#convert '_id' to a string to make the bill serializable
	for bill in relevant_bills:
		bill['_id'] = str(bill['_id'])
	return JsonResponse(relevant_bills, safe=False)

def get_bill_by_id(request):
	if(request.method != 'GET'):
		return JsonResponse({"status": "error", "message": "request method should be GET"})
	bill_uid = request.GET.get("bill_uid", "")
	if(bill_uid == ""):
		return JsonResponse({"status": "error", "message": "no unique bill id given"})
	results = list(wtp_db.bills.find({"_id": ObjectId(bill_uid)}))
	if((len(results)) > 1):
		return JsonResponse({"status": "error", "message": "not a unique bill id"})
	if((len(results)) == 0):
		return JsonResponse({"status": "error", "message": "no bill found for that id"})
	bill = results[0]
	bill["_id"] = str(bill["_id"])
	return JsonResponse(bill)

@csrf_exempt
def user_reaction(request):
	if(request.method != 'POST'):
		return JsonResponse({"status": "error", "message": "request method should be POST"})
	bill_id = request.POST.get("bill_id", "")
	if(bill_id == ""):
		return JsonResponse({"status": "error", "message": "no unique bill id given"})
	res = list(wtp_db.bills.find({"bill_id": bill_id}))
	if(len(res)==0):
		return JsonResponse({"status": "error", "message": "bill_id does not corresspond to a bill in database"})
	smiley_action = request.POST.get("smiley_action", "")
	frowny_action = request.POST.get("frowny_action", "")
	#increases smiley count
	if(smiley_action == "add"):
		result = wtp_db.bills.update_one({"bill_id": bill_id}, {"$inc": {"smiley_count": 1} } )
	#decrease smiley count
	elif(smiley_action == "remove"):
		bill_to_update = wtp_db.bills.find_one({"bill_id": bill_id})
		if(bill_to_update['smiley_count'] >= 1):
			result = wtp_db.bills.update_one({"bill_id": bill_id}, {"$inc": {"smiley_count": -1} } )
	#input string is not well formed
	elif(smiley_action != ""):
		return JsonResponse({"status": "error", "message": "smiley_action should be either \"add\" or \"remove\" "})
	

	#increase frowney count
	if(frowny_action == "add"):
		result = wtp_db.bills.update_one({"bill_id": bill_id}, {"$inc": {"frowny_count": 1} } )
	#decrease frowney count
	elif(frowny_action == "remove"):
		bill_to_update = wtp_db.bills.find_one({"bill_id": bill_id})
		if(bill_to_update['frowny_count'] >= 1):
			result = wtp_db.bills.update_one({"bill_id": bill_id}, {"$inc": {"frowny_count": -1} } )
	#input string is not well formed
	elif(frowny_action != ""):
		return JsonResponse({"status": "error", "message": "frowny_action should be either \"add\" or \"remove\" "})
	#return JsonResponse({"status": "success", "message": "unknown error", "bill_id": bill_id, "smiley_action": smiley_action})
	return JsonResponse({"status": "success", "message": "added user reaction"})

def get_all_bills_new(request):
	if(request.method != 'GET'):
		return JsonResponse({"status": "error", "message": "request method should be GET"})
	#get interests
	listOfInterests = request.GET.getlist("topic", [])
	if(listOfInterests == []):
		return JsonResponse({"status": "error", "message": "no topics selected as interests"})
	#determine if want national or state level legislation
	relevant_bills = []
	state = request.GET.get("state", "").lower()
	
	#get the national bills
	for interest in listOfInterests:
		relevant_bills = relevant_bills + list(wtp_db.bills.find({"$and" :[ { "$or": [ {"topic": interest}, {"subtopics": interest}] }, {"level_code": 0}]}))
	if state != "":
		#make sure the state code is valid
		if(state not in state_abbreviations):
			return JsonResponse({"status": "error", "message": "incorrect state abbreviation"})
		#get the state bills
		for interest in listOfInterests:
			relevant_bills = relevant_bills + list(wtp_db.bills.find({"$and" :[ { "$or": [ {"topic": interest}, {"subtopics": interest}] }, {"level_code": 1}, {"state": state} ] } ) )
	#convert '_id' to a string to make the bill serializable
	for bill in relevant_bills:
		bill['_id'] = str(bill['_id'])

	# lines = sorted(lines, key=lambda k: k['page'].get('update_time', 0), reverse=True)
	relevant_bills = sorted(relevant_bills, cmp=bill_compare)
	# now return 20 most recent
	return JsonResponse(relevant_bills, safe=False)

def create_user(request):
	return JsonResponse({'status': 'not implemented'})

def address(request):
	return JsonResponse({'status': 'not implemented'})