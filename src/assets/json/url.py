import json
import re

# Load JSON data from file
with open('cards.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Function to trim URL after .png
def trim_url(url):
    match = re.match(r"^(.*?\.png)", url)
    return match.group(1) if match else url

# Process each object in the array
for card in data:
    if 'untrained_url' in card:
        card['untrained_url'] = trim_url(card['untrained_url'])
    if 'trained_url' in card:
        card['trained_url'] = trim_url(card['trained_url'])

# Save the updated JSON back to a file
with open('cards_cleaned.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

print("URLs have been trimmed and saved to 'cards_cleaned.json'.")