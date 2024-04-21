$(document).ready(function() {
    var data = []; // Store all data here
    var itemsPerPage = 100; // Number of items to display per page
    var currentPage = 1; // Current page

    $.getJSON('hasil.json', function(response) {
        data = response;
        loadItems();

        $('#load-more-btn').click(function() {
            currentPage++;
            loadItems();
        });
    });

    function loadItems() {
        var startIndex = (currentPage - 1) * itemsPerPage;
        var endIndex = startIndex + itemsPerPage;

        var paginatedData = data.slice(startIndex, endIndex);

        paginatedData.forEach(function(item) {
            var rankClass = '';
            if (item.rank === 1) {
                rankClass = 'rank-1';
            } else if (item.rank === 2) {
                rankClass = 'rank-2';
            } else if (item.rank === 3) {
                rankClass = 'rank-3';
            }
            $('#data-container').append(`
                <div class="col-md-4 mb-4">
                    <div class="card ${rankClass}">
                        <div class="rank">Rank: ${item.rank}</div>
                        <img class="card-image" src="${item.image}" alt="Image">
                        <div class="info">
                            <p class="card-text">${item.synopsis}</p>
                            <p><strong>Score:</strong> ${item.score}</p>
                            <p><strong>Volume:</strong> ${item.volume}</p>
                            <p><strong>Date:</strong> ${item.date}</p>
                            <p><strong>Members:</strong> ${item.members}</p>
                            <p><strong>Authors and Artists:</strong> ${item.authors_and_artists.join(', ')}</p>
                            <p><strong>Genres:</strong> ${item.genres.join(', ')}</p>
                        </div>
                    </div>
                </div>
            `);
        });

        // Hide load more button if all data has been loaded
        if (endIndex >= data.length) {
            $('#load-more-btn').hide();
        }
    }

    $('.card-image').click(function() {
        $(this).siblings('.info').slideToggle();
    });
});

/*=============== NAV BAR ===============*/
const navMenu = document.getElementById('nav-menu'),
        navToggle = document.getElementById('nav-toggle'),
        navClose = document.getElementById('nav-close')

if(navToggle){
    navToggle.addEventListener('click', () =>{
        navMenu.classList.add('show-menu')
    })
}

if(navClose){
    navClose.addEventListener('click', () =>{
        navMenu.classList.remove('show-menu')
    })
}


