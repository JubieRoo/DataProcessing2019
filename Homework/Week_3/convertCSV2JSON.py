#!/usr/bin/env python
# Name: Ruby Bron
# Student number: 12474223
""" 
Converts a csv data file to a json file
"""

import csv
import json
import pandas as pd

# opens the file in csv format
INPUT_CSV = pd.read_csv("KNMI.txt")
print(INPUT_CSV)