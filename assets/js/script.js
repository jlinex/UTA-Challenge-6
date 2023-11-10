var searchFormEl = document.querySelector('#search-city');
var resultTextEl = document.querySelector('#currentCityName');
var currentCityName;
var APIkey = 'fa65a71a94ef45379c58ba38f5c58fa0';
var weather = [];
var cityList = [];

// displays the forecast 
function displayWeather(weather) {
    $("#day0-wind").text(weather[0].wind);
    $(`#currentCityName`).text(currentCityName);
    for (var i = 0; i <= 5; i++) {
        $(`#day`+i+`-temp`).text(weather[i].temp);
        $(`#day`+i+`-icon`).html(weather[i].icon);
        $(`#day`+i+`-hum`).text(weather[i].hum);
        $(`#day`+i+`-wind`).text(weather[i].wind);
        $(`#day`+i+`-date`).html(weather[i].date);
        $(`#day`+i+`-icon`).attr("src",weather[i].icon);
    }
}
// shows the cities already searched
function showCityList(cityList) {
    var varCity = "";
    for (var i = 0; i < cityList.length; i++) {
      varCity += `<li class="btn list-group-item list-group-item-action d-flex justify-content-between align-items-center" onclick="searchApi('`+cityList[i]+`')">`+cityList[i]+`</li>`;
    }
    $(`#cityListGroup`).html(varCity);
}
// saves cities to local to storage
function updateCityList(currentCityName) { 
    cityList.indexOf(currentCityName) === -1 ? cityList.push(currentCityName) : console.log("City already on list")
    localStorage.setItem("cityList", JSON.stringify(cityList));
    showCityList(cityList);
}
// find forecast by lat and
function searchApi2(varLat, varLon, currentCityName) { 
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=`+varLat+`&lon=`+varLon+`&exclude=hourly&units=imperial&appid=fa65a71a94ef45379c58ba38f5c58fa0`;
    fetch(locQueryUrl)
      .then(function (response) {
        console.log(response)
        if (!response.ok) {
          throw response.json();
        }
        console.log(response.json)
        return response.json();
      })
      .then(function (locRes) {
        console.log(locRes);
        updateCityList(currentCityName);
        for (var i = 0; i < 7; i++) {
             var wDay = {
                 "date":locRes.daily[i].dt,
                 "temp":locRes.daily[i].temp.day+` °F`,
                 "hum":locRes.daily[i].humidity+`%`,
                 "wind":locRes.daily[i].wind_speed+` MPH`,
                 "icon":`https://openweathermap.org/img/wn/`+locRes.daily[i].weather[0].icon+`.png`
             }
        wDay.date=wDay.date * 1000;
        const dateObject = new Date(wDay.date);
        wDay.date=dateObject.toLocaleDateString();
        weather.push(wDay);
        }   
        displayWeather(weather);
      })
      .catch(function (error) {
        console.error(error);
      });
  }

function searchApi(query) {
    var locQueryUrl = `https://api.openweathermap.org/data/2.5/forecast?q=`+query+`&appid=fa65a71a94ef45379c58ba38f5c58fa0`;
 
    fetch(locQueryUrl)
      .then(function (response) {
        console.log(response);
        if (!response.ok) {
          $("#search-city")[0].reset()
          alert("ERROR: City not found");
          throw response.json();
        }
        console.log(response.json);
        return response.json();
      })
      .then(function (locRes) {
        varLat = locRes.city.coord.lat;
        varLon = locRes.city.coord.lon;
        currentCityName = query;
        console.log(currentCityName + ` located at:`+varLat+`x`+ varLon);
        weather = [];
        searchApi2(varLat, varLon, currentCityName);
    })
      .catch(function (error) {
        console.error(error);
      });
}

function handleSearchFormSubmit(event) {
    event.preventDefault();
    var cityInputVal = document.querySelector('#city-input').value;
    if (!cityInputVal) {
      console.error('You need to enter a city!');
      return;
    }
    searchApi(cityInputVal);
  }

searchFormEl.addEventListener('submit', handleSearchFormSubmit);