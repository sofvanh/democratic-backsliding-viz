import json

# Load the GEOJson file
with open('ne_110m_admin_0_countries.json', 'r') as file:
    geojson_data = json.load(file)

# Modify the 'features' list
for feature in geojson_data['features']:
    # Create a new field 'id' and populate it from 'properties.SOV_A3'
    feature['id'] = feature['properties']['ADM0_A3']

# Save the modified file
with open('app/src/geojson_features.json', 'w') as outfile:
    json.dump(geojson_data, outfile, indent=4)
