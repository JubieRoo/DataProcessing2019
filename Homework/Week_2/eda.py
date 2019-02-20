#!/usr/bin/env python
# Name: Ruby Bron
# Student number: 12474223
"""
This script will explore and analyze the data and outputs it as a .json file
The focus will lie on the following variables:
	Country, Region, Pop.Density (per sq. mi.), infant mortality (per 1000 births) and GDP
"""

import csv
import numpy as np
import pandas as pd

# Global constants
INPUT_CSV = pd.read_csv("input.csv")

# create dataframe
dataframe = pd.DataFrame(data=INPUT_CSV)

# creates a dataframe with only needed variables
df_compact = dataframe.loc[:,['Country', 'Region', 
							  'Pop. Density (per sq. mi.)',
							  'Infant mortality (per 1000 births)',
							  'GDP ($ per capita) dollars']]

# removal of Western Sahara as an outlier with two missing values
# df_compact = df_compact.drop([223])

# treated unknown values as missing values
df_compact = df_compact.replace('unknown', np.nan)

# removing text from data
df_compact = df_compact.replace(' dollars$', '', regex=True).astype({ 'GDP ($ per capita) dollars': float})

# Hier komt: Central Tendency(mean, median mode) en 5 nummber summary ()

if __name__ == "__main__":
	print(df_compact)