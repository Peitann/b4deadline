// Ambil data dari file JSON
fetch("tokopedia/laptop_gaming_tokopedia.json")
    .then(function(response) {
        return response.json();
    })
    .then(function(products) {
        // Fungsi untuk menampilkan data ke dalam tabel
        function displayProducts(products) {
            let placeholder = document.querySelector("#data-output");
            let out = "";
            products.forEach((product, index) => {
                const rating = product.rating ? `<i class="ri-star-fill star-icon"></i>${product.rating}` : "N/A";
                out += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.nama ?? "N/A"}</td>
                    <td>${product.harga ?? "N/A"}</td>
                    <td>${product.lokasi ?? "N/A"}</td>
                    <td>${product.toko ?? "N/A"}</td>
                    <td>${rating}</td>
                    <td>${product.terjual ?? "N/A"}</td>
                </tr>
                `;
            });
            placeholder.innerHTML = out;
        }

        // Tampilkan data secara default (sebelum tombol diklik)
        displayProducts(products);

        // Pilih tombol "Daftar Laptop Gaming"
        const laptopButton = document.querySelector(".flex-container .sub-container:first-child");

        // Tambahkan event listener untuk menampilkan tabel dan search bar saat tombol diklik
        laptopButton.addEventListener("click", function() {
            this.style.outline = "none";
            // Sembunyikan teks "Welcome"
            document.getElementById("welcomeHeader").style.display = "none";
            document.getElementById("welcomeText").style.display = "none";
            // Sembunyikan .box-container dan .selimut
            document.querySelector(".box-container").style.display = "none";
            document.querySelector(".selimut").style.display = "none";
            // Tampilkan tabel
            document.querySelector(".tablescrap").style.display = "table";
            // Tampilkan search bar
            document.getElementById("searchWrapper").style.display = "flex";
        });

        // Fungsi untuk menampilkan atau menyembunyikan pesan "Barang tidak ditemukan" berdasarkan hasil pencarian
        function toggleNotFoundMessage(show) {
            var notFoundMessage = document.getElementById("notFoundMessage");
            var table = document.querySelector(".tablescrap");

            if (show) {
                notFoundMessage.style.display = "block";
                table.style.display = "none"; // Sembunyikan tabel
            } else {
                notFoundMessage.style.display = "none";
                table.style.display = "table"; // Tampilkan kembali tabel
            }
        }
        // Fungsi untuk mencari laptop
        function search_laptop() {
            let input = document.getElementById('searchInput').value.toLowerCase();
            let filteredProducts = products.filter(product => product.nama.toLowerCase().includes(input));
            displayProducts(filteredProducts);
            toggleNotFoundMessage(filteredProducts.length === 0); // Panggil fungsi toggleNotFoundMessage dengan parameter true jika hasil pencarian kosong
        }

        // Fungsi yang akan dipanggil saat tombol "Cari" ditekan
    function search() {
        // Implementasikan logika pencarian Anda di sini
        // Setelah pencarian selesai, panggil fungsi checkSearchResult()
        checkSearchResult();
    }

    // Fungsi untuk memeriksa hasil pencarian dan menampilkan pesan "barang tidak ditemukan" jika hasilnya kosong
    function checkSearchResult() {
        // Gantikan ini dengan logika Anda untuk memeriksa hasil pencarian
        var searchResultIsEmpty = true; // Misalnya, Anda dapat menetapkan ini ke true jika hasil pencarian kosong

        if (searchResultIsEmpty) {
            toggleNotFoundMessage(true);
        } else {
            toggleNotFoundMessage(false);
        }
    }

        // Tambahkan event listener untuk input pencarian
        const searchBar = document.getElementById('searchInput');
        searchBar.addEventListener('input', search_laptop);

    }).catch(function(error) {
        console.error('Error fetching the JSON data:', error);
    });
