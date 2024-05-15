from selenium import webdriver
import time
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import pandas as pd


#Yang perlu di donwload
#pip install selenium
#pip install beautifulsoup4
#pip install pandas
#jangan lupa install chromedriver dulu

#inisiasi driverchrome
option = webdriver.ChromeOptions()
option.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(options=option)

#Link website yang ingin diambil datanya
#note : kalau mau liat website yang diambil datanya, buka link ini di browser
#       dan lihat elemen yang ingin diambil datanya
#       https://www.tokopedia.com/search?st=&q=laptop%20gaming&srp_component_id=02.01.00.00&srp_page_id=&srp_page_title=&navsource=
#       jangan search manual laptop gaming di tokopedia ntar gak sesuai sama yang lagi di scrap di program ini


url = "https://www.tokopedia.com/search?st=&q=laptop%20gaming&srp_component_id=02.01.00.00&srp_page_id=&srp_page_title=&navsource="
driver.get(url)

#Kalau internetnya gacor plus laptop gacor timesleep nya ubah aja ke 1 detik

#Buat nunggu website dimuat dulu
WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, '#zeus-root')))
time.sleep(2)

#buat ngescroll
for scroll in range(25):
    driver.execute_script("window.scrollBy(0, 250);")
    time.sleep(2)
driver.execute_script("window.scrollTo(50, 0);")
time.sleep(2)

#mengambil data html website
soup = BeautifulSoup(driver.page_source, 'html.parser')

#buat test aja
#print(soup)

#mengambil data yang diinginkan
data = []
counter = 1
for laptop in soup.find_all('div', class_='css-1asz3by'):
    nama = laptop.find('div', class_='prd_link-product-name css-3um8ox')
    harga = laptop.find('div', class_='prd_link-product-price css-h66vau')
    lokasi = laptop.find('span', class_='prd_link-shop-loc css-1kdc32b flip')
    toko = laptop.find('span', class_='prd_link-shop-name css-1kdc32b flip')
    rating = laptop.find('span', class_='prd_rating-average-text css-t70v7i')
    terjual = laptop.find('span', class_='prd_label-integrity css-1sgek4h')

    print(f"{counter}. {nama.text if nama else ''}")
    print(f"Harga: {harga.text if harga else ''}")
    if lokasi:
        print(f"Lokasi: {lokasi.text}")
    if toko:
        print(f"Toko: {toko.text}")
    if rating:
        print(f"Rating: {rating.text}")
    if terjual:
        print(f"Terjual: {terjual.text}")
    print("\n")
    counter += 1

    #menambahkan data ke dictionary data
    data.append({
        'nama': nama.text if nama else None,
        'harga': harga.text if harga else None,
        'lokasi': lokasi.text if lokasi else None,
        'toko': toko.text if toko else None,
        'rating': rating.text if rating else None,
        'terjual': terjual.text if terjual else None
    })

#mengubah data ke csv
df = pd.DataFrame(data, columns=['nama', 'harga', 'lokasi', 'toko', 'rating', 'terjual'])
df.to_csv('laptop_gaming_tokopedia.csv', index=False, sep=';')

#cek df apakah sudah benar atau tidak
print(df)
#nutup browser jika sudah selesai
driver.close()


#20:46