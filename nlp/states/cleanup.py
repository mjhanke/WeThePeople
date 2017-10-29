import sys
import re

with open(sys.argv[1], 'r') as f:
  all_lines = f.readlines()
  #TODO sometimes this is split up by lines, sometimes by pages since no newlines in pdf

#Remove newlines and form feed characters
all_lines = [line.rstrip().replace('\x0C', '') for line in all_lines]

#Get rid of any page #s sitting around
all_lines = [re.sub(r'Page \d*', r'', line) for line in all_lines]

#Get rid of empty lines and page # lines
all_lines = [line for line in all_lines if line and not line.isdigit()]

#Remove random "
all_lines = [line.replace('"', '') for line in all_lines]

#Deal with crossing stuff out...
  
