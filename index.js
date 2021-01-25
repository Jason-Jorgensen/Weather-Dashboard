var citySearch = "";
var cityArray = [localStorage.getItem("City")];


var today = moment().format("MM/DD/YYYY");



$(".searchBtn").on("click", cityName);

function cityName() {
    if ($("#citySearch").val()!=""){
    citySearch = $("#citySearch").val();
    cityArray.push(citySearch)
    start();
    searchHistory();
    }
}

function start() {
    // citySearch = $("#citySearch").val();
    var url = "https://api.openweathermap.org/data/2.5/weather?q=" + citySearch + "&units=imperial&appid=1bb12d8a7bc9ee3a5bc43b48f314f222";
    $("#citySearch").val("");

    localStorage.setItem("City", cityArray);

    $.ajax({
        url: url,
        method: "GET"
    }).then(function (response) {
        // $(".mainIcon").empty();
        $(".cityAndDate").text(response.name + " (" + today + ")");
        $(".tempText").text((Math.round(response.main.temp) + " °F"));
        $(".humidityText").text(response.main.humidity + "%");
        $(".windText").text(response.wind.speed + " mph");
        var mainIconId=response.weather[0].icon;
        $(".mainIconImg").empty();
        $(".mainIconImg").append("<img src="+'http://openweathermap.org/img/wn/'+mainIconId+'@2x.png'+" height=75px width=75px>")
        console.log(response);


        function uvIndex() {
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var urlUv = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=Imperial&appid=1bb12d8a7bc9ee3a5bc43b48f314f222";


            $.ajax({
                url: urlUv,
                method: "GET"
            }).then(function (response2) {
                console.log(response2);
                $(".uvText").text(response2.daily[0].uvi)
                $(".card-deck").empty();
                // var fiveDay = response2.daily;
                for (let index = 1; index < 6; index++) {
                    var iconId= response2.daily[index].weather[0].icon;
                    var createCard = $("<div class='card'></div>")
                    var cardDate = $("<h4 class='card-title'>" + moment(response2.daily[index].dt, "X").format("MM/DD/YY") + "</h5>");
                    var cardIcon = $("<img src="+'http://openweathermap.org/img/wn/'+iconId+'@2x.png'+" width=70px height=70px;>");
                    var cardTemp = $("<p class='card-text'> Temp: " + response2.daily[index].temp.day + " °F</p>");
                    var cardHumidity = $("<p class='card-text'> Humidity: " + response2.daily[index].humidity + "%</p>");
                    console.log(iconId)
                    createCard.append(cardDate, cardIcon, cardTemp, cardHumidity);
                    $(".card-deck").append(createCard);
                }
            })
        };
        uvIndex();

    })

};


function searchHistory() {
    var storageArray = localStorage.getItem("City");
    var storageArray2 = storageArray.split(',');
    $(".searchHistory").empty();
    for (let i = 1; i < storageArray2.length; i++) {
        var historyButton = $("<button class='btn border mr-2 mb-2 historyButton'></button>");
        historyButton.attr("data-city", storageArray2[i])
        historyButton.text(storageArray2[i]);
        $(".searchHistory").prepend(historyButton);
    }
    console.log(storageArray);
}

$(document).on("click", ".historyButton", function () {
    var btnCity = $(this).attr("data-city");
    citySearch = btnCity;
    start();
});

$(".clearButton").click(function(){
    localStorage.clear();
    location.reload();

});

searchHistory();