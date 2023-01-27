import { getAirQuality, airContent } from "./air_quality.js"
import key from "./config.js";

const searchInput = document.querySelector('#search-input');
const DEFAULT_VALUE = '--';

let url = 'https://api.openweathermap.org/data/2.5/weather?units=metric';

// https://api.openweathermap.org/data/2.5/weather?lat=57&lon=-2.15&appid={API key}&units=metric


// Get current position and render weather
navigator.geolocation.getCurrentPosition(success, error);

function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}&units=metric`)
        .then(async (res) => await res.json())
        .then(data => {
            renderWeather(data);
        })
        .catch(error => {
            console.error(error);
            alert("Error getting weather.")
        });

    getAirQuality(latitude, longitude, key)
        .then(renderAirQuality)
        .catch(error => {
            console.error(error);
            alert("Error getting air quality index.")
        });
}

function error() {
    console.log('Unable to retrieve your location');
}

// helper function
function setValue(selector, value = DEFAULT_VALUE) {
    document.querySelector(`.${selector}`).textContent = value;
}

// render weather
function renderWeather(data) {
    console.log(data);
    renderMainInfo(data);
    renderAdditionalInfo(data);
    document.body.classList.remove('blurred');
}

// render main information
function renderMainInfo({ main, name, weather }) {
    [weather] = weather;
    setValue('city-name', name);
    setValue('weather-state', weather.description);
    setValue('current-temp', Math.round(main.temp));
    document.querySelector('.weather-icon').src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`
}

// render additional information
const HOUR_FORMATTER = new Intl.DateTimeFormat('default', { hour: "numeric", minute: "2-digit" });

function renderAdditionalInfo({ main, sys, wind }) {
    setValue('sunrise', HOUR_FORMATTER.format(sys.sunrise * 1000));
    setValue('sunset', HOUR_FORMATTER.format(sys.sunset * 1000));
    setValue('humidity', main.humidity);
    setValue('wind', (wind.speed * 3.6).toFixed(2));
}

// render air quality
function renderAirQuality({ airIndex, pm25 }) {
    airContent.forEach(airItem => {
        if (airItem.index === airIndex) {
            document.querySelector('.air-details').style.backgroundColor = airItem.color;
            document.querySelector('.air-icon i').classList.add(`${airItem.icon}`);
            setValue('air-category', airItem.category)
            setValue('air-figure', Math.round(pm25))
            setValue('air-recommendation', airItem.recommendation)
        }
    })
}

// render weather when searching city
searchInput.addEventListener('change', (event) => {
    let cityName = event.target.value;

    if (cityName == null || cityName == "" || (!(isNaN(cityName)))) {
        alert('Please enter city name.');
        event.target.value = "";
        return
    }

    // https://api.openweathermap.org/data/2.5/weather?q={city name}&appid={API key}
    fetch(url + `&q=${cityName}&appid=${key}`)
        .then(async (res) => {
            const data = await res.json();
            renderWeather(data);

            const { coord: { lat, lon } } = data;
            getAirQuality(lat, lon, key)
                .then(renderAirQuality)
                .catch(error => {
                    console.error(error);
                    alert("Error getting air quality index.")
                });
        })
        .catch(error => {
            console.error(error);
            alert("Error getting weather.")
        });
});