"use strict";
const API_KEY = "6a3bb4e63e4b5187470555qfs05ce31";

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const name = document.querySelector(".display-city-name");
const degree = document.querySelector(".display-degree");
const weatherImg = document.querySelector(".display-weather-icon");
const wind = document.querySelector(".display-more-details-desc-wind");
const humidity = document.querySelector(".display-more-details-desc-humidity");

const getCityCoords = async function (city) {
  const response = await fetch(
    `https://geocode.maps.co/search?q=${city}&api_key=${API_KEY}&accept-language=en`,
  );

  const data = await response.json();

  return data;
};

const weatherIcon = function (weatherCode, isDay) {
  let weatherImgSource = "node_modules/@meteocons/svg/fill";

  if (weatherCode === 0)
    weatherImgSource += `/clear-${isDay ? "day" : "night"}.svg`;
  else if ([1, 2, 3].includes(weatherCode))
    weatherImgSource += `/mostly-clear-${isDay ? "day" : "night"}.svg`;
  else if ([45, 48].includes(weatherCode))
    weatherImgSource += `/partly-cloudy-${isDay ? "day" : "night"}-fog.svg`;
  else if ([51, 53, 55].includes(weatherCode))
    weatherImgSource += `/partly-cloudy-${isDay ? "day" : "night"}-drizzle.svg`;
  else if ([56, 57].includes(weatherCode))
    weatherImgSource += `/extreme-${isDay ? "day" : "night"}-drizzle.svg`;
  else if ([66, 67, 61, 63, 65, 80, 81, 82].includes(weatherCode))
    weatherImgSource += "/rain.svg";
  else if ([71, 73, 75, 77, 85, 86].includes(weatherCode))
    weatherImgSource += "/snow.svg";
  else if ([95, 96, 99].includes(weatherCode))
    weatherImgSource += "/thunderstorms-rain.svg";
  else weatherImgSource += "/wind.svg";

  return weatherImgSource;
};

const displayWeather = function (data, cityName) {
  const weatherCode = data.current.weather_code;
  const isDay = data.current.is_day === 1;
  const imageSource = weatherIcon(weatherCode, isDay);

  degree.textContent = Math.round(data.current.temperature_2m) + "°C";
  name.textContent = cityName;
  weatherImg.src = imageSource;

  // wind.textContent = "";
  humidity.textContent = data.current.relative_humidity_2m + "%";
  wind.textContent = data.current.wind_speed_10m + " km/h";
};

const searchCityData = async function (city) {
  const cityData = await getCityCoords(city);
  const cityName = cityData[0].name;

  const { lat, lon } = cityData[0];

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,precipitation,temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,precipitation`,
  );

  const data = await response.json();

  console.log(data);
  displayWeather(data, cityName);
};

const clearInputEl = function () {
  searchInput.value = "";
  searchInput.blur();
};

searchBtn.addEventListener("click", function () {
  if (!searchInput.value) return;
  searchCityData(searchInput.value);
  clearInputEl();
});

searchInput.addEventListener("keydown", function (e) {
  if (!searchInput.value) return;
  if (e.key !== "Enter") return;
  searchCityData(searchInput.value);
  clearInputEl();
});
