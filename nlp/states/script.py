from __future__ import with_statement
from __future__ import absolute_import
import requests
import json
import time
from multiprocessing import Pool
from datetime import datetime
from newspaper import Article
import PyPDF2
import requests
import uuid
from io import open
import time


'''
import sys
sys.path.append("..")
import summarize_bill
'''


states = [u'ak', u'al', u'ar', u'az', u'ca', u'co', u'de', u'fl', u'ga', u'hi', u'ia', u'id', u'il', u'in', u'ks', u'ky', u'la', u'ma', u'md', u'me', u'mi', u'mo', u'ms', u'mt', u'nc', u'nd', u'ne', u'nh', u'nj', u'nm', u'nv', u'oh', u'ok', u'or', u'pa', u'ri', u'sc', u'sd', u'tn', u'ut', u'va', u'vt', u'wa', u'wi', u'wv', u'wy']
broken_states = [u'ct', u'mn', u'ny', u'tx']
#ct is fucked, ny too many requests...need more filters

apikey = u'b80dbeb2-7653-4b55-ba06-c382003f4eaa'

def get_state_bill_ids(state):
  #API can be filtered by updated since yesterday
  params = {u"apikey": apikey, u'state': state, u'search_window': u'session'}
  result = requests.get(u'https://openstates.org/api/v1/bills/', params=params)
  bills = json.loads(result.text)
  new_bills = [(bill[u'id'], bill[u'updated_at']) for bill in bills]
  return new_bills

def get_sponsor(leg_id):
  if not leg_id:
    return {}
  result = requests.get(u"https://openstates.org/api/v1/legislators/" + leg_id, params={u"apikey": apikey})
  raw = json.loads(result.text)
  sponsor = {}

  sponsor[u"first_name"] = raw[u'first_name']
  sponsor[u"last_name"] = raw[u'last_name']
  sponsor[u"picture_url"] = raw[u'photo_url'] #Picture url replacing facebook_id, can use facebook id to get it though
  sponsor[u"leg_id"] = leg_id
  sponsor[u"state"] = raw[u'state']
  #sponsor["title"] = raw['roles'][current]['title'] #will have to think of something

  return sponsor

def get_bill_details(tup):
  bill_id, last_updated = tup
  result = requests.get(u"https://openstates.org/api/v1/bills/" + bill_id, params={u"apikey": apikey})
  raw = json.loads(result.text)

  B = {}

  B[u'actions'] = [{u'date': a[u'date'], u'action': a[u'action']} for a in raw[u'actions']]
  B[u'bill_status'] = {
    u'active': False, #bool for has seen activity beyond introduction, ok for state not to have
    u'passed_upper' :raw[u'action_dates'][u'passed_upper'],
    u'passed_lower': raw[u'action_dates'][u'passed_lower'],
    u'signed': raw[u'action_dates'][u'signed'],
    u'vetoed': None
  }
  B[u'bill_id'] = raw[u'bill_id']
  B[u'openstates_id'] = raw[u'id']
  B[u'topic'] = u"" #We need to pick this
  B[u'subtopics'] = [s.title() for s in raw[u'subjects']]
  if u'scraped_subjects' in raw:
    B[u'scraped_topics'] = [s.title() for s in raw[u'scraped_subjects']]
  B[u'state'] = raw[u'state']
  B[u'level_code'] = 1 #state
  B[u'human_summary'] = u""
  B[u'machine_summary'] = u"" #get this lol
  B[u'title'] = raw[u'title']
  B[u'short_title'] = u""
  B[u'last_updated'] = raw[u'updated_at']

  if raw[u'versions']:
    B[u"full_text_url"] = raw[u'versions'][-1][u'url'] #Get latest text
  else:
    B[u"full_text_url"] = u""

  #Generate sponsors
  B[u'cosponsors'] = []
  all_sponsors = [(s[u'leg_id'], s[u'type']) for s in raw[u'sponsors']]
  for sponsor in all_sponsors:
    if sponsor[1] == u'primary':
      B[u'sponsor'] = get_sponsor(sponsor[0])
    else:
      B[u'cosponsors'].append(get_sponsor(sponsor[0]))

  B[u"related_bills"] = [] #TODO
  B[u"history"] = {} #TODO

  B[u"introduction_date"] = raw[u'created_at']

  return B

