// API Key
const API_KEY = 'e267cb9546274794b0f74858261101';

// Famous places data
const famousPlaces = {
    'lucknow': {
        name: 'Bara Imambara',
        description: 'A historical monument built in 1784, famous for its unique architecture and the Bhul Bhulaiya maze.',
        image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80'
    },
    'delhi': {
        name: 'Red Fort',
        description: 'A historic fort and UNESCO World Heritage Site, symbol of India\'s rich history.',
        image: 'https://images.unsplash.com/photo-1587393855524-087f8e04e9fa?w=800&q=80'
    },
    'mumbai': {
        name: 'Gateway of India',
        description: 'An iconic monument overlooking the Arabian Sea, built in 1924.',
        image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80'
    },
    'bangalore': {
        name: 'Lalbagh Botanical Garden',
        description: 'A famous botanical garden with diverse plant species and a historic glass house.',
        image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80'
    },
    'kolkata': {
        name: 'Victoria Memorial',
        description: 'A grand marble building and museum dedicated to Queen Victoria.',
        image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80'
    },
    'chennai': {
        name: 'Marina Beach',
        description: 'One of the longest urban beaches in the world, a popular tourist destination.',
        image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80'
    },
    'hyderabad': {
        name: 'Charminar',
        description: 'A monument and mosque built in 1591, symbol of Hyderabad city.',
        image: 'https://images.unsplash.com/photo-1569432277567-e8c6a90254e3?w=800&q=80'
    },
    'pune': {
        name: 'Shaniwar Wada',
        description: 'A historical fortification built in 1732, former seat of the Peshwas.',
        image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=800&q=80'
    },
    'jaipur': {
        name: 'Hawa Mahal',
        description: 'The Palace of Winds, a stunning pink sandstone palace with 953 windows.',
        image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80'
    },
    'agra': {
        name: 'Taj Mahal',
        description: 'One of the Seven Wonders of the World, a stunning white marble mausoleum.',
        image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800&q=80'
    },
    'default': {
        name: 'Famous Landmark',
        description: 'This city has many beautiful landmarks and rich cultural heritage worth exploring!',
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80'
    }
};

// Dark Mode Toggle
document.getElementById('themeToggle').addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Search Button Click
document.getElementById('searchBtn').addEventListener('click', function() {
    const city = document.getElementById('cityInput').value.trim();
    if (city) {
        fetchWeather(city);
    } else {
        alert('Please enter a city name!');
    }
});

// Enter Key Press
document.getElementById('cityInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const city = document.getElementById('cityInput').value.trim();
        if (city) {
            fetchWeather(city);
        }
    }
});

// Location Button Click
document.getElementById('locationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                fetchWeatherByCoords(lat, lon);
            },
            function() {
                alert('Unable to get your location!');
            }
        );
    } else {
        alert('Geolocation not supported!');
    }
});

// Fetch Weather by City Name
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
    }
}

// Fetch Weather by Coordinates
async function fetchWeatherByCoords(lat, lon) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=7&aqi=yes`
        );
        const data = await response.json();
        
        if (data.error) {
            alert('Unable to get weather!');
            return;
        }
        
        document.getElementById('cityInput').value = data.location.name;
        displayWeather(data);
    } catch (error) {
        alert('Error fetching weather!');
    }
}

// Display Weather Data
function displayWeather(data) {
    // Current Weather
    document.getElementById('cityName').textContent = data.location.name + ', ' + data.location.country;
    document.getElementById('weatherIcon').innerHTML = `<img src="https:${data.current.condition.icon}" alt="Weather">`;
    document.getElementById('temperature').textContent = Math.round(data.current.temp_c) + '°C';
    document.getElementById('condition').textContent = data.current.condition.text;
    document.getElementById('humidity').textContent = data.current.humidity + '%';
    document.getElementById('windSpeed').textContent = data.current.wind_kph + ' km/h';
    document.getElementById('sunrise').textContent = data.forecast.forecastday[0].astro.sunrise;
    document.getElementById('sunset').textContent = data.forecast.forecastday[0].astro.sunset;
    
    // Famous Place
    const cityLower = data.location.name.toLowerCase();
    const place = famousPlaces[cityLower] || famousPlaces['default'];
    
    document.getElementById('famousPlace').style.display = 'block';
    document.getElementById('famousPlace').innerHTML = `
        <h3>📍 Famous Place in ${data.location.name}</h3>
        <img src="${place.image}" alt="${place.name}">
        <p><strong>${place.name}</strong></p>
        <p>${place.description}</p>
    `;
    
    // 7-Day Forecast
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    
    data.forecast.forecastday.forEach(day => {
        const date = new Date(day.date);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        
        forecastContainer.innerHTML += `
            <div class="forecast-card">
                <div class="forecast-day">${dayName}</div>
                <div class="forecast-icon">
                    <img src="https:${day.day.condition.icon}" alt="Weather">
                </div>
                <div class="forecast-temp">${Math.round(day.day.avgtemp_c)}°C</div>
                <div class="forecast-desc">${day.day.condition.text}</div>
            </div>
        `;
    });
}

// Load default city on page load
window.addEventListener('load', function() {
    document.getElementById('cityInput').value = 'Lucknow';
    fetchWeather('Lucknow');
});