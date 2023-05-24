import scrapy

class IMDbTop250Spider(scrapy.Spider):
    name = 'imdb_spider'
    start_urls = ['https://www.imdb.com/chart/top/?sort=nv,desc&mode=simple&page=1']

    def parse(self, response):
        movies = response.css('.lister-list tr')
        for movie in movies:
            imdb_id = movie.css('td:nth-child(2) a::attr(href)').get()
            title = movie.css('td:nth-child(2) a::text').get()
            yield {
                'imdbID': imdb_id.split('/')[2],
                'title': title
            }