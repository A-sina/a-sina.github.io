import fetchData from "../utils/httpReq.js";


const API_KEY = "852ac1787159fb74cb1f548de29c211d";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const searchInput = document.getElementById("search-input");
const searchBTN = document.querySelector("button");
const weatherDiv = document.getElementById("show-weather");
const locationBTN = document.getElementById("location");
const forecastDiv = document.getElementById("forecast")


const renderCurrentWeather = (data) => {
    const {main, sys, weather, wind} = data;
    const weatherJSX = `
        <h2>${data.name}, ${sys.country}</h2>
        <section id="icon-section">
            <img src="https://openweathermap.org/img/w/${weather[0].icon}.png" alt"weather-icon" width="50px" height"50px"/>
            <p>${weather[0].main}</p>
            <span>${Math.round(main.temp)}°C</span>
        </section>
        <section id="wind-section">
            <p>Humidity: <span>${main.humidity}%</span></p>
            <p>Wind Speed: <span>${wind.speed} m/s</span></p>
        </section>
    `
    weatherDiv.innerHTML = weatherJSX;
}

const renderForecastWeather = (data) => {
    forecastDiv.innerHTML = "";
    const forecasts = data.list.filter((data) => data.dt_txt.split(" ")[1] == '12:00:00')
    forecasts.forEach((data) => {
        const date = new Date(data.dt_txt.split(" ")[0]);
        const days = date.toLocaleDateString("en-US", {weekday: 'long'});
        const forecastJSX = `
            <div id="forecast-div">
                <img alt="icon" src="https://openweathermap.org/img/w/${data.weather[0].icon}.png" alt"weather-icon" width="50px" height"50px"/>
                <h4>${days}</h4>
                <p>${Math.round(data.main.temp)}°C</p>
                <span>${data.weather[0].main}</span>
            </div>
        `
        forecastDiv.innerHTML += forecastJSX; 
    })
}


const showLocation = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(success, error);
    } else {console.log("error");}
};


const getWeatherByName = async (city) => {
    const url = `${BASE_URL}/weather?q=${city || "mashhad"}&units=metric&appid=${API_KEY}`
    const forecastURL = `${BASE_URL}/forecast?q=${city || "mashhad"}&units=metric&appid=${API_KEY}`
    const weatherData = await fetchData(url);
    const forecastData = await fetchData(forecastURL);
    renderCurrentWeather(weatherData);
    renderForecastWeather(forecastData)
}


const searchHandler = () => {
    const cityName = searchInput.value;
    if (!cityName) {alert("please enter a city")}
    getWeatherByName(cityName)
    searchInput.value = "";
}


const success = async (pos) => {
    searchInput.value = "";
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    const forecastURL = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    const weatherData = await fetchData(url);
    const forecastData = await fetchData(forecastURL);
    renderCurrentWeather(weatherData);
    renderForecastWeather(forecastData);
}

const error = (err) => {
    console.log(err);
}


document.addEventListener("DOMContentLoaded", () => getWeatherByName())
searchBTN.addEventListener("click", searchHandler);
locationBTN.addEventListener("click", showLocation)