
from newspaper import Article
import re
from split_into_sentences import split_into_sentences

def summarize_bill(title, text):
    """
    Cleans up bill text and summarizes using TextRank
    Uses Python 2.7, as PyTeaser does not support Python 3
    """
    # Remove non-ASCII characters
    original_text = ''.join([i if ord(i) < 128 else '' for i in original_text])

    # Remove all parentheses, brackets, and everything inbetween them
    text = re.sub("[\(\[].*?[\)\]]", '', original_text)

    # Replace filler phrases and special characters
    text = text.replace('In general.', '')\
               .replace('In General.', '')\
               .replace('--', ' ')\
               .replace('``', '')

    # Remove legal definitions and some technical language
    sentences = split_into_sentences(text)
    new_sentences = []
    bad_substrs = ['may be cited as', 'is amended by inserting', \
    'In this section', 'SHORT TITLE.', 'For purposes of this ', \
    'Other definitions', 'the term ', 'The term' ' means']
    for sentence in sentences:
        if all(substr not in sentence for substr in bad_substrs):
            new_sentences.append(sentence)

    # Ensure a just single space between each word
    text = ' '.join(new_sentences)

    # Fix any punctuation errors
    text.replace('\'\'', '').replace('. .', '. ')

    # Get top 5 sentences from TextRank summarization algorithm
    summary = Summarize(title, text)
    print '\n\n'.join(summary)

'''
file = open('document.txt')
original_text = file.read()
'''

url = 'https://www.congress.gov/bill/115th-congress/house-bill/2810/text'
article = Article(url)
article.download()
article.parse()
print summarize_bill('', article.text)

