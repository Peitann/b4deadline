// Jumlah baris per halaman
const rowsPerPage = 20;
// Variabel untuk mengatur halaman saat ini
let currentPage = 1;
let products = [];

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
            // Hitung nomor awal pada halaman saat ini
            const startIndex = (currentPage - 1) * rowsPerPage + 1; 
            products.forEach((product, index) => {
                const rating = product.rating ? `<i class="ri-star-fill star-icon"></i>${product.rating}` : "N/A";
                const rowNumber = startIndex + index; // Hitung nomor pada baris saat ini
                out += `
                <tr>
                    <td>${rowNumber}</td>
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

        // Jumlah baris per halaman
        const rowsPerPage = 20;
        // Variabel untuk mengatur halaman saat ini
        let currentPage = 1;

        // Fungsi untuk menampilkan data sesuai halaman saat ini
        function displayCurrentPage(products) {
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const currentProducts = products.slice(startIndex, endIndex);
            displayProducts(currentProducts);
        }

        // Fungsi untuk memperbarui navigasi halaman
        function updatePagination(totalPages) {
            const prevPageBtn = document.getElementById('prevPage');
            const nextPageBtn = document.getElementById('nextPage');

            prevPageBtn.disabled = currentPage === 1;
            nextPageBtn.disabled = currentPage === totalPages;

            const paginationBar = document.getElementById('paginationBar');
            paginationBar.innerHTML = '';

            for (let i = 1; i <= totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    currentPage = i;
                    displayPaginatedProducts(products);
                });
                if (i === currentPage) {
                    pageBtn.classList.add('active');
                }
                paginationBar.appendChild(pageBtn);
            }
        }
        

        // Tambahkan event listener untuk tombol "Next"
        const nextPageBtn = document.getElementById('nextPage');
        nextPageBtn.addEventListener('click', function() {
            currentPage++;
            displayCurrentPage(products);
        });

        // Tambahkan event listener untuk tombol "Previous"
        const prevPageBtn = document.getElementById('prevPage');
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayCurrentPage(products);
            }
        });


        // Tampilkan halaman pertama saat halaman dimuat
        displayCurrentPage(products);

        // Tambahkan event listener untuk tombol "Tampilkan Semua"
        const showAllBtn = document.getElementById('showAllBtn');
        showAllBtn.addEventListener('click', function() {
            displayAllProducts(); // Panggil fungsi untuk menampilkan semua produk
        });



        // Fungsi untuk menampilkan semua data
        function displayAllProducts() {
            currentPage = 1; // Set halaman kembali ke 1
            displayProducts(products); // Tampilkan semua data produk
        }



        // // Tampilkan data secara default (sebelum tombol diklik)
        // displayProducts(products);

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
            // Tampilkan bar navigasi
            document.getElementById("paginationBar").style.display = "block";
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
            currentPage = 1; // Set halaman kembali ke 1 setelah pencarian
            displayProducts(filteredProducts); // Menampilkan hasil pencarian
            toggleNotFoundMessage(filteredProducts.length === 0); // Panggil fungsi toggleNotFoundMessage dengan parameter true jika hasil pencarian kosong
        }

        // Fungsi untuk menampilkan data sesuai halaman saat ini dengan membaginya ke dalam halaman-halaman
        function displayPaginatedProducts(products) {
            const totalPages = Math.ceil(products.length / rowsPerPage); // Hitung total halaman berdasarkan jumlah produk dan jumlah baris per halaman
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const currentProducts = products.slice(startIndex, endIndex);
            displayProducts(currentProducts);
            updatePagination(totalPages); // Perbarui tampilan navigasi berdasarkan total halaman
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
