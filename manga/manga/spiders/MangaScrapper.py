# Pertama-tama, kita mengimpor beberapa modul yang dibutuhkan
import heapq
import json
import scrapy
import re

# Kemudian kita mendefinisikan kelas spider kita, yang merupakan turunan dari kelas Spider di Scrapy
class MangaSpider(scrapy.Spider):
    # Nama spider kita adalah "manga-spider"
    name = "manga-spider"
    # URL awal yang akan kita scrape adalah halaman utama dari top manga di MyAnimeList
    start_urls = ["https://myanimelist.net/topmanga.php"]
    # Kita juga mendefinisikan variabel results sebagai list kosong, yang akan kita gunakan untuk menyimpan hasil scraping kita
    results = []
    counter = 0
    # Metode parse ini akan dipanggil oleh Scrapy untuk setiap respons yang diterima
    def parse(self, response, **kwargs):
        # Untuk setiap manga di halaman (yang diwakili oleh elemen tr dengan kelas 'ranking-list'), kita melakukan beberapa hal
        for mangas in response.css('tr.ranking-list'):
            # Kita mengambil beberapa informasi tentang manga tersebut
            info = mangas.css('div.information.di-ib.mt4::text').getall()
            # Kita mendapatkan link ke halaman detail manga tersebut
            manga_link = mangas.css('a.hoverinfo_trigger.fs14.fw-b::attr(href)').get()
            # Jika link tersebut ada, kita meminta Scrapy untuk mengikuti link tersebut dan memanggil metode parse_manga kita untuk responsnya
            if manga_link is not None:
                yield response.follow(manga_link, callback=self.parse_manga, meta={
                    'rank': int(mangas.css('span.lightLink.top-anime-rank-text::text').get().replace('#', '')),
                    'title':mangas.css('a.hoverinfo_trigger.fs14.fw-b::text').get(),
                    'image': mangas.css('img.lazyload::attr(data-src)').get(),
                    'score': mangas.css('span.text.on::text').get(),
                    'volume': re.search(r'\((.*?)\)', info[0]).group(1) if re.search(r'\((.*?)\)', info[0]) else None,
                    'date': info[1].strip(),
                    'members': re.search(r'([\d,]+)', info[2]).group() if re.search(r'([\d,]+)', info[2]) else None,
                    'manga_link': manga_link,
                })
            self.counter += 1


            # Jika ada halaman berikutnya, kita meminta Scrapy untuk mengikuti link tersebut dan memanggil metode parse kita untuk responsnya
            next_page = response.css("a.link-blue-box.next::attr(href)").get()
            if next_page is not None and self.counter < 1069:
                next_page_url = response.urljoin(next_page)
                yield response.follow(next_page_url, callback=self.parse)

    # Metode parse_manga ini akan dipanggil oleh Scrapy untuk setiap respons yang diterima dari halaman detail manga
    def parse_manga(self, response, **kwargs):
        # Kita mengambil beberapa informasi tambahan tentang manga tersebut
        synopsis = response.css('span[itemprop="description"]::text').get()
        genres = response.css('span[itemprop="genre"]::text').getall()
        authors_and_artists = response.css('span.information.studio.author a::text').getall()
        # Kita membuat item yang berisi semua informasi yang telah kita kumpulkan tentang manga tersebut
        item = {
            'rank': response.meta['rank'],
            'title': response.meta['title'],
            'image': response.meta['image'],
            'score': response.meta['score'],
            'volume': response.meta['volume'],
            'date': response.meta['date'],
            'members': response.meta['members'],
            'synopsis': synopsis,
            'manga_link': response.meta['manga_link'],
            'authors_and_artists': authors_and_artists,
            'genres': genres,
        }
        # Kita memasukkan item tersebut ke dalam heap kita, dengan rank sebagai prioritas (sehingga item dengan rank tertinggi akan menjadi prioritas terendah)
        heapq.heappush(self.results, (item['rank'], item))

    # Metode closed ini akan dipanggil oleh Scrapy ketika spider ditutup
    def closed(self, reason):
        # Ketika spider ditutup, kita menulis hasil ke dalam file dalam urutan rank
        with open('hasil.json', 'w') as f:
            json.dump([item for rank, item in sorted(self.results)], f, indent=4)
# scrapy crawl manga-spider
#cd manga,cd manga, cd spiders