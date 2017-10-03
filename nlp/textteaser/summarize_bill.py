from textteaser import TextTeaser
from newspaper import Article
import requests
import json
import re
import nltk

def summarize_bill(title, text):
    """
    Cleans up bill text and summarizes using TextRank
    Uses Python 2.7, as TextTeaser does not support Python 3
    """
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

    # Get top 5 sentences from TextRank summarization algorithm
    summary = TextTeaser().summarize(title, text)

    # Remove leading whitespace
    summary = [sentence.lstrip() for sentence in summary]
    return summary

def remove_special_characters(text):
    """Removes special characters"""
    # Remove non-ASCII characters
    original_text = ''.join([i if ord(i) < 128 else ' ' for i in text])

    # Remove all parentheses, brackets, and everything inbetween them
    text = re.sub("[\(\[].*?[\)\]]", ' ', original_text)

    # Replace filler phrases and special characters
    text = text.replace('--', ' ').replace('``', ' ')

    # Break up run-on sentences
    text = text.replace(';', '.')
    return text

def remove_uppercase(text):
    """Lowercases titles to make them more readable: THE TITLE => The Title"""
    words = nltk.word_tokenize(text)
    new_words = []
    for word in words:
        if word.isupper():
            new_words.append(word.title())
        else:
            new_words.append(word)
    return ' '.join(new_words)

def remove_filler_phrases(text):
    """Removes the following substrings to improve readability"""
    filler_phrases = [
        'Congress makes the following findings: ', 'congress finds the following:',
        'Congress finds the following: ', 'Congress finds as follows: ',
        'AN ACT ', 'An Act , ''The bill shall be considered as read.', 'In general.',
        'In General.', '>>', '<<', '< < Note: ', 'Findings.', 'To ', 'And ',
        'Whereas'
    ]
    text = re.sub(r'|'.join(map(re.escape, filler_phrases)), '', text, re.IGNORECASE)
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
    'paragraph', 'subsection ', 'subparagraph', 'Technical corrections',
    'in clause', 'subtitle', 'amendment', 'IN THE SENATE', ' of title ',
    'TITLE', 'house of representatives', 'All points of order ', 'Note: ',
    'legislative day', ' inserting', ' to clause', 'pursuant to',
    'the Clerk shall',
    ' considered and passed', 'legislative History', 'read twice and referred']
    for sentence in sentences:
        if all(substr.lower() not in sentence.lower() for substr in bad_substrs)\
           and len(nltk.word_tokenize(sentence)) > 5:
            new_sentences.append(sentence)
    new_text = ' '.join(new_sentences)
    return new_text


def fix_punctuation_errors(text):
    """Fixes punctuation problems caused by removing substrings"""
    punctuation_errors = [ ('\'\'', ''), ('. .', '. '), (',.', '.'),
                           (' ,', ','), (' .', '.'), (' :', ':'), ('..', '.'),
                           (',.', '.'), ('$ ', '$'), (' ).', '.'), (' \'', '\'')
                           ]
    for k, v in punctuation_errors:
        text = text.replace(k, v)
    return text

def fix_capitalization(text):
    """Removes all uppercase titles and capitalizes first word of sentence"""
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
    """Simplifies language with synonym replacement, e.g., 'shall' => 'will'"""
    replacements = [('shall ', 'will '), (' postsecondary ', ' college '),
        ('appropriated', 'set aside'), ('Notwithstanding', 'In spite of'),
        ('promulgate', 'make known'), ('terminated', 'cancelled'),
        ('degree-granting institution', 'college'), ('initiated', 'started'),
        ('amend ', 'change '), ('prohibit ', 'prevent ')
    ]
    for k, v in replacements:
        text = text.replace(k, v)
    return text

def fetch_state_bills():
    headers = {
        'X-API-KEY': 'baeeda4b-601b-4e78-a679-07e4527e4fcc'
    }
    endpoint = 'https://openstates.org/api/v1/bills/?state=mi&chamber=upper&session=2017-2018'

    r = requests.get(endpoint, headers=headers)
    bills = json.loads(r.text)
    for bill in bills:
        url = bill['congressdotgov_url'] + '/text'
        article = Article(url)
        article.download()
        article.parse()
        summary = summarize_bill('', article.text)
        summary = [sentence.lstrip() for sentence in summary]
        print '\n\n'.join(summary)
        print '*****************************************************'

def fetch_national_bills():
    """Use Propublica API to get congressional bills"""
    endpoint = 'https://api.propublica.org/congress/v1/115/senate/bills/introduced.json?offset=120'
    headers = {
        'X-API-Key': '76l8Lwp3w45mu6BeOShc17r3H4I264iK2mqMfX1k'
    }
    r = requests.get(endpoint, headers=headers)
    bills = json.loads(r.text)['results'][0]['bills']
    for bill in bills:
        url = bill['congressdotgov_url'] + '/text'
        article = Article(url)
        article.download()
        article.parse()
        summary = summarize_bill(bill['title'], article.text)

        print '\n\n'.join(summary)
        print '*****************************************************'

fetch_national_bills()
# url = 'https://www.congress.gov/bill/114th-congress/house-bill/6536/text?r=1'
