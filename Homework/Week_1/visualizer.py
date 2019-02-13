#!/usr/bin/env python
# Name:
# Student number:
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
import numpy as np

# Global constants for the input file, first and last year and the range between them
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018
YEAR_RANGE = range(START_YEAR, END_YEAR)

# Global dictionary for the data
data_dict = {key: [] for key in YEAR_RANGE}

# Opens csv file to read data
with open(INPUT_CSV, newline='') as csvfile:
	reader = csv.DictReader(csvfile)
	# Creates a dictionary where the year is a key and the ratings are the value
	for row in reader:
		data_dict[int(row['Year'])].append(float(row['Rating']))

if __name__ == "__main__":
	# Create a green line chart with the average rating(y) per year(x) between 2008-2018
	plt.plot(YEAR_RANGE, [np.mean(data_dict[year]) for year in YEAR_RANGE], 'g', linewidth=1)
	plt.xlabel('Year')
	plt.ylabel('Average rating')
	plt.title('Average movie rating 2008-2018')
	plt.show()