#!/usr/bin/env python
# Name: Ruby Bron
# Student number: 12474223
"""
This script explores and analyzes the data and outputs it as a .json file
Focus on following variables:
Country, Region, Pop.Density (per sq. mi.), infant mortality (per 1000 births) and GDP
"""

import csv
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# Global constants
INPUT_CSV = pd.read_csv("input.csv")
country = 'Country'
region = 'Region'							  
infant_mortality = 'Infant mortality (per 1000 births)'
pop_density = 'Pop. Density (per sq. mi.)'
GDP = 'GDP ($ per capita) dollars'

# create dataframe
dataframe = pd.DataFrame(data=INPUT_CSV)
dataframe.index = dataframe[country]

# creates specific dataframe for the focussed variables
df_compact = dataframe.loc[:,[region, pop_density, infant_mortality, GDP]]

# treated unknown values as missing values
df_compact = df_compact.replace('unknown', np.nan)

# removing text from data
df_compact = df_compact.replace(' dollars', '', regex=True)
df_compact = df_compact.replace(',', '.', regex=True)
df_compact = df_compact.replace('\s+', ' ', regex=True)

# turning columns into datatype float64
df_compact = df_compact.astype({GDP: float})
df_compact = df_compact.astype({pop_density: float})
df_compact = df_compact.astype({infant_mortality: float})

# removal of outliers after datatype changes
df_compact = df_compact.drop(["Western Sahara "])
df_compact = df_compact.replace({GDP: 400000}, np.nan)
df_compact[pop_density] = df_compact[pop_density].apply(lambda x: np.nan if (x > 16000 or x == 0) else x)


def statistics(df):
	"""
	prints cescriptive statistics including the Central Tendency and 5 number summary
	"""

	# Prints the Central Tendency(mean, median and mode)
	mode = df.mode(numeric_only=True)
	mean = df.mean()
	median = df.median()
	print(f"mean: \n{mean}\nmedian: \n{median}\nmode: \n{mode}")

	# Standard descriptive statistics including the 5 number summary(std, min, 25%, 50%, 75% and max)
	descriptive_statistics = df.describe()
	print(descriptive_statistics)
	

def visualiser(df):
	"""
	Creates a histogram, boxplot and scatterplot using matplotlib
	"""

	# creates a histogram
	histogram = df.hist(column=GDP)
	plt.xlabel('gross domestic product($)')
	plt.ylabel('number of countries')
	plt.show()

	# creates a boxplot
	boxplot = df.boxplot(column=infant_mortality)
	plt.show()	

	# creates a scatterplot
	scatterplot = df.plot.scatter(GDP, infant_mortality)
	plt.title('GDP vs infant_mortality')
	plt.show()


def create_json(df):
	"""
	Creates a json file with a pandas dataframe as input
	"""

	with open("data.json", "w") as data_json:
		data_json.write(df.to_json(orient='index'))


statistics(df_compact)
visualiser(df_compact)
create_json(df_compact)
