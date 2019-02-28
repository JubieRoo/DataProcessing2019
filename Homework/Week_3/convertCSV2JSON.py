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
FILENAME = "KNMI_klein.txt"
COLUMN_NAMES = ["STN", "date", "TG"]


def open_file(filename):
	"""
	Returns a .txt or .csv file as a Pandas Dataframe
	"""

	df = pd.read_csv(filename, comment='#', header=None, names=COLUMN_NAMES)

	# pivots the dataframe to change the columns
	# df_pivot = df.pivot(columns="date", values="TG")
	return(df)


def create_json(df):
	"""
	Returns a json file created from a pandas Dataframe
	"""
	with open("data.json", "w") as data_json:
		data_json.write(df.to_json(orient='index'))


df = open_file(FILENAME)
json = create_json(df)
