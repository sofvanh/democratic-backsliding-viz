# Read the V-Dem-CY-Core-v14 dataset, get the relevant data, and save as json suitable for Nivo

# TODO Cross-check country names with those in the GeoJSON data and fix if necessary (at least USA, Czech Republic, UK)

import pandas as pd
import json
import numpy as np

df = pd.read_csv('V-Dem-CY-Core-v14.csv')
df = df[['country_name', 'year', 'v2x_polyarchy', 'v2x_libdem',
         'v2x_partipdem', 'v2x_delibdem', 'v2x_egaldem']]
df = df[df.groupby('country_name')['year'].transform(max) == 2023]


# Load the GeoJSON data to compare country names
with open('app/src/natural_earth.json', 'r') as file:
    geojson_data = json.load(file)

geojson_countries = {feature['properties']['NAME'] for feature in geojson_data['features']}
dataset_countries = set(df['country_name'].unique())
unmatched_countries = dataset_countries - geojson_countries
print("Countries in dataset not found in GeoJSON:", unmatched_countries)

# Find country names that are present in the GeoJSON but not in the dataset
missing_countries = geojson_countries - dataset_countries
print("Countries in GeoJSON not found in dataset:", missing_countries)


# Rename specific countries in the dataset to match the GeoJSON naming conventions
# TODO What to do with Palestine?
rename_map = {
    "Bosnia and Herzegovina": "Bosnia and Herz.",
    "Burma/Myanmar": "Myanmar",
    "Democratic Republic of the Congo": "Dem. Rep. Congo",
    "Republic of the Congo": "Congo",
    "Central African Republic": "Central African Rep.",
    "Dominican Republic": "Dominican Rep.",
    "Equatorial Guinea": "Eq. Guinea",
    "Eswatini": "Swaziland",
    "The Gambia": "Gambia",
    "Ivory Coast": "Côte d'Ivoire",
    "North Macedonia": "Macedonia",
    "South Sudan": "S. Sudan",
    "Solomon Islands": "Solomon Is.",
    "Türkiye": "Turkey"
}


df['country_name'] = df['country_name'].replace(rename_map)

# Re-check for unmatched countries after renaming
dataset_countries_updated = set(df['country_name'].unique())
unmatched_countries_updated = dataset_countries_updated - geojson_countries
print("Countries in dataset not found in GeoJSON after renaming:", unmatched_countries_updated)

# Generate a list of unmatched countries in the geojson countries after renaming
geojson_countries_updated = geojson_countries - dataset_countries_updated
print("Countries in GeoJSON not found in dataset after renaming:", geojson_countries_updated)




result = []
indices = ['v2x_polyarchy', 'v2x_libdem',
           'v2x_partipdem', 'v2x_delibdem', 'v2x_egaldem']
index_labels = {
    'v2x_polyarchy': 'Polyarchy',
    'v2x_libdem': 'Liberal Democracy',
    'v2x_partipdem': 'Participatory Democracy',
    'v2x_delibdem': 'Deliberative Democracy',
    'v2x_egaldem': 'Egalitarian Democracy'
}

grouped = df.groupby('country_name')

for country, group in grouped:
    for index in indices:
        series_data = {
            'id': f"{country}_{index}",
            'label': f"{country} - {index_labels[index]}",
            # Two of the indices are tracked starting from 1900
            'data': [{'x': row['year'], 'y': row[index]} for _, row in group.iterrows() if not np.isnan(row[index])]
        }
        result.append(series_data)

# Calculate world averages for each index and each year, rounded to 3 decimal places
world_averages = df.groupby('year')[indices].mean().reset_index()
for index in indices:
    series_data = {
        'id': f"World average_{index}",
        'label': f"World average - {index_labels[index]}",
        'data': [{'x': row['year'], 'y': round(row[index], 3)} for _, row in world_averages.iterrows() if not np.isnan(row[index])]
    }
    result.append(series_data)

with open('app/src/prod-dataset.json', 'w') as f:
    json.dump(result, f)
