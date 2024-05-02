# Read the V-Dem-CY-Core-v14 dataset, get the relevant data, and save as json suitable for Nivo

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
grouped = df.groupby('country_name')

for country, group in grouped:
    for index in indices:
        series_data = {
            'id': f"{country}_{index}",
            'data': [{'x': row['year'], 'y': row[index]} for _, row in group.iterrows() if not np.isnan(row[index])] # Two of the indices are tracked starting from 1900
        }
        result.append(series_data)

with open('app/src/prod-dataset.json', 'w') as f:
    json.dump(result, f)
