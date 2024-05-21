from selenium import webdriver
import time
from bs4 import BeautifulSoup
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import pandas as pd
import json

# Inisiasi driver Chrome
option = webdriver.ChromeOptions()
option.add_experimental_option('excludeSwitches', ['enable-logging'])
driver = webdriver.Chrome(options=option)

# Link website yang ingin diambil datanya
url = "https://www.tokopedia.com/search?st=&q=laptop%20gaming&srp_component_id=02.01.00.00&srp_page_id=&srp_page_title=&navsource="
driver.get(url)

data = []

# Ubah range-nya kalau mau ambil lebih banyak data
for halaman in range(3):
    WebDriverWait(driver, 5).until(EC.presence_of_element_located((By.CSS_SELECTOR, '#zeus-root')))
    time.sleep(2)

    for scroll in range(25):
        driver.execute_script("window.scrollBy(0, 250);")
        time.sleep(2)
    driver.execute_script("window.scrollTo(50, 0);")
    time.sleep(2)

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    counter = 1
    for laptop in soup.find_all('div', class_='css-1asz3by'):
        nama = laptop.find('div', class_='prd_link-product-name css-3um8ox')
        harga = laptop.find('div', class_='prd_link-product-price css-h66vau')
        lokasi = laptop.find('span', class_='prd_link-shop-loc css-1kdc32b flip')
        toko = laptop.find('span', class_='prd_link-shop-name css-1kdc32b flip')
        rating = laptop.find('span', class_='prd_rating-average-text css-t70v7i')
        terjual = laptop.find('span', class_='prd_label-integrity css-1sgek4h')

        # Hanya tambahkan data jika semua field ada isinya
        if nama and harga and lokasi and toko and rating and terjual:
            data.append({
                'nama': nama.text,
                'harga': harga.text,
                'lokasi': lokasi.text,
                'toko': toko.text,
                'rating': rating.text,
                'terjual': terjual.text
            })

        counter += 1

    time.sleep(2)
    driver.find_element(By.CSS_SELECTOR, 'button[aria-label="Laman berikutnya"]').click()
    time.sleep(2)

# Mengubah data ke DataFrame
df = pd.DataFrame(data, columns=['nama', 'harga', 'lokasi', 'toko', 'rating', 'terjual'])

# Menghapus baris yang memiliki nilai NaN (kosong)
df.dropna(inplace=True)

# Mengubah data ke CSV
df.to_csv('laptop_gaming_tokopedia.csv', index=False, sep=';')

# Mengubah data ke JSON
df.to_json('laptop_gaming_tokopedia.json', orient='records', lines=True)

# Cek df apakah sudah benar atau tidak
print(df)

# Menutup browser jika sudah selesai
driver.close()
