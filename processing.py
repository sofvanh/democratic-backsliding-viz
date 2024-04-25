import pandas as pd
import matplotlib.pyplot as plt


df = pd.read_csv('V-Dem-CY-Core-v14.csv')

# 1. Check for missing values.
print("Number of rows:", len(df))
print("Null values in v2x_polyarchy:", df['v2x_polyarchy'].isnull().sum())
print("Null values in v2x_libdem:", df['v2x_libdem'].isnull().sum())
print("Null values in v2x_partipdem:", df['v2x_partipdem'].isnull().sum())
print("Null values in v2x_delibdem:", df['v2x_delibdem'].isnull().sum())
print("Null values in v2x_egaldem:", df['v2x_egaldem'].isnull().sum())

# 2. Check how well each country is represented (how many rows each country has).
country_counts_sorted_by_count = df['country_name'].value_counts().sort_values(ascending=False)
print(country_counts_sorted_by_count)
plt.figure(figsize=(10, 8))
country_counts_sorted_by_count.plot(kind='bar')
plt.title("Number of rows per country (sorted by count)")
plt.xlabel("Country Name")
plt.ylabel("Number of Rows")
plt.xticks(rotation=90)
plt.show()

# 3. Check the distribution of years for countries, see if a country's data is unbalanced by year.
# Calculate the average of the years for each country and create a graph
average_years_per_country = df.groupby('country_name')['year'].mean().sort_values(ascending=False)
plt.figure(figsize=(10, 8))
average_years_per_country.plot(kind='bar')
plt.title("Average Year per Country")
plt.xlabel("Country Name")
plt.ylabel("Average Year")
plt.ylim(1750, 2020)  # Set the y-axis to be from 1750 to 2020
plt.xticks(rotation=90)
plt.show()

# 4. Check for consistency in the 'country_name' column.
print("Unique country names:", df['country_name'].unique())

# 5. Check for duplicate values.
print("Number of duplicate rows:", df.duplicated().sum())

