# This script fetches all bill metadata. See github.com/unitedstates/congress

# Enter the congress bill scraper directory
cd congress/

# Fetch XML data from Government Publishing Office
./run fdsys --collections=BILLSTATUS --congress=115

# Run the bills task to process any new and changed files
./run bills

# Download all bill text from 115th (current) Congress
./run fdsys --collections=BILLS --congress=115 --store=text --bulkdata=False

