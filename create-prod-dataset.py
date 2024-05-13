# Read the V-Dem-CY-Core-v14 dataset, get the relevant data, and save as json suitable for Nivo

import pandas as pd
import json
import numpy as np

df = pd.read_csv("V-Dem-CY-Core-v14.csv")
df = df[
    [
        "country_name",
        "country_text_id",
        "year",
        "v2x_polyarchy",
        "v2x_libdem",
        "v2x_partipdem",
        "v2x_delibdem",
        "v2x_egaldem",
    ]
]
df = df[df.groupby("country_name")["year"].transform(max) == 2023]


# Load the GeoJSON data to compare country names
with open("ne_110m_admin_0_countries.json", "r") as file:
    geojson_data = json.load(file)

geojson_countries = {
    feature["properties"]["NAME"] for feature in geojson_data["features"]
}
dataset_countries = set(df["country_name"].unique())
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
    "Türkiye": "Turkey",
}


df["country_name"] = df["country_name"].replace(rename_map)

# Re-check for unmatched countries after renaming
dataset_countries_updated = set(df["country_name"].unique())
unmatched_countries_updated = dataset_countries_updated - geojson_countries
print(
    "Countries in dataset not found in GeoJSON after renaming:",
    unmatched_countries_updated,
)

# Generate a list of unmatched countries in the geojson countries after renaming
geojson_countries_updated = geojson_countries - dataset_countries_updated
print(
    "Countries in GeoJSON not found in dataset after renaming:",
    geojson_countries_updated,
)

# Rename specific text ids in the dataset to match the GeoJSON ADM0_A3 codes
rename_text_id_map = {"SML": "SOL", "SSD": "SDS", "XKX": "KOS"}

df["country_text_id"] = df["country_text_id"].replace(rename_text_id_map)


result = []
indices = [
    "v2x_polyarchy",
    "v2x_libdem",
    "v2x_partipdem",
    "v2x_delibdem",
    "v2x_egaldem",
]
index_labels = {
    "v2x_polyarchy": "Electoral",
    "v2x_libdem": "Liberal",
    "v2x_partipdem": "Participatory",
    "v2x_delibdem": "Deliberative",
    "v2x_egaldem": "Egalitarian",
}

grouped = df.groupby("country_name")

for country, group in grouped:
    for index in indices:
        series_data = {
            "id": f"{country}_{index}",
            "ISO": group["country_text_id"].iloc[0],
            "label": f"{country} - {index_labels[index]}",
            # Two of the indices are tracked starting from 1900
            "data": [
                {"x": row["year"], "y": row[index]}
                for _, row in group.iterrows()
                if not np.isnan(row[index])
            ],
        }
        result.append(series_data)

# Calculate world averages for each index and each year, rounded to 3 decimal places
world_averages = df.groupby("year")[indices].mean().reset_index()
for index in indices:
    series_data = {
        "id": f"World average_{index}",
        "ISO": "WORLD",
        "label": f"World average - {index_labels[index]}",
        "data": [
            {"x": row["year"], "y": round(row[index], 3)}
            for _, row in world_averages.iterrows()
            if not np.isnan(row[index])
        ],
    }
    result.append(series_data)

# Load the GeoJSON data to check ISO codes
with open("app/src/geojson_features.json", "r") as file:
    geojson_data = json.load(file)

# Extract the ADM0_A3 codes and country names from GeoJSON
geojson_iso_to_country = {
    feature["properties"]["ADM0_A3"]: feature["properties"]["NAME"]
    for feature in geojson_data["features"]
}

# Check for mismatches between dataset ISO codes and GeoJSON ADM0_A3 codes
iso_mismatches = []
for series in result:
    iso_code = series["ISO"]
    country_name = series["label"].split(" - ")[0]
    if iso_code not in geojson_iso_to_country:
        iso_mismatches.append((iso_code, country_name, "ISO code not found in GeoJSON"))
    elif geojson_iso_to_country[iso_code] != country_name:
        iso_mismatches.append(
            (
                iso_code,
                country_name,
                f"Mismatch: GeoJSON country is {geojson_iso_to_country[iso_code]}",
            )
        )

# Print mismatches
if iso_mismatches:
    print("There are mismatches in ISO codes:")
    for mismatch in iso_mismatches:
        print(mismatch)
else:
    print("All ISO codes correctly map to the country names in the GeoJSON.")


with open("app/src/prod-dataset.json", "w") as f:
    json.dump(result, f)
