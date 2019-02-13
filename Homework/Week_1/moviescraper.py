#!/usr/bin/env python
# Name: Ruby Bron
# Student number: 12474223
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """
    # creates list to fill with movie entries
    movies = []

    # downsizes the datafile to include a list with only all data per movie, making extraction easier
    file_extracted = dom.find_all('div', attrs={'class':"lister-item-content"})

    # every movie has its entry fields extracted into a list
    for films in file_extracted:
        # title is extracted from the header class
        title = films.find('h3', attrs={'class':"lister-item-header"}).a.string
        # rating is extracted from the rating class and then trimmed to leave out the brackets
        rating = films.find('div', attrs={'class':"inline-block ratings-imdb-rating"}).get_text()[2:5]
        # year is extracted from a year class, other data is trimmed off
        year = films.find('span', attrs={'class':"lister-item-year"}).string[-5:-1]
        # actors are extracted into a joined list from a class without a name
        # actors were always in the last four 'a' tag entries
        actors = ", ".join([actor.string for actor in films.find('p', attrs={'class':""}).find_all('a')[-4:]])
        # runtime is extracted from a runtime class, trimming of the minute string to keep only the numbers
        runtime = films.find('span', attrs={'class':"runtime"}).string[:-4]

        # the list is filled so it can be used for csv data visualisation
        movies.append([title, rating, year, actors, runtime])
    # returns the movies with filled entry fields
    return movies


def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    # every movie entry gets a new row
    for movie in movies:
        writer.writerow(movie)


def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)