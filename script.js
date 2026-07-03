"use strict";
const API_KEY = "6a3bb4e63e4b5187470555qfs05ce31";

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const name = document.querySelector(".display-city-name");
const degree = document.querySelector(".display-degree");

const getCityCoords = async function (city) {
  const response = await fetch(
    `https://geocode.maps.co/search?q=${city}&api_key=${API_KEY}&accept-language=en`,
  );

  const data = await response.json();

  return data;
};

const displayWeather = function (data, cityName) {
  const waether = data;
  const isDay = data.current.is_day;

  degree.textContent = Math.round(waether.current.temperature_2m) + "°C";
  name.textContent = cityName;

  console.log(waether);
  console.log(isDay);
};

const searchCityData = async function (city) {
  const cityData = await getCityCoords(city);
  const cityName = cityData[0].name;

  const { lat, lon } = cityData[0];

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,precipitation,temperature_2m,apparent_temperature,relative_humidity_2m,is_day`,
  );

  const data = await response.json();

  displayWeather(data, cityName);
};

searchBtn.addEventListener("click", function () {
  if (!searchInput.value) return;
  searchCityData(searchInput.value);
});

searchInput.addEventListener("keydown", function (e) {
  if (!searchInput.value) return;
  if (e.key !== "Enter") return;
  searchCityData(searchInput.value);
});
