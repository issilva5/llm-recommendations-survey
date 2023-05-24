import random
from ..utils import get_movie_poster

class PopRecommender():

    def __init__(self, database_path) -> None:
        
        self.movies = []
        self._read_database(database_path)

    def _read_database(self, database_path):

        with open(database_path, 'r') as movies:
            movies.readline()
            for movie in movies:
                imdb_id, title = movie.split(',', maxsplit=1)
                self.movies.append({
                    'imdbID': imdb_id,
                    'title': title.strip('\n\"'),
                    'recommender': 'random-top250-imdb'
                })
    
    def get_recommendations(self, n = 2):

        recommendations = random.sample(self.movies, n)
        for movie in recommendations:
            movie['poster'] = get_movie_poster(movie['imdbID'])
            movie['shouldWatch'] = True

        return recommendations