def identify_url_format(url):
  url = url.lower()

  if not url:
    ret = u'nourl'
  else:
    if u'ftp' in url:
      ret = u'ftp'
    else: #probably http
      if u'pdf' in url:
        ret = u'pdf'
      else: #regular html file
        ret = u'html'

  return ret

def download_ftp(url):
  pass

def download_pdf(url):
  _uuid = unicode(uuid.uuid4())
  filename = u'pdfs/' + _uuid + u'.pdf'

  response = requests.get(url)
  with open(filename, u'wb') as f:
    f.write(response.content)

  #Maybe somehow stream content
  with open(filename, u'rb') as f:
    pdf_reader = PyPDF2.PdfFileReader(f)

    #Really pages but whatever for now
    all_lines = [pdf_reader.getPage(i).extractText() for i in xrange(0, pdf_reader.numPages)]

    #cleanup section
    #Remove newlines and form feed characters
    all_lines = [line.rstrip().replace(u'\x0C', u'') for line in all_lines]

    #Get rid of any page #s sitting around
    all_lines = [re.sub(ur'Page \d*', ur'', line) for line in all_lines]

    #Get rid of empty lines and page # lines
    all_lines = [line for line in all_lines if line and not line.isdigit()]

    #Remove random "
    all_lines = [line.replace(u'"', u'') for line in all_lines]

    #Deal with crossing stuff out...


  return full_text

def download_html(url):
  article = Article(url)
  article.download()
  article.download() #TODO this is not necessary probably
  article.parse()

  return article.text


def tryOne(state):
  tup = get_state_bill_ids(state)[0]

  bill = get_bill_details(tup)
  url = bill[u'full_text_url']

  url_format = identify_url_format(url)

  if url_format == u'ftp':
    #Handle ftp stuff (ar)
    return (state, u'ftp')
  elif url_format == u'html':
    txt = download_html(url)
    ret = u'htmlok' if len(txt) > 0 else u'htmlbad'
    #if len(txt) > 0:
      #print(txt)
      #import ipdb; ipdb.set_trace()
  elif url_format == u'pdf':
    txt = download_pdf(url)
    #print(txt)
    #import ipdb; ipdb.set_trace() 
    ret = u'pdf'
  elif url_format == u'nourl':
    ret = u'nourl'

  return (state, ret)


u'''
xx = [tryOne(state) for state in states]

all_ok = [x for x,y in xx if y == "htmlok"]
print("htmlok", all_ok, len(all_ok))
all_no = [x for x,y in xx if y == "htmlbad"]
print("htmlbad", all_no, len(all_no))
all_no_url = [x for x,y in xx if y == "nourl"]
print("nourl", all_no_url, len(all_no_url))
all_pdf = [x for x,y in xx if y == "pdf"]
print("pdf", all_pdf, len(all_pdf))
all_ftp = [x for x,y in xx if y == "ftp"]
print("ftp", all_ftp, len(all_ftp))
'''
def flatten(_list):
  return [item for sublist in _list for item in sublist]


#For one state XXX

#Get state bill ids 
start = time.time()
bill_ids = get_state_bill_ids(u'mi')
print len(bill_ids), u"bill ids", time.time() - start
#TODO narrow down to only most recent updates here

bill_ids = bill_ids[:10] #So we can test without taking too much time

start = time.time()
p = Pool(10)
bills = p.map(get_bill_details, bill_ids)
#Sync version
#bills = [get_bill_details(bill_id) for bill_id in bill_ids]
print u"bill details", time.time() - start

for idx, bill in enumerate(bills):
  url = bill[u'full_text_url']
  with open(u'test/' + unicode(idx) + u'.txt', u'w') as f:
    f.write(download_html(url))
