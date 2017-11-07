import os

check = str(raw_input("You are about to delete all the data.xml files in the directory congress/data/155/bills. Are you sure? (yes/no)"))

if check == "yes":
    PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), 'congress/data/115/bills'))
    for path, dirs, files in os.walk(PATH):
        fullpath = os.path.join(path, 'data.xml')
        if os.path.isfile(fullpath):
		print("Deleting %s" % fullpath)
		os.remove(fullpath)
