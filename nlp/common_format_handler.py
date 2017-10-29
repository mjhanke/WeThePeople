"""
Everything dealing with bill json format handling goes here.

Note that this requires Python 2.7, as the summarizer uses this version :/
"""
import json
import requests
import nltk
import nameparser
from string import Template
from pprint import pprint
from summarize_bill import summarize_bill_from_url
from summarize_bill import simplify_human_summary

def convert_congress_bill(bill):
    """Converts bill from congress scraper to our common format"""
    new_bill = {}
    new_bill['actions'] = bill_actions(bill)
    new_bill['status'] = {}
    new_bill['status']['passed_lower'] = house_passage(bill)
    new_bill['status']['passed_upper'] = senate_passage(bill)
    new_bill['status']['signed'] = bill['history']['enacted']
    new_bill['status']['vetoed'] = bill['history']['vetoed']
    new_bill['bill_id'] = bill['bill_id']
    new_bill['topic'] = bill['subjects_top_term']
    new_bill['subtopics'] = bill['subjects']
    new_bill['scraped_topics'] = []
    new_bill['state'] = None
    new_bill['level_code'] = 0
    new_bill['human_summary'] = human_summary(bill)
    new_bill['full_text_url'] = full_text_url(bill)
    new_bill['machine_summary'] = machine_summary(bill)
    new_bill['last_updated'] = last_updated_date(bill)
    new_bill['house_committee'] = house_committee(bill)
    new_bill['senate_committee'] = senate_committee(bill)
    new_bill['sponsor'] = bill_sponsor(bill['sponsor'])
    new_bill['cosponsors'] = bill_cosponsors(bill)
    new_bill['related_bills'] = bill['related_bills']
    new_bill['introduction_date'] = introduction_date(bill)
    new_bill['short_title'] = shortened_title(bill)
    new_bill['title'] = bill_title(bill)
    return json.dumps(new_bill)

def bill_actions(bill):
    """Converts bill actions to common format"""
    actions = []
    for action in bill['actions']:
        actions.append({
            'date': action['acted_at'][:10],
            'action': action['text']
        })
    return actions

def house_passage(bill):
    """Determine whether bill passed house"""
    passed_house = 'house_passage_result' in bill['history']\
        and bill['history']['house_passage_result'] == 'pass'
    return passed_house

def senate_passage(bill):
    """Determine whether bill passed senate"""
    passed_senate = 'senate_passage_result' in bill['history']\
        and bill['history']['senate_passage_result'] == 'pass'
    return passed_senate

def bill_title(bill):
    """Converts bill title to common format"""
    assert bill['official_title']
    if bill['popular_title']:
        return bill['popular_title']
    elif bill['short_title']:
        return bill['short_title']
    elif bill['official_title']:
        return bill['official_title']

def shortened_title(title):
    """Shortens bill title"""
    new_title = title
    if new_title.startswith('To '):
        new_title = new_title[3:]
    new_title = new_title.replace(', and for other purposes.', '')
    new_title = new_title[0].upper() + new_title[1:]
    new_title = nltk.sent_tokenize(new_title)[0]
    return new_title

def bill_type_url(bill_type):
    """
    E.g., hr => house-resolution, for:
    congress.gov/bill/115th-congress/house-resolution/
    """
    bill_type_map = {
        'hconres': 'house-concurrent-resolution',
        'hjres': 'house-joint-resolution',
        'hr': 'house-bill',
        'hres': 'house-resolution',
        's': 'senate-bill',
        'sconres': 'senate-concurrent-resolution',
        'sjres': 'senate-joint-resolution',
        'sres': 'senate-resolution',
    }
    assert bill_type in bill_type_map
    return bill_type_map[bill_type]

def bill_committee_codes(bill):
    """Find all committee codes associated with a bill."""
    committee_codes = []
    for action in bill['actions']:
        if 'committees' in action:
            committee_codes += action['committees']
    # Remove duplicates
    committee_codes = list(set(committee_codes))
    assert len(committee_codes) <= 2
    return committee_codes


def committee_name(code):
    """Find full name of committee based off thomas_id."""
    with open('congress_committees.json') as file:
        committees = json.load(file)
        # element for element in people if element['name'] == name
        matching_names = [comm['name'] for comm in committees
                          if comm['thomas_id'] == code]
        assert matching_names
        return matching_names[0]


def senate_committee(bill):
    """Find senate committee of origin, if one exists."""
    codes = bill_committee_codes(bill)
    for code in codes:
        if code[0] == 'S':
            return committee_name(code)
    return ''


def house_committee(bill):
    """Find house committee of origin, if one exists."""
    codes = bill_committee_codes(bill)
    for code in codes:
        if code[0] == 'H':
            return committee_name(code)
    return ''


def human_summary(bill):
    """Grab human-written bill summary, if one exists."""
    if 'summary' in bill and 'text' in bill['summary']:
        return simplify_human_summary(bill['summary']['text'])
    return ''


def full_text_url(bill):
    """
    A full-text url is not provided, so we have to construct it. Example:
    https://www.congress.gov/bill/115th-congress/house-joint-resolution/113
    """
    congress_num = '114th'
    bill_type = bill_type_url(bill['bill_type'])
    bill_num  = bill['number']
    template = 'https://www.congress.gov/bill/${congress_num}-congress/${bill_type}/${bill_num}/text?format=txt'
    url = Template(template).substitute(locals())
    return url


def bill_sponsor(person):
    """Grab complete sponsor information from GPO 'person' object."""
    sponsor = {}
    parsed_name = nameparser.HumanName(person['name'])
    sponsor['first_name'] = parsed_name['first']
    sponsor['last_name'] = parsed_name['last']
    sponsor['id'] = person['bioguide_id']
    sponsor['state'] = person['state']
    sponsor['title'] = person['title']
    sponsor['facebook_id'] = ''
    endpoint = 'https://api.propublica.org/congress/v1/members/' \
        + sponsor['id'] + '.json'
    headers = {
        'X-API-Key': '76l8Lwp3w45mu6BeOShc17r3H4I264iK2mqMfX1k'
    }
    request = requests.get(endpoint, headers=headers)
    response = json.loads(request.text)
    if 'results' in response and response['results']:
        sponsor['facebook_id'] = response['results'][0]['facebook_account']
    else: assert False
    return sponsor


def bill_cosponsors(bill):
    """Build list of bill cosponsors from GPO 'person' objects."""
    cosponsors = []
    for person in bill['cosponsors']:
        cosponsors.append(bill_sponsor(person))
    return cosponsors


def introduction_date(bill):
    """Get day that the bill was introduced"""
    if bill['actions']:
        return bill['actions'][0]['acted_at']


def last_updated_date(bill):
    """Get date the bill was last updated."""
    return bill['updated_at'][:10]

def machine_summary(bill):
    """Get TextRank summary of bill"""
    url = full_text_url(bill)
    title = bill_title(bill)
    print url
    summary = summarize_bill_from_url(title, url)
    return summary

with open('tempBill.json') as data_file:
    data = json.load(data_file)
    print convert_congress_bill(data)