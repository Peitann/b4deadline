import scrapy

class MangaSpider(scrapy.Spider):
    name = "manga-spider"
    start_urls = ["https://myanimelist.net/topmanga.php"]
    
    # Initialize counter
    count = 0

    def parse(self, response):
        for mangas in response.css('tr.ranking-list'):
            info_text = mangas.css('div.information.di-ib.mt4').xpath('string()').get().strip()
            
            manga_info = None
            date_info = None
            members_info = None
            
            if info_text:
                lines = [line.strip() for line in info_text.split('\n') if line.strip()]
                manga_info = lines[0] if lines else None
                if len(lines) > 1:
                    date_info = lines[1]
                if len(lines) > 2:
                    members_info = lines[2]
            
            # Increment counter
            self.count += 1
            
            yield {
                'image': mangas.css('img::attr(data-src)').get(),
                'rank': mangas.css('span.lightLink.top-anime-rank-text::text').get(),
                'title': mangas.css('a.hoverinfo_trigger.fs14.fw-b::text').get(),
                'info': manga_info,
                'date': date_info,
                'members': members_info
            }
            
            # Stop parsing if count reaches 1000
            if self.count >= 1000:
                self.logger.info('Reached 1000 data points. Stopping parsing.')
                break

        # Follow next page link if count is still below 1000
        if self.count < 1000:
            next_page = response.css("a.link-blue-box.next::attr(href)").get()
            if next_page is not None:
                yield response.follow(next_page, callback=self.parse)
