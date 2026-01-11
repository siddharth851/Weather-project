const API_KEY = "e267cb9546274794b0f74858261101";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const errorMsg = document.getElementById("errorMsg");

searchBtn.addEventListener("click", fetchWeather);

function fetchWeather() {
    const city = cityInput.value.trim();

    if (city === "") {
        errorMsg.textContent = "Please enter a city name";
        return;
    }

    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=1`)
        .then(response => response.json())
        .then(data => {
            errorMsg.textContent = "";

            document.getElementById("city").textContent = data.location.name;
            document.getElementById("temp").textContent = data.current.temp_c;
            document.getElementById("condition").textContent = data.current.condition.text;
            document.getElementById("humidity").textContent = data.current.humidity + "%";
            document.getElementById("wind").textContent = data.current.wind_kph + " km/h";
            document.getElementById("sunrise").textContent =
                data.forecast.forecastday[0].astro.sunrise;
            document.getElementById("sunset").textContent =
                data.forecast.forecastday[0].astro.sunset;
        })
        .catch(() => {
            errorMsg.textContent = "City not found";
        });
}
