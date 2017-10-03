"""Shortens topic, for display purposes"""


def abbreviate_topic(topic):
    """
    Introduces abbreviations, e.g., Government -> Gov't
    """
    abbreviations = {
        'International': 'Int\'l',
        'Government': 'Gov\'t',
    }
    for full, abbr in abbreviations.items():
        topic = topic.replace(full, abbr)
    return topic


def shorten_topic(topic):
    """
    Shortens a bill topic: e.g.,
        Food supply, safety, and labeling -> Food supply
        Hybrid, electric, and advanced vehicles -> advanced vehicles
    """
    topic = abbreviate_topic(topic)

    if ' and ' in topic and ', ' in topic:
        if topic.find(' and ') < topic.find(', '):
            return topic.split(' and ')[0].title().strip()

    if ', ' in topic:
        # Separate into subtopics and remove 'and'
        subtopics = [subtopic.replace(' and ', '')
                     for subtopic in topic.split(',')]
    else:
        subtopics = topic.split(' and ')
    return max(subtopics, key=len).title().strip()


"""
# This script generates the topic hierarchy. This hierarchy is now maintained
# manually, so I can adjust the displayed names as necessary

with open('topics.json') as data_file:
    TOPICS_DICT = json.load(data_file)

    new_structure = []
    subtopics_full = []
    subtopics_short = []
    for key, value in TOPICS_DICT.items():
        indices = key.replace('[', '').split(']')[:-1]
        if len(indices) == 2:
            # legislative subject
            subtopics_short.append(shorten_topic(value))
            subtopics_full.append(value)
        else:
            # primary subject
            topic_obj = {"topic_display_name": shorten_topic(value),
                         "topic_full_name": value,
                         "should_show_to_users": bool('true'),
                         "image_name": shorten_topic(value).replace(' ', '-').lower(),
                         "subtopic_display_names": subtopics_short,
                         "subtopic_full_names": subtopics_full}
            new_structure.append(topic_obj)
            subtopics_full = []
            subtopics_short = []

    with open('topic_hierarchy_short.json', 'w') as outfile:
        json.dump(new_structure, outfile, indent=4)
"""
