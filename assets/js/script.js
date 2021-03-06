var formEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#city");
var displayContainerEl = document.querySelector("#display-container");
var searchEl = document.querySelector("#city-search");
var dailyTempEl = document.querySelector("#temp");
var dailyWindEl = document.querySelector("#wind");
var dailyHumidEl = document.querySelector("#humid");
var dailyUviEl = document.querySelector("#uvi");
var dateEl = document.querySelector("#today");
var forecastContainer = document.querySelector(".forecasts");
var citiesEl = document.querySelector("#cities");
var savedCityBtn = document.querySelector(".otherbtn");

var cityStorage = function (city) {
  var storedCities = JSON.parse(localStorage.getItem("storedCities")) || [];

  var newCity = { city: city };

  storedCities.push(newCity);
  //  local storage
  localStorage.setItem("storedCities", JSON.stringify(storedCities));
};

var getSavedCities = function () {
  var savedCities = localStorage.getItem("storedCities");

  savedCities = JSON.parse(savedCities);
  // loop for saved cities
  for (i = 0; i < savedCities.length; i++) {
    citiesButton = document.createElement("button");
    citiesLi = document.createElement("li");
    var savedCityName = savedCities[i].city;
    console.log(savedCityName);
    citiesButton.innerHTML = savedCityName;
    citiesButton.setAttribute("city-name", savedCities[i].city);
    citiesButton.classList = "otherbtn";
    citiesLi.appendChild(citiesButton);
    citiesEl.appendChild(citiesLi);
  }
};

var formSubmit = function (event) {
  event.preventDefault();

  var city = cityInputEl.value.trim();
  if (city) {
    cityPull(city);

    displayContainerEl.textContent = "";
    cityInputEl.value = "";

    citiesButton = document.createElement("button");
    citiesLi = document.createElement("li");
    citiesButton.innerHTML = city;
    citiesButton.setAttribute("city-name", city);
    citiesButton.classList = "otherbtn";
    citiesLi.appendChild(citiesButton);
    citiesEl.appendChild(citiesLi);

    cityStorage(city);
  } else {
    alert("Please enter a city name.");
  }
};

var loadCities = function (event) {
  event.preventDefault();

  var city = event.target.getAttribute("city-name");
  console.log(city);
  if (city) {
    cityPull(city);
  }
};

// longitude and latitude
var cityPull = function (city) {
  apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&units=imperial&appid=3babe176eef3e58c9331eac3d7e73b2d";
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayCity(city);

      var lat = data.coord.lat;
      var lon = data.coord.lon;
      weatherPull(lat, lon);
    });
  });
};

// fweather icons
var callIcon = function (weather) {
  if (weather === "Clear") {
    var dispIcon = "fas fa-sun";
    return dispIcon;
  } else if (weather === "Clouds") {
    var dispIcon = "fas fa-cloud-sun";
    return dispIcon;
  } else if (weather === "Rain") {
    var dispIcon = "fas fa-cloud-rain";
    return dispIcon;
  } else if (weather === "Mist" || weather === "Fog") {
    var dispIcon = "fas fa-smog";
    return dispIcon;
  } else if (weather === "Snow") {
    var dispIcon = "fas fa-snowflake";
    return dispIcon;
  }
};

// uv index
var uviColor = function (uvi) {
  if (uvi < 3) {
    var uvClass = "fav";
    return uvClass;
  } else if (uvi > 3 && uvi < 7) {
    var uvClass = "mod";
    return uvClass;
  } else {
    uvClass = "severe";
    return uvClass;
  }
};

var weatherPull = function (lat, lon) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&exclude=hourly,minutely&appid=3babe176eef3e58c9331eac3d7e73b2d";
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      console.log(data);

      var temp = data.current.temp;
      var wind = data.current.wind_speed;
      var humid = data.current.humidity;
      var uvi = data.current.uvi;
      displayWeather(temp, wind, humid, uvi);
      var conditions = data.current.weather[0].main;

      setUv = uviColor(uvi);
      console.log(setUv);
      dailyUviEl.classList = setUv;

      var iconEl = document.createElement("span");
      var classIcon = callIcon(conditions);
      iconEl.classList = classIcon;
      dateEl.appendChild(iconEl);

      console.log(data);

      forecastContainer.innerHTML = "";

      for (i = 1; i < 6; i++) {
        var forecastTemp = data.daily[i].temp.day;
        var forecastWind = data.daily[i].wind_speed;
        var forecastHumid = data.daily[i].humidity;
        var forecastUvi = data.daily[i].uvi;
        var fConditions = data.daily[i].weather[0].main;

        var day = moment().add(i, "d").format("MM-DD-YYYY");

        setUvi = uviColor(forecastUvi);

        var fIcon = callIcon(fConditions);

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card col btn";
        forecastEl.textContent = day;

        var forecastIconEl = document.createElement("div");
        forecastIconEl.classList = fIcon;
        var dispTemp = document.createElement("div");
        dispTemp.textContent = "Temp: " + forecastTemp;
        var dispWind = document.createElement("div");
        dispWind.textContent = "Wind: " + forecastWind;
        var dispHumid = document.createElement("div");
        dispHumid.textContent = "Humidity: " + forecastHumid;
        var dispUvi = document.createElement("div");
        dispUvi.textContent = "UVI: " + forecastUvi;
        dispUvi.classList = setUvi;

        forecastEl.append(
          forecastIconEl,
          dispTemp,
          dispWind,
          dispHumid,
          dispUvi
        );

        forecastContainer.appendChild(forecastEl);
      }
    });
  });
};

var displayCity = function (city) {
  // current date
  var today = moment().format("MM-DD-YYYY");

  displayContainerEl.textContent = "";
  searchEl.textContent = city;
  dateEl.textContent = " " + today;
};

var displayWeather = function (temp, wind, humid, uvi) {
  dailyTempEl.textContent = temp;
  dailyWindEl.textContent = wind;
  dailyHumidEl.textContent = humid;
  dailyUviEl.textContent = uvi;
};

formEl.addEventListener("submit", formSubmit);
citiesEl.addEventListener("click", loadCities);

getSavedCities();
