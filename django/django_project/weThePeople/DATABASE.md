#Overview of Database#

Database Type: MongoDB
Database Version:
Access Database Shell:
```
cd /usr
./bin/mongo
```

While in shell:
`show databases` to see databases available
`use <database>` to switch to specified database
`exit` to quit shell

##Databases##

Database Name: test
 * Collections: people
 * Notes: test db for testing 

Database Name: wtp
 * Collections: bills, users
 * Notes: main db that contains legislative bills and representatives 

##Using in Python##
The connection to the MongoDB is established in db\_connect.py to use the db put the following line in the top of your program:

`from db_connect.py import test_db, wtp_db`

to access a collection in a database use:

`collection = <db>.<collection_name>`
