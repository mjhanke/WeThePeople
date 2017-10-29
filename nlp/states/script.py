import requests
import json
import time
from multiprocessing import Pool
from datetime import datetime
from newspaper import Article
import PyPDF2
import requests
import uuid

states = ['ak', 'al', 'ar', 'az', 'ca', 'co', 'de', 'fl', 'ga', 'hi', 'ia', 'id', 'il', 'in', 'ks', 'ky', 'la', 'ma', 'md', 'me', 'mi', 'mo', 'ms', 'mt', 'nc', 'nd', 'ne', 'nh', 'nj', 'nm', 'nv', 'oh', 'ok', 'or', 'pa', 'ri', 'sc', 'sd', 'tn', 'ut', 'va', 'vt', 'wa', 'wi', 'wv', 'wy']
broken_states = ['ct', 'mn', 'ny', 'tx']
#ct is fucked, ny too many requests...need more filters

apikey = 'b80dbeb2-7653-4b55-ba06-c382003f4eaa'

def get_state_bill_ids(state):
  #API can be filtered by updated since yesterday
  params = {"apikey": apikey, 'state': state, 'search_window': 'session'}
  result = requests.get('https://openstates.org/api/v1/bills/', params=params)
  bills = json.loads(result.text)
  new_bills = [(bill['id'], bill['updated_at']) for bill in bills]
  return new_bills

def get_sponsor(leg_id):
  if not leg_id:
    return {}
  result = requests.get("https://openstates.org/api/v1/legislators/" + leg_id, params={"apikey": apikey})
  raw = json.loads(result.text)
  sponsor = {}

  sponsor["first_name"] = raw['first_name']
  sponsor["last_name"] = raw['last_name']
  sponsor["picture_url"] = raw['photo_url'] #Picture url replacing facebook_id, can use facebook id to get it though
  sponsor["leg_id"] = leg_id
  sponsor["state"] = raw['state']
  #sponsor["title"] = raw['roles'][current]['title'] #will have to think of something

  return sponsor

def get_bill_details(tup):
  bill_id, last_updated = tup
  result = requests.get("https://openstates.org/api/v1/bills/" + bill_id, params={"apikey": apikey})
  raw = json.loads(result.text)

  B = {}

  B['actions'] = [{'date': a['date'], 'action': a['action']} for a in raw['actions']]
  B['bill_status'] = {
    'active': False, #bool for has seen activity beyond introduction, ok for state not to have
    'passed_upper' :raw['action_dates']['passed_upper'],
    'passed_lower': raw['action_dates']['passed_lower'],
    'signed': raw['action_dates']['signed'],
    'vetoed': None
  }
  B['bill_id'] = raw['bill_id']
  B['openstates_id'] = raw['id']
  B['topic'] = "" #We need to pick this
  B['subtopics'] = [s.title() for s in raw['subjects']]
  if 'scraped_subjects' in raw:
    B['scraped_topics'] = [s.title() for s in raw['scraped_subjects']]
  B['state'] = raw['state']
  B['level_code'] = 1 #state
  B['human_summary'] = ""
  B['machine_summary'] = "" #get this lol
  B['title'] = raw['title']
  B['short_title'] = ""
  B['last_updated'] = raw['updated_at']

  if raw['versions']:
    B["full_text_url"] = raw['versions'][-1]['url'] #Get latest text
  else:
    B["full_text_url"] = ""

  #Generate sponsors
  B['cosponsors'] = []
  all_sponsors = [(s['leg_id'], s['type']) for s in raw['sponsors']]
  for sponsor in all_sponsors:
    if sponsor[1] == 'primary':
      B['sponsor'] = get_sponsor(sponsor[0])
    else:
      B['cosponsors'].append(get_sponsor(sponsor[0]))

  B["related_bills"] = [] #TODO
  B["history"] = {} #TODO

  B["introduction_date"] = raw['created_at']

  return B

def identify_url_format(url):
  url = url.lower()

  if not url:
    ret = 'nourl'
  else:
    if 'ftp' in url:
      ret = 'ftp'
    else: #probably http
      if 'pdf' in url:
        ret = 'pdf'
      else: #regular html file
        ret = 'html'

  return ret

def download_ftp(url):
  pass

def download_pdf(url):
  _uuid = str(uuid.uuid4())
  filename = 'pdfs/' + _uuid + '.pdf'

  response = requests.get(url)
  with open(filename, 'wb') as f:
    f.write(response.content)

  #Maybe somehow stream content
  with open(filename, 'rb') as f:
    pdf_reader = PyPDF2.PdfFileReader(f)

    #Really pages but whatever for now
    all_lines = [pdf_reader.getPage(i).extractText() for i in range(0, pdf_reader.numPages)]

    #cleanup section
    #Remove newlines and form feed characters
    all_lines = [line.rstrip().replace('\x0C', '') for line in all_lines]

    #Get rid of any page #s sitting around
    all_lines = [re.sub(r'Page \d*', r'', line) for line in all_lines]

    #Get rid of empty lines and page # lines
    all_lines = [line for line in all_lines if line and not line.isdigit()]

    #Remove random "
    all_lines = [line.replace('"', '') for line in all_lines]

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
  url = bill['full_text_url']

  url_format = identify_url_format(url)

  if url_format == 'ftp':
    #Handle ftp stuff (ar)
    return (state, 'ftp')
  elif url_format == 'html':
    txt = download_html(url)
    ret = 'htmlok' if len(txt) > 0 else 'htmlbad'
    #if len(txt) > 0:
      #print(txt)
      #import ipdb; ipdb.set_trace()
  elif url_format == 'pdf':
    txt = download_pdf(url)
    #print(txt)
    #import ipdb; ipdb.set_trace() 
    ret = 'pdf'
  elif url_format == 'nourl':
    ret = 'nourl'

  return (state, ret)


'''
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

'''
import time

#For one state XXX

#Get state bill ids 
start = time.time()
bill_ids = get_state_bill_ids('mi')
print(len(bill_ids), "bill ids", time.time() - start)
#TODO narrow down to only most recent updates here

start = time.time()
p = Pool(10)
bills = p.map(get_bill_details, bill_ids)
#Sync version
#bills = [get_bill_details(bill_id) for bill_id in bill_ids]
print("bill details", time.time() - start)
'''

