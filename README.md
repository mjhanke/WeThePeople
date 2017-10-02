# WeThePeople

## Endpoints
```python
"""
create-user/
Args:
    state(string): the state that the user inputs as location
    topics(array of strings): topics that the user inputs they’re interested in
Returns:
    token(string): token associated with a user


bills/
Args:
    token(string): token associated with a user
    state(bool): whether or not to return state level bills
    national(bool): whether or not to return national level bills
Returns:
    state(list): list of state level bill objects
    national(list): list of national level bill objects
"""
```

## Bill Format
```python
BILL-OBJECTS:
{
    "subjects": [string, string],
    "subjects_top_term": string,
    "human_summary": string,
    "machine_summary": string,
    "title": string,
    "last_updated": string (timestamp)
    "full_text_url": string,
    "committee": string,
    "cosponsors": [
        {People Object}
    ],
    "history": {
        "active": bool,
        "awaiting_signature": bool,
        "enacted": bool,
        "vetoed": bool,
    }
    "introduction_date": string,
    "sponsor": {People Object}
}

```
