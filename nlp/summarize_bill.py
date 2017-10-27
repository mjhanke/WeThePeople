"""Module to intelligently summarize bills and other legal documents"""
from pyteaser import Summarize
from newspaper import Article
import requests
import json
import re
import nltk
from pprint import pprint

def summarize_bill(title, text):
    """
    Clean up bill text and summarizes using TextRank
    Uses Python 2.7, as TextTeaser does not support Python 3
    """
    text = remove_page_artifacts(title, text)
    text = remove_special_characters(text)
    text = remove_uppercase(text)
    text = remove_legal_phrases(text)
    if ' To ' in text:
        text = text.split(' To ', 1)[1]
    text = replace_formal_words(text)
    text = remove_filler_phrases(text)
    text = fix_capitalization(text)

    # Ensure a just single space between each word
    text = re.sub(r'\s+', ' ', text)

    text = fix_punctuation_errors(text)
    # print '\n\n'.join(nltk.sent_tokenize(text))
    # Get top 5 sentences from TextRank summarization algorithm
    summary = Summarize(title, text)

    # Remove leading whitespace
    summary = [sentence.lstrip() for sentence in summary]
    return summary

def simplify_human_summary(text):
    """Clean up human summary"""
    text = remove_special_characters(text)
    text = replace_formal_words(text)
    text = re.sub(r'\s+', ' ', text)
    text = fix_punctuation_errors(text)
    return text

def remove_page_artifacts(title, text):
    """Removes headers and titles from page, if scrapped from congress.gov"""
    if title in text:
        index = text.find(title)
        return text[index:]
    return text

def remove_special_characters(text):
    """Remove special characters"""
    # Remove non-ASCII characters
    original_text = ''.join([i if ord(i) < 128 else ' ' for i in text])

    # Remove all parentheses, brackets, and everything inbetween them
    text = re.sub("[\(\[].*?[\)\]]", ' ', original_text)

    # Replace filler phrases and special characters
    text = text.replace('--', ' ').replace('``', ' ')

    # Break up run-on sentences
    # text = text.replace(';', '.')
    return text

def remove_uppercase(text):
    """Lowercase titles to make them more readable: THE TITLE => The Title"""
    words = nltk.word_tokenize(text)
    new_words = []
    for word in words:
        if word.isupper():
            new_words.append(word.title())
        else:
            new_words.append(word)
    return ' '.join(new_words)

def remove_filler_phrases(text):
    """Remove the following substrings to improve readability"""
    filler_phrases = [
        'Whereas, ', 'Congress makes the following findings: ',
        'congress finds the following:',
        'Congress finds the following: ', 'Congress finds as follows: ',
        'AN ACT ', 'An Act , ''The bill shall be considered as read.', 'In general.',
        'In General.', '>>', '<<', '< < Note: ', 'Findings.', 'To ', 'And ',
        'Whereas ', ', and for other purposes', ' A BILL',
        ' for certain purposes', ' thereon', ' or other disposition',
        ' by adding at the end the following new clause',
        'It is the sense of Congress that ', 'the State of ', '_'
        'Supporting the understanding that ', ' fiscal year', 'hereby '
    ]

    for filler in filler_phrases:
        text = text.replace(filler, '')
    return text

def remove_legal_phrases(text):
    """Remove legal definitions and some technical language"""
    sentences = nltk.sent_tokenize(text)
    new_sentences = []
    bad_substrs = ['may be cited as', 'amended ',
    ' section', 'SHORT TITLE.', 'For purposes of this ',
    ' definitions', 'the term ', 'In this title:', ' motion to ',
    'regard to subparagraph', 'public law', 'note: ', '< <', '<<', '> >', '>>',
    ' reading of the ', 'shall be considered as read', ' striking',
    'version of the bill', 'Be it enacted by', 'For purposes of sections',
    'paragraph', 'subsection ', 'Technical corrections',
    'in clause', 'subtitle', 'amendment', 'IN THE SENATE', ' of title ',
    'TITLE', 'house of representatives', 'All points of order ', 'Note: ',
    'legislative day', ' inserting', ' to clause', 'pursuant to',
    'the Clerk shall', 'was referred to the', 'he period beginning '
    ' considered and passed', 'legislative History', 'read twice and referred',
    'n this Act', ' debate will not exceed', 'he concurrent resolution',
    ', Clerk'
    ]
    for sentence in sentences:
        if all(substr.lower() not in sentence.lower() for substr in bad_substrs)\
           and len(nltk.word_tokenize(sentence)) > 5:
            new_sentences.append(sentence)
    new_text = ' '.join(new_sentences)
    return new_text


def fix_punctuation_errors(text):
    """Fix punctuation problems caused by removing substrings"""
    punctuation_errors = [('\'\'', ''), ('. .', '. '), (',.', '.'),
                           (' ,', ','), (' .', '.'), (' :', ':'), ('..', '.'),
                           (',.', '.'), ('$ ', '$'), (' ).', '.'),
                           (' \'', '\''), ('.,', '.'), (' s ', '\'s '), (',,', ','),
                           (') ', ''), (' ;', ';')
                         ]
    for k, v in punctuation_errors:
        text = text.replace(k, v)
    return text

