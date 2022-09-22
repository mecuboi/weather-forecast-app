var searchList = [];
var searchBar = $('#search-bar');
var inputEl = $('#simple-search');
var searchListContainer = $('#search-list-container');
var apiKey = '53072a375d6bf34bc2bde40e9812fcc1';
var oneDayApi = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&units=metric`
var geoApiendpoint = `https://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&limit=1&q=`
var fiveDayApi = `https://api.openweathermap.org/data/2.5/forecast?appid=${apiKey}&cnt=5&units=metric`
var todayForecast = $('#today-forecast')
var fiveDayContainer = $('#5-day-forecast')

function searchCity(event) {
    event.preventDefault();
    
    var searchString = $(inputEl).val().trim();
    //to add the search list to the front of the array
    searchList.unshift(searchString);

    geocodingApi(searchString)

    inputEl.val("");


    storeSearchList();
    renderSearchList();
}


function geocodingApi(query) {
    todayForecast.html('')
    fetch(geoApiendpoint + query)
        .then(
            function (response) {
                return response.json();
            },
            function (error) {
                console.log(error.message);
            }
        )
        .then(function (data) {
            console.log(data);
            var lat = data[0].lat
            var lon = data[0].lon

            weatherApi(lat, lon);
            fiveDayWeatherApi(lat, lon);

        });
    inputEl.val("");
}

function weatherApi(lat, lon) {
    fetch(oneDayApi + `&lat=` + lat + '&lon=' + lon)
        .then(
            function (response) {
                return response.json();
            },
            function (error) {
                console.log(error.message);
            }
        )
        .then(function (data) {

            renderOneDay(data)
            
        });
}

function fiveDayWeatherApi(lat, lon) {
    fetch(fiveDayApi + `&lat=` + lat + '&lon=' + lon)
        .then(
            function (response) {
                return response.json();
            },
            function (error) {
                console.log(error.message);
            }
        )
        .then(function (data) {
            console.log(data);

            renderFiveDay(data);
            
        });
}

function renderOneDay(data) {

    var todayDate = moment().format('dddd, Do MMMM YYYY')
    var cityName = $(`<h2 class="text-xl font-bold mb-1">${data.name} - ${todayDate} <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png"></h2>`)
    var descriptionEl = data.weather[0].description
    var description = descriptionEl.toUpperCase()
    

    todayForecast.append(cityName)
    todayForecast.append(`<p class='mt-px mb-8'> ${description}`)
    todayForecast.append(`<p class="mb-4">Temp: ${data.main.temp} C</p>`)
    todayForecast.append(`<p class="mb-4">Wind: ${data.wind.speed} KM/H</p>`)
    todayForecast.append(`<p class="mb-4">Humidity: ${data.main.humidity}%</p>`)
    // todayForecast.append(`<p class="mb-4">UV Index: ${data.wind.speed}</p>`)
}

function renderFiveDay(data) {

    fiveDayContainer.html(' ')
    fiveDayContainer.append('<h3 class="text-xl font-bold mb-8 col-span-10">5-Day Forecast:</h3>')

    for (var i = 0; i < data.list.length; i++) {
        var list = data.list[i]
        var cardContainer = $('<div class="col-span-10 md:col-span-2 bg-indigo-400 text-white p-3 rounded-lg m-1">');
        let date = moment().add(i + 1, 'days').format('DD/MM/YYYY');
        fiveDayContainer.append(cardContainer);
        cardContainer.append(`<p class="text-xl font-bold mb-4">${date}</p>`);
        cardContainer.append(`<img src="http://openweathermap.org/img/wn/${list.weather[0].icon}@2x.png">`);
        cardContainer.append(`<p class="mb-4">Temp: ${list.main.temp}</p>`);
        cardContainer.append(`<p class="mb-4">Wind: ${list.wind.speed}KM/H</p>`);
        cardContainer.append(`<p class="mb-4">Humidity: ${list.main.humidity}</p>`);
    }

}

function storeSearchList() {
    // Stringify and set key in localStorage to searchList array
    localStorage.setItem("recentSearch", JSON.stringify(searchList));
}

function renderSearchList() {
    searchListContainer.html("");
    //using DOM manipulation to dynamically create the search list
    var recentTitle = $('<h2 class="text-center font-bold">');
    recentTitle.text("Recent Search").appendTo(searchListContainer);

    //Code will run as long as the list or when it reaches 4 items whichever is less
    for (var i = 0; i < searchList.length && i < 6; i++) {
        var search = searchList[i];
        var recentSearchButton = $('<button class="recent-search bg-indigo-400 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full">');
        //adding an event listener to the button so that they bring to the search page
        recentSearchButton.text(search).appendTo(searchListContainer);

        $(recentSearchButton).on("click", function (event) {
            searchItem = $(event.target).text();
            console.log(searchItem);

            geocodingApi(searchItem);
            
          });
    }
}

function init() {
    // Get stored recent search list from localStorage
    var recentSearchList = JSON.parse(localStorage.getItem("recentSearch"));
    if (recentSearchList !== null) {
        searchList = recentSearchList;
    }
    renderSearchList();
    geocodingApi('sydney');
}


searchBar.on("submit", searchCity);



init();