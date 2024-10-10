let baseUrls = {
    uakino: 'https://uakino.me',
    uaserials: 'https://uaserials.pro'
};

function getCategories(site) {
    let baseUrl = baseUrls[site];
    fetch(baseUrl)
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let categories;
            if (site === 'uakino') {
                categories = doc.querySelectorAll('.category-link'); // Актуалізувати селектор
            } else if (site === 'uaserials') {
                categories = doc.querySelectorAll('.serial-category-link'); // Актуалізувати селектор
            }

            let items = Array.from(categories).map(category => ({
                title: category.textContent,
                url: `${baseUrl}${category.getAttribute('href')}`,
                poster: `resources/images/icon_${site}.png`,
                action: `list_movies_${site}`
            }));

            Lampa.Component.add('content', {
                component: 'video',
                items: items
            });
        })
        .catch(error => console.error(`Error loading categories for ${site}:`, error));
}

function listMoviesUAKino(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let movies = doc.querySelectorAll('.movie-item'); // Актуалізувати селектор
            let items = Array.from(movies).map(movie => ({
                title: movie.querySelector('h3').textContent,
                url: `${baseUrls.uakino}${movie.querySelector('a').getAttribute('href')}`,
                poster: movie.querySelector('img').src,
                action: 'play_video'
            }));

            Lampa.Component.add('content', {
                component: 'video',
                items: items
            });
        })
        .catch(error => console.error('Error loading movies from UAKino:', error));
}

function listMoviesUASerials(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let series = doc.querySelectorAll('.series-item'); // Актуалізувати селектор
            let items = Array.from(series).map(series => ({
                title: series.querySelector('h3').textContent,
                url: `${baseUrls.uaserials}${series.querySelector('a').getAttribute('href')}`,
                poster: series.querySelector('img').src,
                action: 'play_video'
            }));

            Lampa.Component.add('content', {
                component: 'video',
                items: items
            });
        })
        .catch(error => console.error('Error loading series from UASerials:', error));
}

function playVideo(url) {
    fetch(url)
        .then(response => response.text())
        .then(html => {
            let parser = new DOMParser();
            let doc = parser.parseFromString(html, 'text/html');
            let videoSrc = doc.querySelector('source').src; // Актуалізувати селектор
            Lampa.Player.play({
                url: videoSrc,
                title: 'Video from Lampa UA Balancer',
                poster: 'resources/images/background.jpg'
            });
        })
        .catch(error => console.error('Error loading video:', error));
}

Lampa.Plugin.add({
    name: 'Lampa UA Balancer',
    version: '1.0.0',
    init: function () {
        Lampa.Component.add('menu', {
            title: 'UAKino',
            component: 'uakino_menu',
            onOpen: () => getCategories('uakino')
        });

        Lampa.Component.add('menu', {
            title: 'UASerials',
            component: 'uaserials_menu',
            onOpen: () => getCategories('uaserials')
        });
    }
});