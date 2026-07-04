"use strict";
const API_KEY = "6a3bb4e63e4b5187470555qfs05ce31";

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-button");
const name = document.querySelector(".display-city-name");
const degree = document.querySelector(".display-degree");
const weatherImg = document.querySelector(".display-weather-icon");
const wind = document.querySelector(".display-more-details-desc-wind");
const humidity = document.querySelector(".display-more-details-desc-humidity");
const favoriteBtn = document.querySelector(".favorite-button");
const container = document.querySelector(".container");
const weatherContainer = document.querySelector(".display-weather");
const spinnerContainer = document.querySelector(".display-spinner");
const errorContainer = document.querySelector(".display-error");
const errorMessage = document.querySelector(".error-desc");
const suggestionsList = document.querySelector(".search-suggestions");

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

const getCityCoords = async function (city) {
  try {
    const response = await fetch(
      `https://geocode.maps.co/search?q=${city}&api_key=${API_KEY}&accept-language=en`,
    );

    const data = await response.json();

    return data;
  } catch (err) {
    throw err;
  }
};

const displayWeather = function (data, cityName) {
  errorContainer.style.display = "none";
  spinnerContainer.style.display = "none";
  weatherContainer.style.display = "flex";

  const weatherCode = data.current.weather_code;
  const isDay = data.current.is_day === 1;
  const imageSource = weatherIcon(weatherCode, isDay);

  degree.textContent = Math.round(data.current.temperature_2m) + "°C";
  name.textContent = cityName;
  weatherImg.src = imageSource;
  humidity.textContent = data.current.relative_humidity_2m + "%";
  wind.textContent = data.current.wind_speed_10m + " km/h";
};

const displaySpinner = function () {
  spinnerContainer.style.display = "block";
  weatherContainer.style.display = "none";
  errorContainer.style.display = "none";
};

const displayError = function (message) {
  spinnerContainer.style.display = "none";
  weatherContainer.style.display = "none";
  errorContainer.style.display = "flex";

  errorMessage.innerHTML = message;
};

const searchCityData = async function (city) {
  try {
    displaySpinner();

    if (city.length <= 2)
      throw new Error("Invalid city name.<br>Please enter a valid name.");

    const cityData = await getCityCoords(city);

    if (cityData.length < 1)
      throw new Error("Cannot find the city.<br>Please enter a valid name.");

    const cityName = cityData[0].name;

    const { lat, lon } = cityData[0];

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=wind_speed_10m,precipitation,temperature_2m,apparent_temperature,relative_humidity_2m,is_day,weather_code,precipitation`,
    );

    if (!response.ok) throw new Error("Something went wrong.");

    const data = await response.json();

    displayFavorites(cityName);
    displayWeather(data, cityName);
  } catch (err) {
    displayError(err.message);
  }
};

const clearInputEl = function () {
  searchInput.value = "";
  searchInput.blur();
};

let favorites = [];

const toggleFavoritesBtn = function (city) {
  if (favorites.includes(city)) favorites.pop(city);
  else favorites.push(city);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const displayFavorites = function (city) {
  if (!city) return;

  if (favorites.includes(city))
    favoriteBtn.innerHTML = `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="size-6"
    >
      <path
        fill-rule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
        clip-rule="evenodd"
      />
    </svg>
`;
  else
    favoriteBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
    </svg>

`;
};

const displayFavoritesList = function (city) {
  suggestionsList.innerHTML = "Tokyo";
  const btnEl = `
  <div class="favorites-list-item">
    <button class="favorites-list-item-button">${city}</button>

    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="favorites-list-item-close"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    </svg>
  </div>`;

  // if (favorites.includes(city)) return;
  suggestionsList.insertAdjacentHTML("beforeend", btnEl);
};

window.addEventListener("click", function (e) {
  const removeItemBtn = e.target.closest(".favorites-list-item-close");

  if (removeItemBtn) {
    const item = removeItemBtn.parentElement;
    const cityTitle = item.querySelector(
      ".favorites-list-item-button",
    ).textContent;
    favorites.pop(cityTitle);
    favorites.forEach((city) => displayFavoritesList(city));
  }
  if (e.target === searchInput) {
    if (searchInput.value) return;
    if (favorites.length === 0) return;
    suggestionsList.classList.toggle("hidden");
  } else suggestionsList.classList.add("hidden");
});

searchBtn.addEventListener("click", function () {
  if (!searchInput.value) return;
  searchCityData(searchInput.value);
  clearInputEl();
});

searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    searchCityData(searchInput.value);
    clearInputEl();
    displayFavorites(name.textContent);
    suggestionsList.classList.add("hidden");
  }

  if (e.key === "Escape") {
    suggestionsList.classList.add("hidden");
  }
});

favoriteBtn.addEventListener("click", function () {
  toggleFavoritesBtn(name.textContent);
  displayFavorites(name.textContent);
  favorites.forEach((city) => displayFavoritesList(city));
  console.log(favorites);
});

suggestionsList.addEventListener("click", function (e) {
  if (!e.target.classList.contains("favorites-list-item-button")) return;
  searchCityData(e.target.textContent);
});

const init = function () {
  favorites = JSON.parse(localStorage.getItem("favorites"));
  if (favorites.length > 0) searchCityData(favorites.at(-1));
  else searchCityData("Madagascar");
  displayFavorites();
  favorites.forEach((city) => displayFavoritesList(city));
};

init();
