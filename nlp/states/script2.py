import sys
sys.path.append("..")
import summarize_bill
import nltk
#nltk.download('punkt')

for i in range(10):
  with open('test/' + str(i) + '.txt', 'r') as f:
    print str(i)
    text = ''.join(f.readlines())
    sum_text = summarize_bill.summarize_bill('STATE OF MICHIGAN', text)
    print ' '.join(sum_text)
