# Exploratory data-analysis of the V-Dem dataset

import pandas as pd

import geopandas as gpd
import matplotlib.pyplot as plt

# Load the dataset
df = pd.read_csv('V-Dem-CY-Core-v14.csv')

# Display the first 5 rows of the dataframe
print(df.head())

# Display the basic information about the dataframe
print(df.info())

# Display the summary statistics of the dataframe
print(df.describe())

# Display the number of unique values for each column
print(df.nunique())

# Draw a graph of 'v2x_polyarchy' progress over 'year' where 'country_name' is "Nicaragua"
import seaborn as sns
import matplotlib.pyplot as plt

# Filter the dataset for Nicaragua
nicaragua_df = df[df['country_name'] == 'Nicaragua']

# Plot 'v2x_polyarchy' progress over 'year'
sns.lineplot(data=nicaragua_df, x='year', y='v2x_polyarchy')
plt.title('Progress of v2x_polyarchy in Nicaragua over Years')
plt.xlabel('Year')
plt.ylabel('v2x_polyarchy')
plt.show()

# Filter the dataset for India
india_df = df[df['country_name'] == 'India']

# Plot progress over 'year' for multiple democracy indices
plt.figure(figsize=(10, 6))
sns.lineplot(data=india_df, x='year', y='v2x_polyarchy', label='Electoral')
sns.lineplot(data=india_df, x='year', y='v2x_libdem', label='Liberal')
sns.lineplot(data=india_df, x='year', y='v2x_partipdem', label='Participatory')
sns.lineplot(data=india_df, x='year', y='v2x_delibdem', label='Deliberative')
sns.lineplot(data=india_df, x='year', y='v2x_egaldem', label='Egalitarian')
plt.title('Progress of Democracy Indices in India over Years')
plt.xlabel('Year')
plt.ylabel('Index Score')
plt.legend()
plt.show()

# Calculate the average of the democracy indices for each year
average_indices_df = df.groupby('year')[['v2x_polyarchy', 'v2x_libdem', 'v2x_partipdem', 'v2x_delibdem', 'v2x_egaldem']].mean().reset_index()

# Plot progress over 'year' for the average of the five democracy indices
plt.figure(figsize=(10,6))
sns.lineplot(data=average_indices_df, x='year', y='v2x_polyarchy', label='Electoral')
sns.lineplot(data=average_indices_df, x='year', y='v2x_libdem', label='Liberal')
sns.lineplot(data=average_indices_df, x='year', y='v2x_partipdem', label='Participatory')
sns.lineplot(data=average_indices_df, x='year', y='v2x_delibdem', label='Deliberative')
sns.lineplot(data=average_indices_df, x='year', y='v2x_egaldem', label='Egalitarian')
plt.title('Average Progress of Democracy Indices over Years')
plt.xlabel('Year')
plt.ylabel('Average Index Score')
plt.legend()
plt.show()


# Load the world map
world = gpd.read_file(gpd.datasets.get_path('naturalearth_lowres'))

# Merge the world map with the 2015 data for 'v2x_libdem'
libdem_2015 = df[df['year'] == 2015][['country_name', 'v2x_libdem']]
world = world.merge(libdem_2015, how="left", left_on="name", right_on="country_name")

# Plotting the cloropleth map for 'v2x_libdem' in 2015
fig, ax = plt.subplots(1, 1, figsize=(10,6))
ax.axis('off')
world.boundary.plot(ax=ax)
world.plot(column='v2x_libdem', ax=ax, legend=False,
           legend_kwds={'label': "Liberal Democracy Index in 2015",
                        'orientation': "horizontal"})
plt.title('Global Liberal Democracy Index in 2015')
plt.show()
