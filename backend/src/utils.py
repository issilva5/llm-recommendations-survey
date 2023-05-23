import os
import requests
from dotenv import load_dotenv

load_dotenv()

omdb_api_key = os.getenv("OMDB_API_KEY")

def get_movie_poster(imdbID):
    response = requests.get(url = f'http://www.omdbapi.com/?apikey={omdb_api_key}&i={imdbID}')
    return response.json()['Poster']