def fix_capitalization(text):
    """Remove all uppercase titles and capitalizes first word of sentence"""
    sentences = nltk.sent_tokenize(text)
    new_sentences = []
    for sentence in sentences:
        words = nltk.word_tokenize(sentence)
        if len(words) > 0:
            words[0] = words[0].capitalize()
            new_sentence = ' '.join(words)
            new_sentences.append(new_sentence)

    text = ' '.join(new_sentences)
    return text

def replace_formal_words(text):
    """Simplify language with synonym replacement, e.g., 'shall' => 'will'"""
    replacements = [('shall ', 'will '), (' postsecondary ', ' college '),
                    ('appropriated', 'set aside'),
                    ('Notwithstanding', 'In spite of'),
                    ('promulgate', 'make known'),
                    ('terminated', 'cancelled'),
                    ('degree-granting institution', 'college'),
                    ('initiated', 'started'),
                    ('amend ', 'change '), ('prohibit', 'prevent'),
                    ('receives', 'gets'), ('any individual', 'anyone'),
                    ('unlawful', 'against the law'), ('establish ', 'set up '),
                    (' in order to ', ' to '), ('assist ', 'help '),
                    ('comprehensive', 'wide-ranging'), ('assistance', 'help'),
                    ('modify', 'change'), ('allow for ', 'allow '),
                    ('imperative', 'important'), ('inflict', 'cause'),
                    ('efficacy', 'effectiveness'), ('asserted', 'stated'),
                    ('determining', 'figuring out'), ('exceeds', 'goes beyond'),
                    ('aggregation', 'collection'), ('amending', 'changing'),
                    ('may ', 'can '), ('obtain', 'get'), ('acquire ', 'get'),
                    (' for the purpose of ', ' for '),
                    ('expenditures', 'spending'), ('elicited', 'caused'),
                    ('at the conclusion', 'at the end'),
                    ('jurisdiction', 'legal authority'),
                    ('subpoena', 'court order'),
                    ('postponement', 'delay'), ('concerning', 'on'),
                    ('alien', 'noncitizen'), (' ceased ', ' stopped '),
                    ('cease to be', 'stop being'), (' solely', ' just'),
                    ('additional', 'more'), ('establishing', 'setting up'),
                    ('regarding', 'on'), ('remediation', 'remedying'),
                    ('locate ', 'find '), ('appropriations', 'funding'),
                    ('disbursements', 'spending'), ('reduce', 'lower'),
                    ('derived from', 'coming from'), ('automobile', 'car'),
                    ('financial support', 'money')
                    ]
    for k, v in replacements:
        text = text.replace(k, v)
    return text

def test_state_bills():
    """Test efficacy of summarizer on wide range of state bills"""
    headers = {
        'X-API-KEY': 'baeeda4b-601b-4e78-a679-07e4527e4fcc'
    }
    main_endpoint = 'https://openstates.org/api/v1/bills/?state=mi&chamber=upper'

    bill_detail_endpoint = 'https://openstates.org/api/v1/bills/mi/'

    request = requests.get(main_endpoint, headers=headers)
    bills = json.loads(request.text)
    for bill in bills:
        bill_id = bill['bill_id'].replace(' ', '%20')
        session = bill['session']
        bill_url = bill_detail_endpoint + session + '/' + bill_id + '/'
        print bill_url
        r = requests.get(bill_url, headers=headers)
        #full_bill = json.loads(request.text)
        #pprint(full_bill)

        if 'documents' in full_bill and 'url' in full_bill['documents'][0]:
            full_text_url = full_bill['documents'][0]['url']
            print full_text_url
            # summarize_bill_from_url('bill', full_text_url)
        break
        print '*****************************************************'

def test_national_bills():
    """Test efficacy of summarizer on wide range of state bills"""
    endpoint = 'https://api.propublica.org/congress/v1/115/house/bills/introduced.json?offset=300'
    headers = {
        'X-API-Key': '76l8Lwp3w45mu6BeOShc17r3H4I264iK2mqMfX1k'
    }
    request = requests.get(endpoint, headers=headers)
    bills = json.loads(request.text)['results'][0]['bills']
    for bill in bills:
        url = bill['congressdotgov_url'] + '/text'
        title = bill['title']
        print summarize_bill_from_url(title, url)
        print '*****************************************************'

def summarize_bill_from_url(title, url):
    """Scrapes bill from given url instead of directly from text"""
    article = Article(url)
    article.download()
    article.parse()
    #print article.text
    assert 'The page you requested is unavailable' not in article.text
    summary = summarize_bill(title, article.text)
    summary = [sentence.lstrip() for sentence in summary]
    return '\n\n'.join(summary)

#print summarize_bill_from_url('guns', 'https://www.congress.gov/bill/115th-congress/house-bill/3999/text?format=txt')
