var searchList = [];
var searchBar = $('#search-bar');
var inputEl = $('#simple-search');
var searchListContainer = $('#search-list-container');
var apiKey = '53072a375d6bf34bc2bde40e9812fcc1';
var apiEndpoint = `https://api.openweathermap.org/data/3.0/onecall?appid=${apiKey}`
var geoApiendpoint = `http://api.openweathermap.org/geo/1.0/direct?appid=${apiKey}&limit=1&q=`


function geocodingApi(query) {
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
            console.log(data)
            console.log(data[0].lat);
            console.log(data[0].lon);

            var lat = data[0].lat
            var lon = data[0].lon

            weatherApi(lat, lon)
        });
    inputEl.val("");
}

function weatherApi(lat, lon) {
    fetch(apiEndpoint + `&lat=` + lat + '&lon=' + lon)
        .then(
            function (response) {
                return response.json();
            },
            function (error) {
                console.log(error.message);
            }
        )
        .then(function (data) {
            console.log(data)
            console.log(data[0].lat);
            console.log(data[0].lon);

            var lat = data[0].lat
            var lon = data[0].lon

            weatherApi(lat, lon)
        });
}

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

function storeSearchList() {
    // Stringify and set key in localStorage to searchList array
    localStorage.setItem("recentSearch", JSON.stringify(searchList));
}

function renderSearchList() {
    searchListContainer.html("");
    //using DOM manipulation to dynamically create the search list
    var recentTitle = $('<h2 class="text-center font-bold">');
    recentTitle.text("Recent Search").appendTo(searchListContainer);

    //Code will run as long as the list or when it reaches 8 items whichever is less
    for (var i = 0; i < searchList.length && i < 8; i++) {
        var search = searchList[i];
        var recentSearchButton = $('<button class="recent-search bg-indigo-400 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full">');
        //adding an event listener to the button so that they bring to the search page
        recentSearchButton.text(search).appendTo(searchListContainer);
    }
}

function init() {
    // Get stored recent search list from localStorage
    var recentSearchList = JSON.parse(localStorage.getItem("recentSearch"));
    if (recentSearchList !== null) {
        searchList = recentSearchList;
    }
    renderSearchList();
}


searchBar.on("submit", searchCity);
init();