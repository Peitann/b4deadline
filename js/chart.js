document.addEventListener('DOMContentLoaded', function() {
    // Function to create the chart
    function createChart(data, type) {
        const ctx = document.getElementById('myChart').getContext('2d');
        new Chart(ctx, {
            type: type,
            data: {
                labels: data.map(row => row.toko),
                datasets: [{
                    label: 'Rating Toko',
                    data: data.map(row => row.rating),
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
            if (item.lokasi !== null && item.lokasi !== undefined) {
                if (!locations[item.lokasi]) {
                    locations[item.lokasi] = 0;
                }
                locations[item.lokasi]++;
            }
        });

        const locationChartData = {
            labels: Object.keys(locations),
            datasets: [{
                label: 'Jumlah Penjualan Berdasarkan Lokasi',
                data: Object.values(locations),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };

        new Chart(ctx, {
            type: 'bar',
            data: locationChartData,
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
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        };
        new Chart(ctx, {
            type: 'bar',
            data: brandChartData,
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
            foundBrand = 'Unknown';
        }
        return foundBrand;
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
                createChart(data, 'bar');
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
          if (item.toko && item.toko.includes('Authorized')) {
            if (!officialSales[item.lokasi]) {
              officialSales[item.lokasi] = 0;
            }
            officialSales[item.lokasi] += parseInt(item.terjual.replace(' terjual', ''));
          } else {
            if (!unofficialSales[item.lokasi]) {
              unofficialSales[item.lokasi] = 0;
            }
            unofficialSales[item.lokasi] += parseInt(item.terjual.replace(' terjual', ''));
          }
        });
      
        const chartData = {
          labels: Object.keys(officialSales),
          datasets: [{
            label: 'Toko Official',
            data: Object.values(officialSales),
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }, {
            label: 'Toko Non-Official',
            data: Object.values(unofficialSales),
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
        fetchDataNCreateBrandChart(); // Call the function to create chart based on brand data
        fetchDataAndCreateAuthorizedChart();
    });
});
