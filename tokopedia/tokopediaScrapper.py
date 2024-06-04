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
url = "https://www.tokopedia.com/search?navsource=&pmax=15000000&pmin=3000000&srp_component_id=04.06.00.00&srp_page_id=&srp_page_title=&st=&q=laptop%20gaming"
driver.get(url)

data = []
seen = set()  # Set to track seen products

# Ubah range-nya kalau mau ambil lebih banyak data
for halaman in range(60):
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.CSS_SELECTOR, '#zeus-root')))
    time.sleep(2)

    for scroll in range(25):
        driver.execute_script("window.scrollBy(0, 250);")
        time.sleep(1)
    driver.execute_script("window.scrollTo(50, 0);")
    time.sleep(1)

    soup = BeautifulSoup(driver.page_source, 'html.parser')

    # Mengambil data yang diinginkan
    for laptop in soup.find_all('div', class_='css-1asz3by'):
        nama = laptop.find('div', class_='prd_link-product-name css-3um8ox')
        harga = laptop.find('div', class_='prd_link-product-price css-h66vau')
        lokasi = laptop.find('span', class_='prd_link-shop-loc css-1kdc32b flip')
        toko = laptop.find('span', class_='prd_link-shop-name css-1kdc32b flip')
        rating = laptop.find('span', class_='prd_rating-average-text css-t70v7i')
        terjual = laptop.find('span', class_='prd_label-integrity css-1sgek4h')

        # Kondisi untuk menghindari produk dengan nama mengandung "baterai"
        if nama and "baterai" not in nama.text.lower():
            product_id = f"{nama.text}-{harga.text}"  # Create a unique identifier for each product
            if product_id not in seen:
                seen.add(product_id)  # Add to seen set to avoid duplicates

                print(f"{nama.text if nama else ''}")
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
    time.sleep(2)

    # Penanganan kesalahan saat mencari tombol "Laman berikutnya"
    try:
        next_button = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, 'button[aria-label="Laman berikutnya"]'))
        )
        if next_button.is_enabled():
            next_button.click()
        else:
            break
    except:
        break
    time.sleep(2)

#mengubah data ke csv
df = pd.DataFrame(data, columns=['nama', 'harga', 'lokasi', 'toko', 'rating', 'terjual'])

# Menghapus baris yang memiliki nilai NaN (kosong)
df.dropna(inplace=True)

df.to_csv('laptop_gaming_tokopedia.csv', index=False, sep=';')

#mengubah data ke json
with open('laptop_gaming_tokopedia.json', 'w') as f:
    json.dump(data, f)

#cek df apakah sudah benar atau tidak
print(df)
#nutup browser jika sudah selesai
driver.close()


#20:46