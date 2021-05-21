/****************************************************************
* Program: Weather Dashboard Application
*
* Author: Megan Steblay
*
****************************************************************/

// VARIABLES
let formSearchEl = document.querySelector('#search-form');
let cityInputEl = document.querySelector('#cityname');
let recentContainer = document.querySelector(".recent");
let currentContainer = document.querySelector('.current');
let forecastContainer = document.querySelector('.forecast');
let cityArray = [];

// FORM HANDLER FUNCTION: 
let formSubmitHandler = function (event) {
    event.preventDefault();

    let cityname = cityInputEl.value.trim();

    if (cityname) {
        updateCityArray(cityname);
        getCityWeather(cityname);
    } else {
        console.log("No city specified");
    }
};

// CURRENT WEATHER FUNCTION:
let getCityWeather = function (city) {
    let apiKey = "0dc8568677489e908cf786d938aceb0d"
    let apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + apiKey

    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    lat = data.coord.lat;
                    long = data.coord.lon;

                    // Call the next function:
                    getCityForecast(data, city, lat, long);
                });
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Weather API');
        });
};

// 5-DAY FORECAST FUNCTION:
let getCityForecast = function (weatherData, city, lat, long) {
    let apiKey = "0dc8568677489e908cf786d938aceb0d"
    let apiUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=" + apiKey


    fetch(apiUrl)
        .then(function (response) {
            if (response.ok) {
                response.json().then(function (data) {
                    // Call function to write it. Only pass in weatherData and data
                    displayWeather(weatherData, data);
                })
            } else {
                alert('Error: ' + response.statusText);
            }
        })
        .catch(function (error) {
            alert('Unable to connect to Weather API');
        })
};


// FUNCTION TO WRITE IT TO THE PAGE:
let displayWeather = function (weatherData, forecastData) {

    // **** FOR CURRENT WEATHER: *****

    let weatherEl = document.createElement("ul");
    weatherEl.classList.add("card-content");

    // City Name + Date
    let weatherCity = weatherData.name;
    let weatherDate = new Date(weatherData.dt * 1000).toLocaleDateString();
    let weatherCityDate = document.createElement("li");
    weatherCityDate.textContent = weatherCity + " (" + weatherDate + ")";

    weatherEl.appendChild(weatherCityDate);

    // Icon
    let weatherInfo = document.createElement("img");
    let imgLinkCurrent =
        "http://openweathermap.org/img/wn/" +
        weatherData.weather[0].icon +
        "@2x.png";
    weatherInfo.src = imgLinkCurrent;

    weatherEl.appendChild(weatherInfo);

    // Temp
    let weatherTemp = document.createElement('li');
    weatherTemp.textContent = "Temp: " + weatherData.main.temp + " \u00B0F";

    weatherEl.appendChild(weatherTemp);

    // Windspeed
    let weatherWind = document.createElement('li');
    weatherWind.textContent = "Wind: " + weatherData.wind.speed + " MPH";

    weatherEl.appendChild(weatherWind);

    // Humidity
    let weatherHumid = document.createElement('li');
    weatherHumid.textContent = "Humidity: " + weatherData.main.humidity + " %";

    weatherEl.appendChild(weatherHumid);

    // UV Index
    let weatherUv = document.createElement('li');
    weatherUv.textContent = "UV Index: " + forecastData.current.uvi;

    weatherEl.appendChild(weatherUv);

    // Clear out div content containers

    currentContainer.innerHTML = "";
    forecastContainer.innerHTML = "";

    // Add section title
    let currH3 = document.createElement("h3");
    currH3.textContent = "Current Weather:";
    currentContainer.appendChild(currH3);

    // Append to Current Weather Container: 

    currentContainer.appendChild(weatherEl);


    // **** FOR 5-DAY FORECAST: ****

    // Title of section
    let forH3 = document.createElement("h3");
    forH3.textContent = "5-Day Forecast:";
    forecastContainer.appendChild(forH3);

    for (let i = 1; i < 6; i++) {

        let forecastEl = document.createElement('ul');

        // Date
        let unixTimeStamp = forecastData.daily[i].dt;
        let weatherDate = new Date(unixTimeStamp * 1000).toLocaleDateString();
        let timeEL = document.createElement("li");
        timeEL.textContent = weatherDate;

        forecastEl.appendChild(timeEL);

        // Icon
        let iconEl = document.createElement("img");
        let imgLink =
            "http://openweathermap.org/img/wn/" +
            forecastData.daily[i].weather[0].icon +
            "@2x.png";
        iconEl.src = imgLink;

        forecastEl.appendChild(iconEl);

        // Temperature
        let tempEl = document.createElement('li');
        tempEl.textContent = "Temp: " + forecastData.daily[i].temp.max + " \u00B0F";

        forecastEl.appendChild(tempEl);

        // Windspeed
        let windEl = document.createElement('li');
        windEl.textContent = "Wind: " + forecastData.daily[i].wind_speed + " MPH";

        forecastEl.appendChild(windEl);

        // Humidity
        let humidEl = document.createElement('li');
        humidEl.textContent = "Humidity: " + forecastData.daily[i].humidity + " %";

        forecastEl.appendChild(humidEl);

        // Append it to the Forecast Container: 

        forecastContainer.appendChild(forecastEl);

    };
}

// FUNCTION TO INITIALIZE CITY ARRAY LIST:
let initializeCityArray = function () {
    // Get stored cities from local storage
    let storedCities = JSON.parse(localStorage.getItem("cities"));

    // If cities were retrieved from localStorage, update the cities array
    if (storedCities !== null) {
        cityArray = storedCities;
    }

    // Render the cities
    renderCityArray();
};

// FUNCTION FOR UPDATING CITY ARRAY AND RE-RENDERING IF CHANGED: 
let updateCityArray = function (city) {
    if (!cityArray.includes(city.trim())) {
        cityArray.push(city);
        localStorage.setItem("cities", JSON.stringify(cityArray));
        renderCityArray();
    }
};

// FUNCTION FOR RENDERING CITY ARRAY:
let renderCityArray = function () {

    // Clear any elements from city section
    recentContainer.innerHTML = "";

    // Title of section
    let recH3 = document.createElement("h3");
    recH3.textContent = "Recent Cities:";
    recentContainer.appendChild(recH3);

    // Render a new paragraph and button for each city
    for (let i = 0; i < cityArray.length; i++) {
        let cityToRender = cityArray[i];
        let para = document.createElement("p");
        let btn = document.createElement("button");
        btn.textContent = cityToRender;
        btn.classList.add("city-button", "button", "is-light", "tile", "is-fullwidth");
        btn.setAttribute("data-index", i);
        para.appendChild(btn);
        recentContainer.appendChild(para);
    }
};


// MAIN STATEMENTS THAT EXCUTE WITH EACH PAGE REFRESH:

// Event listener and inline function for city button click
recentContainer.addEventListener("click", function (event) {
    let element = event.target;

    // Checks if element is a button
    if (element.matches("button") === true) {
        // Get its data-index value
        let index = element.getAttribute("data-index");
        // Put corresponding city array value into search box
        cityInputEl.value = cityArray[index];
        // Form submit to trigger form submit event
        formSearchEl.requestSubmit();
    }
});

//Event Listener for form submit
formSearchEl.addEventListener("submit", formSubmitHandler);

// Initialize and render city array
initializeCityArray();
renderCityArray();