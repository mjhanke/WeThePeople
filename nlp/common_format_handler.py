"""
Everything dealing with bill json format handling goes here

Note that this requires
"""
import json
from pyteaser import Summarize
from string import Template
from pprint import pprint
from summarize_bill import summarize_bill_from_url

def convert_congress_bill(bill):
    """Converts bill from congress scraper to our common format"""
    new_bill = {}
    convert_actions(bill, new_bill)
    convert_history(bill, new_bill)

    new_bill['bill_id'] = bill['bill_id']

    new_bill['topic'] = bill['subjects_top_term']

    new_bill['subtopics'] = bill['subjects']

    new_bill['scraped_topics'] = []

    new_bill['state'] = None

    new_bill['level_code'] = 0

    convert_title(bill, new_bill)

    if 'summary' in bill and 'text' in bill['summary']:
        new_bill['human_summary'] = ['text']

    # A full-text url is not provided, so we have to construct it. Example:
    # https://www.congress.gov/bill/115th-congress/house-joint-resolution/113
    congress_num = '115th'
    bill_type = bill_type_url(bill['bill_type'])
    bill_num  = bill['number']
    template = 'https://www.congress.gov/bill/${congress_num}-congress/${bill_type}/${bill_num}/text'

    url = Template(template).substitute(locals())

    #print url

    machine_summary = summarize_bill_from_url(new_bill['title'], url)
    new_bill['machine_summary'] = machine_summary

    new_bill['short_title'] = create_shortened_title(new_bill['title'])

    #print machine_summary


def convert_actions(bill, new_bill):
    """Converts bill actions to common format"""

    bill['actions'] = []
    for action in bill['actions']:
        new_bill['actions'].append({
            'date': action['acted_at'],
            'action': action['text']
        })


def convert_history(bill, new_bill):
    """Converts bill history to common format"""

    new_bill['status'] = {}

    passed_house = 'house_passage_result' in bill['history']\
        and new_bill['history']['house_passage_result'] == 'pass'
    new_bill['passed_lower'] = passed_house

    passed_senate = 'senate_passage_result' in bill['history']\
        and new_bill['history']['senate_passage_result'] == 'pass'

    new_bill['passed_upper'] = passed_senate

    new_bill['signed'] = bill['history']['enacted']
    new_bill['vetoed'] = bill['history']['vetoed']

def convert_title(bill, new_bill):
    """Converts bill title to common format"""
    if bill['popular_title']:
        new_bill['title'] = bill['popular_title']
    elif bill['short_title']:
        new_bill['title'] = bill['short_title']
    elif bill['official_title']:
        new_bill['title'] = bill['official_title']
    assert bill['official_title']

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

def create_shortened_title(title):
    """Shortens bill title"""
    new_title = title
    if new_title.startswith('To '):
        new_title = new_title[3:]
    new_title = new_title.replace(', and for other purposes.', '')
    new_title = new_title[0].upper() + new_title[1:]
    return new_title

with open('tempSampleBill.json') as data_file:
    data = json.load(data_file)
    convert_congress_bill(data)
