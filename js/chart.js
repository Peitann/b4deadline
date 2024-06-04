document.addEventListener('DOMContentLoaded', function() {
    // Function to create the chart
    function createChart(data) {
        const ctx = document.getElementById('myChart').getContext('2d');

        // Calculate a weighted rating for each store based on rating and sales
        const stores = data.map(item => ({
            toko: item.toko,
            rating: item.rating,
            sales: parseTerjual(item.terjual)
        }));

        const storeRatings = {};
        stores.forEach(store => {
            if (!storeRatings[store.toko]) {
                storeRatings[store.toko] = { rating: 0, sales: 0, count: 0 };
            }
            storeRatings[store.toko].rating += store.rating * store.sales;
            storeRatings[store.toko].sales += store.sales;
            storeRatings[store.toko].count += 1;
        });

        const weightedRatings = Object.keys(storeRatings).map(toko => ({
            toko,
            weightedRating: storeRatings[toko].rating / storeRatings[toko].sales,
            sales: storeRatings[toko].sales
        }));

        weightedRatings.sort((a, b) => b.weightedRating - a.weightedRating);

        const topStores = weightedRatings.slice(0, 10);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: topStores.map(store => store.toko),
                datasets: [{
                    label: 'Rating Toko',
                    data: topStores.map(store => store.weightedRating),
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                maintainAspectRatio: false
            }
        });
    }

    // Function to create chart based on location data
    function createLocationChart(data) {
        const ctx = document.getElementById('locationChart').getContext('2d');

        const locations = {};
        data.forEach(function(item) {
            const sales = parseTerjual(item.terjual);
            if (item.lokasi !== null && item.lokasi !== undefined) {
                if (!locations[item.lokasi]) {
                    locations[item.lokasi] = 0;
                }
                locations[item.lokasi] += sales;
            }
        });

        const sortedLocations = Object.keys(locations)
            .map(location => ({ location, sales: locations[location] }))
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 10); // Ensure the top 10 locations are taken

        const locationChartData = {
            labels: sortedLocations.map(item => item.location),
            datasets: [{
                label: 'Jumlah Penjualan Berdasarkan Lokasi',
                data: sortedLocations.map(item => item.sales),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: locationChartData,
            options: {
                indexAxis: 'y',  // This makes the chart horizontal
                scales: {
                    x: {
                        beginAtZero: true
                    }
                },
                maintainAspectRatio: false
            }
        });
    }

    // Function to create chart based on brand data
    function createBrandChart(data) {
        const ctx = document.getElementById('brandChart').getContext('2d');
        const brands = {};
        data.forEach(function(item) {
            const brand = extractBrand(item.nama);
            if (brand) {
                if (!brands[brand]) {
                    brands[brand] = 0;
                }
                brands[brand]++;
            }
        });
        const brandChartData = {
            labels: Object.keys(brands),
            datasets: [{
                label: 'Jumlah Penjualan Berdasarkan Merek',
                data: Object.values(brands),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(200, 80, 152, 0.2)',
                    'rgba(45, 299, 102, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(200, 80, 152, 1)',
                    'rgba(45, 299, 42, 1)'
                ],
                borderWidth: 1
            }]
        };
        new Chart(ctx, {
            type: 'pie',
            data: brandChartData,
            options: {
                maintainAspectRatio: false
            }
        });
    }

    // Function to extract brand from product name
    function extractBrand(productName) {
        const brands = ['Lenovo', 'Advan', 'ACER', 'ASUS', 'MSI', 'HP', 'Dell'];
        let foundBrand = null;
        brands.forEach(function(brand) {
            if (productName.toLowerCase().includes(brand.toLowerCase())) {
                foundBrand = brand;
            }
        });
        if (!foundBrand) {
            foundBrand = 'Lainnya';
        }
        return foundBrand;
    }

    // Function to parse "terjual" field
    function parseTerjual(terjual) {
        if (terjual.includes('rb+')) {
            return parseInt(terjual.replace('rb+ terjual', '')) * 1000;
        } else if (terjual.includes('+')) {
            return parseInt(terjual.replace('+ terjual', ''));
        } else {
            return parseInt(terjual.replace(' terjual', ''));
        }
    }

    // Function to fetch data and create the chart
    function fetchDataAndCreateChart() {
        fetch("tokopedia/laptop_gaming_tokopedia.json")
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to load');
            })
            .then(function(data) {
                createChart(data);
            })
            .catch(function(error) {
                console.error('Error fetching the JSON data for the chart:', error);
            });
    }

    // Function to fetch data and create the chart for location
    function fetchDataLocationNCreateChart() {
        fetch("tokopedia/laptop_gaming_tokopedia.json")
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to load');
            })
            .then(function(data) {
                createLocationChart(data);
            })
            .catch(function(error) {
                console.error('Error fetching the JSON data for the location chart:', error);
            });
    }

    // Function to fetch data and create the chart for brand
    function fetchDataNCreateBrandChart() {
        fetch("tokopedia/laptop_gaming_tokopedia.json")
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to load');
            })
            .then(function(data) {
                createBrandChart(data);
            })
            .catch(function(error) {
                console.error('Error fetching the JSON data for the brand chart:', error);
            });
    }

    function createAuthorizedChart(data) {
        const ctx = document.getElementById('authorizedChart').getContext('2d');

        const officialSales = {};
        const unofficialSales = {};

        data.forEach(function(item) {
            const sales = parseTerjual(item.terjual);
            if (item.lokasi) {
                if (item.toko && (item.toko.toLowerCase().includes('authorized') || item.toko.toLowerCase().includes('official'))) {
                    if (!officialSales[item.lokasi]) {
                        officialSales[item.lokasi] = 0;
                    }
                    officialSales[item.lokasi] += sales;
                } else {
                    if (!unofficialSales[item.lokasi]) {
                        unofficialSales[item.lokasi] = 0;
                    }
                    unofficialSales[item.lokasi] += sales;
                }
            }
        });

        const filteredLocations = Object.keys(officialSales)
            .filter(location => officialSales[location] > 100)
            .sort((a, b) => officialSales[b] - officialSales[a])
            .slice(0, 10);

        const filteredOfficialSales = filteredLocations.map(location => officialSales[location]);
        const filteredUnofficialSales = filteredLocations.map(location => unofficialSales[location]);

        const chartData = {
            labels: filteredLocations,
            datasets: [{
                label: 'Toko Official',
                data: filteredOfficialSales,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }, {
                label: 'Toko Non-Official',
                data: filteredUnofficialSales,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                maintainAspectRatio: false
            }
        });
    }

    // Function to fetch data and create the chart
    function fetchDataAndCreateAuthorizedChart() {
        fetch("tokopedia/laptop_gaming_tokopedia.json")
            .then(function(response) {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Failed to load');
            })
            .then(function(data) {
                createAuthorizedChart(data);
            })
            .catch(function(error) {
                console.error('Error fetching the JSON data for the authorized chart:', error);
            });
    }

    // Event listener for the "Visualisasi Toko" button
    document.getElementById('visualisasiTokoBtn').addEventListener('click', function() {
        // Menyembunyikan pesan selamat datang
        document.getElementById('welcomeHeader').style.display = 'none';
        document.getElementById('welcomeText').style.display = 'none';
        document.querySelector(".box-container").style.display = "none";
        document.querySelector(".selimut").style.display = "none";

        // Show the charts
        document.getElementById('myChart').style.display = 'block';
        document.getElementById('locationChart').style.display = 'block';
        document.getElementById('brandChart').style.display = 'block';
        document.getElementById('authorizedChart').style.display = 'block';
        
        // Fetch data and create charts
        fetchDataAndCreateChart();
        fetchDataLocationNCreateChart();
        fetchDataNCreateBrandChart();
        fetchDataAndCreateAuthorizedChart();
    });
});
