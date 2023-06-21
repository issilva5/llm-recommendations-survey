import scrapy
import re

class IMDbTop250Spider(scrapy.Spider):
    name = 'imdb_spider'

    def __init__(self, *args, **kwargs):
        super(IMDbTop250Spider, self).__init__(*args, **kwargs)
        self.visited_items = set()

        genres = [
            'action', 'adventure', 'animation',
            'biography', 'comedy', 'crime',
            'documentary', 'drama', 'family',
            'fantasy', 'film-noir', 'history',
            'horror', 'musical', 'mystery',
            'romance', 'sci-fi', 'sport',
            'thriller', 'war', 'western'
        ]

        self.start_urls = [
            'https://www.imdb.com/search/title/?title_type=feature&genres={}&view=simple&sort=num_votes,desc&explore=genres'.
            format(genre) for genre in genres
        ]

    def parse(self, response):
        movies = response.css(
            '.lister-list .lister-item .lister-item-content .lister-col-wrapper .col-title .lister-item-header')
        for movie in movies:
            imdb_id = movie.css('span:nth-child(2) a::attr(href)').get()
            title = movie.css('span:nth-child(2) a::text').get()

            year = movie.css('span:nth-child(2) span::text').get()
            number = re.search(r'\d+(?:\.\d+)?', year)

            if number:
                year = int(number.group())
            else: continue

            if year >= 2021 or imdb_id in self.visited_items:
                continue

            self.visited_items.add(imdb_id)

            yield {
                'imdbID': imdb_id.split('/')[2],
                'title': title
            }
