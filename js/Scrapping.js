$(document).ready(function() {
    $.getJSON('.hasil.json', function(data) {
        var row = $('<div class="row"></div>');
        data.forEach(function(item, index) {
            var rgbColor = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
            var card = `
                <div class="col-md-6 mb-4">
                    <div class="card">
                        <div class="row no-gutters">
                            <div class="col-md-4 position-relative">
                                <div class="rank" style="background-color: ${rgbColor};">Rank: ${item.rank}</div>
                                <img class="card-img-top" src="${item.image}" alt="Image">
                            </div>
                            <div class="col-md-8">
                                <div class="card-body">
                                    <h5 class="card-title">${item.title}</h5>
                                    <p class="card-text">${item.synopsis}</p>
                                    <p><strong><span style="color: yellow;">&#9733;</span>  Score:</strong> ${item.score}</p>
                                    <p><strong>Volume:</strong> ${item.volume}</p>
                                    <p><strong>Date:</strong> ${item.date}</p>
                                    <p><strong>Members:</strong> ${item.members}</p>
                                    <p><strong>Authors and Artists:</strong> ${item.authors_and_artists.join(', ')}</p>
                                    <p><strong>Genres:</strong> ${item.genres.join(', ')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            row.append(card);
            if ((index + 1) % 2 === 0) {
                $('#data-container').append(row);
                row = $('<div class="row"></div>');
            }
        });
        if (row.children().length > 0) {
            $('#data-container').append(row);
        }
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
