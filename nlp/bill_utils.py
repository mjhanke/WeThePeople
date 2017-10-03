"""Methods for finding bill metadata"""
import requests

def chance_of_being_enacted(govtrack_url):
    """
    Scrapes SkoposLabs.com bill prognosis from GovTrack
    """
    govtrack_page = requests.get(govtrack_url).text
    index = govtrack_page.find('% chance')
    if index == -1:
        return -1
    chance = govtrack_page[index - 2: index].strip()
    return chance

