document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('myChart').getContext('2d');

    // Function to create the chart
    function createChart(data, type) {
    new Chart(ctx, {
        type: type,
        data: {
        labels: data.map(row => row.harga),
        datasets: [{
            label: 'Rating',
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

    // Event listener for the "Visualisasi Toko" button
    document.getElementById('visualisasiTokoBtn').addEventListener('click', function() {
        
    // Hide the welcome message
    document.getElementById('welcomeHeader').style.display = 'none';
    document.getElementById('welcomeText').style.display = 'none';
    document.querySelector(".box-container").style.display = "none";
    document.querySelector(".selimut").style.display = "none";

    // Show the chart canvas
    document.getElementById('myChart').style.display = 'block';

    // Fetch data and create the chart
    fetchDataAndCreateChart();
    });
});