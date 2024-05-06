# Read the V-Dem-CY-Core-v14 dataset, get the relevant data, and save as json suitable for Nivo

# TODO Cross-check country names with those in the GeoJSON data and fix if necessary (at least USA, Czech Republic, UK)

import pandas as pd
import json
import numpy as np

df = pd.read_csv('V-Dem-CY-Core-v14.csv')
df = df[['country_name', 'year', 'v2x_polyarchy', 'v2x_libdem',
         'v2x_partipdem', 'v2x_delibdem', 'v2x_egaldem']]
df = df[df.groupby('country_name')['year'].transform(max) == 2023]

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

# Calculate world averages for each index and each year
world_averages = df.groupby('year')[indices].mean().reset_index()
for index in indices:
    series_data = {
        'id': f"World average_{index}",
        'label': f"World average - {index_labels[index]}",
        'data': [{'x': row['year'], 'y': row[index]} for _, row in world_averages.iterrows() if not np.isnan(row[index])]
    }
    result.append(series_data)

with open('app/src/prod-dataset.json', 'w') as f:
    json.dump(result, f)
