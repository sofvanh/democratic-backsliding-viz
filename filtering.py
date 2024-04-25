import pandas as pd

df = pd.read_csv('V-Dem-CY-Core-v14.csv')

df = df[df.groupby('country_name')['year'].transform(max) == 2023]

# Initialize columns for each index to show qualification status
indices = ['v2x_polyarchy', 'v2x_libdem', 'v2x_partipdem', 'v2x_delibdem', 'v2x_egaldem']
for index in indices:
    df[f'{index}_show'] = False

# Group the dataframe by 'country_name' and count the non-NA/null occurrences for each index
for index in indices:
    country_index_counts = df.groupby('country_name')[index].count()

    # Loop through the counts and update corresponding show column where the condition is met
    for country, count in country_index_counts.items():
        if count >= 10:
            df.loc[df['country_name'] == country, f'{index}_show'] = True

# Print the number of non-qualifying countries for each index
for index in indices:
    qualifying_countries = df[df[f'{index}_show'] == True]['country_name'].nunique()
    non_qualifying_countries = df[df[f'{index}_show'] == False]['country_name'].nunique()
    print(f"Number of countries that don't qualify for {index}: {non_qualifying_countries}")

non_qualifying_countries_set = set()
for index in indices:
    non_qualifying_countries = df[df[f'{index}_show'] == False]['country_name'].unique()
    non_qualifying_countries_set.update(non_qualifying_countries)

print("Countries that don't qualify for at least one index:")
for country in non_qualifying_countries_set:
    print(country)


