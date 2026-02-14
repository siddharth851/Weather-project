
const API_KEY = 'e7d0c2d0e98a4c09a6833540261402';

// Famous Places Data

const famousPlaces = {
    'lucknow': {
        name: 'Bara Imambara',
        description: 'A historical monument built in 1784, famous for Bhul Bhulaiya maze.',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80'
    },
    'delhi': {
        name: 'Red Fort',
        description: 'A UNESCO World Heritage Site and symbol of India’s history.',
        image: 'https://images.unsplash.com/photo-1587393855524-087f8e04e9fa?w=800&q=80'
    },
    'mumbai': {
        name: 'Gateway of India',
        description: 'An iconic monument overlooking the Arabian Sea.',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80'
    },
    'default': {
        name: 'Famous Landmark',
        description: 'This city has beautiful landmarks worth exploring!',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'
    }
};

// THEME TOGGLE

document.getElementById('themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem(
        'theme',
        document.body.classList.contains('dark-mode') ? 'dark' : 'light'
    );
});

if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// SEARCH BUTTON

document.getElementById('searchBtn').addEventListener('click', () => {
    const city = document.getElementById('cityInput').value.trim();
    if (city) fetchWeather(city);
    else alert('Please enter a city name!');
});

// ENTER KEY SUPPORT
document.getElementById('cityInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = document.getElementById('cityInput').value.trim();
        if (city) fetchWeather(city);
    }
});

// LOCATION BUTTON

document.getElementById('locationBtn').addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeather(`${lat},${lon}`);
            },
            () => alert('Unable to get your location!')
        );
    } else {
        alert('Geolocation not supported!');
    }
});

// FETCH WEATHER 

async function fetchWeather(city) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=yes`
        );

        const data = await response.json();

        if (data.error) {
            alert('City not found!');
            return;
        }

        displayWeather(data);

    } catch (error) {
        alert('Error fetching weather!');
        console.error(error);
    }
}


function displayWeather(data) {

    // CURRENT WEATHER
    
    document.getElementById('cityName').textContent =
        `${data.location.name}, ${data.location.country}`;

    document.getElementById('weatherIcon').innerHTML =
        `<img src="https:${data.current.condition.icon}" alt="Weather">`;

    document.getElementById('temperature').textContent =
        `${Math.round(data.current.temp_c)}°C`;

    document.getElementById('condition').textContent =
        data.current.condition.text;

    document.getElementById('humidity').textContent =
        `${data.current.humidity}%`;

    document.getElementById('windSpeed').textContent =
        `${data.current.wind_kph} km/h`;

    document.getElementById('sunrise').textContent =
        data.forecast.forecastday[0].astro.sunrise;

    document.getElementById('sunset').textContent =
        data.forecast.forecastday[0].astro.sunset;

    // FAMOUS PLACE

    const cityLower = data.location.name.toLowerCase();
    const place = famousPlaces[cityLower] || famousPlaces['default'];

    const famousPlaceCard = document.getElementById('famousPlace');
    famousPlaceCard.style.display = 'block';

    famousPlaceCard.innerHTML = `
        <h3>📍 Famous Place in ${data.location.name}</h3>
        <img src="${place.image}" alt="${place.name}">
        <p><strong>${place.name}</strong></p>
        <p>${place.description}</p>
    `;

    // 3-DAY FORECAST

    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';

    data.forecast.forecastday.forEach(day => {

        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', {
            weekday: 'long'
        });

        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">
                    <img src="https:${day.day.condition.icon}" alt="Weather">
                </div>
                <div class="forecast-temp">
                    ${Math.round(day.day.avgtemp_c)}°C
                </div>
                <div class="forecast-desc">
                    ${day.day.condition.text}
                </div>
            </div>
        `;
    });
}

window.addEventListener('load', () => {
    document.getElementById('cityInput').value = 'Lucknow';
    fetchWeather('Lucknow');
});
