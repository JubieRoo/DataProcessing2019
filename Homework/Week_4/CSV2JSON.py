#!/usr/bin/env python
# Name: Ruby Bron
# Student number: 12474223
""" 
Converts a csv data file to a json file

I would like to use the one time only wild card for this exercise
"""

import json
import pandas as pd

# csv input
FILENAME = "Bodem_Fauna_Duinen.csv"


def open_file(filename):
	"""
	Returns a .txt or .csv file as a Pandas Dataframe
	"""

	df = pd.read_csv(filename)
	df_processed = process_dataframe(df)
	return(df_processed)


def process_dataframe(df):
	"""
	Processes the data if needed, otherwise returns the input df
	"""

	# slices the data into parts that will be used for a bar chart
	df_sliced = df[['individualCount', 'locality', 'scientificName', 'taxonRank']] 
	# df_sliced = df_sliced.loc[df_sliced['taxonRank'] == 'genus']
	# df_sliced = df_sliced[['individualCount', 'locality', 'scientificName']] 

	# creates the mean values needed for the bar chart
	df_grouped = df_sliced.groupby('taxonRank').mean()

	return(df_grouped)


def create_json(df):
	"""
	Returns a json file created from a pandas Dataframe
	"""
	with open("data.json", "w") as data_json:
		data_json.write(df.to_json(orient='records'))


df = open_file(FILENAME)
json = create_json(df)
