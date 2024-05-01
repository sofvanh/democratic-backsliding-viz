# Read the V-Dem-CY-Core-v14 dataset, get the relevant data, and save as json

import pandas as pd

df = pd.read_csv('V-Dem-CY-Core-v14.csv')
df = df[['country_name', 'year', 'v2x_polyarchy', 'v2x_libdem', 'v2x_partipdem', 'v2x_delibdem', 'v2x_egaldem']]
df.to_json('prod-dataset.json', orient='records')

