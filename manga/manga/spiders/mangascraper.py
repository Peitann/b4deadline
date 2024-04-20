import scrapy

class MangaSpider(scrapy.Spider):
    name = "manga-spider"
    start_urls = ["https://myanimelist.net/topmanga.php"]
    count = 0
    # Code dibawah adalah mengatasi pagination dengan memanipulasi start.urls
    # start_urls.insert(0, "https://myanimelist.net/topmanga.php")

    # Code dibawah adalah untuk mengatasi pagination dengan mengikuti response halaman
    def parse(self, response):
        # Extracting links to individual manga pages
        manga_links = response.css('tr.ranking-list a.hoverinfo_trigger::attr(href)').getall()
        for manga_link in manga_links:
            if self.count < 1000:
                yield scrapy.Request(url=manga_link, callback=self.parse_manga)
            else:
                break

        next_page = response.css('div.pagination a::attr(href)').extract()[-1]
        if next_page and self.count < 1000:
            yield response.follow(next_page, callback=self.parse)
    
    # Code dibawah adalah code untuk mengambil isi dari page yang sudah diambil dari manga_links
    def parse_manga(self, response):
        # Extracting information from individual manga pages
        rank = response.css('span.numbers.ranked strong::text').get()
        image = response.css('img::attr(data-src)').get()
        title = response.css('span.h1-title span[itemprop="name"]::text').get()
        type = response.css('span.information.type a::text').get()
        author =  response.css('span.information.studio.author a::text').get()
        # volumes = response.css('div.spaceit_pad span.dark_text:contains("Volumes:")::text').get()
        # chapters = response.css('div.spaceit_pad span.dark_text:contains("Chapters:")::text').get()
        # status = response.css('div.spaceit_pad span.dark_text:contains("Status:")::text').getall().split()
        # published = response.css('div.spaceit_pad span.dark_text:contains("Published:")::text').getall().split()    
        # genres = response.css('div.spaceit_pad a::text').getall()
        # themes = response.css('div.spaceit_pad span.dark_text::text').get()
        popularity = response.css('span.numbers.popularity strong::text').get()
        members = response.css('span.numbers.members strong::text').get()
        score = response.css('div.score-label::text').get()
        # You can extract more information here as needed
        yield {
            'Rank' : rank,
            'image': image,
            'title': title,
            'Type' : type,
            'Author ' : author,
            # 'volumes' : volumes,
            # 'chapters' : chapters,
            # 'status' : status,
            # 'published' : published,
            # 'Genres' : genres,
            # 'Themes' : themes,
            'score': score,
            'Popularity' : popularity,
            'Members' : members,
        }    
        self.count += 1
        
        # Code dibwah untuk mengambil semua data manga (mengambil dari setiap page sampai sudah tidak ada page lagi)
        # next_page = response.css("a.link-blue-box.next::attr(href)").get()
        # if next_page is not None:
        #     next_page_url = "https://myanimelist.net/topmanga.php"+next_page
        #     yield response.follow(next_page_url, callback=self.parse)