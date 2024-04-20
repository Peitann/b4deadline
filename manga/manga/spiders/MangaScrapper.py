import scrapy
import re

class MangaSpider(scrapy.Spider):
    name = "manga-spider"
    start_urls = ["https://myanimelist.net/topmanga.php"]

    def parse(self, response, **kwargs):
        for mangas in response.css('tr.ranking-list'):
            info = mangas.css('div.information.di-ib.mt4::text').getall()
            manga_link = mangas.css('a.hoverinfo_trigger.fs14.fw-b::attr(href)').get()
            if manga_link is not None:
                yield response.follow(manga_link, callback=self.parse_manga, meta={
                    'rank': mangas.css('span.lightLink.top-anime-rank-text::text').get(),
                    'title':mangas.css('a.hoverinfo_trigger.fs14.fw-b::text').get(),
                    'image': mangas.css('img.lazyload::attr(data-src)').get(),
                    'score': mangas.css('span.text.on::text').get(),
                    'volume': re.search(r'\((.*?)\)', info[0]).group(1) if re.search(r'\((.*?)\)', info[0]) else None,
                    'date': info[1],
                    'members': re.search(r'([\d,]+)', info[2]).group() if re.search(r'([\d,]+)', info[2]) else None,
                    'manga_link': manga_link,
                })

            next_page = response.css("a.link-blue-box.next::attr(href)").get()
            if next_page is not None:
                next_page_url = response.urljoin(next_page)
                yield response.follow(next_page_url, callback=self.parse)

    def parse_manga(self, response):
        synopsis = response.css('span[itemprop="description"]::text').get()
        yield {
            'rank': response.meta['rank'],
            'title': response.meta['title'],
            'image': response.meta['image'],
            'score': response.meta['score'],
            'volume': response.meta['volume'],
            'date': response.meta['date'],
            'members': response.meta['members'],
            'synopsis': synopsis,
            'manga_link': response.meta['manga_link'],
        }
#scrapy crawl manga-spider -o hasil.json
