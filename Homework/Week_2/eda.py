#!/usr/bin/env python
# Name: Ruby Bron
# Student number: 12474223
"""
This script will explore and analyze the data and outputs it as a .json file
The focus will lie on the following variables:
	Country, Region, Pop.Density (per sq. mi.), infant mortality (per 1000 births) and GDP
"""

import csv
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

# Global constants
INPUT_CSV = pd.read_csv("input.csv")


dataframe = pd.DataFrame(data=INPUT_CSV)
df_compact = dataframe.loc[:,['Country', 'Region', 'Pop. Density (per sq. mi.)', 'Infant mortality (per 1000 births)', 'GDP ($ per capita) dollars']]
df2 = df_compact.replace('unknown', np.nan)
# df_grouped = dataframe.groupby('Region').sum()

if __name__ == "__main__":
	print(df2)