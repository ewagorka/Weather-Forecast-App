//get today's date
var today = moment();

//store results from API query as a global value
var results;

//array to save search history
var searches=[];

//render search history
renderSearches();

//when search button is clicked
$("#search-button").on("click", function (event) {
    //prevent default
    event.preventDefault();

    //empty forecast area
    $("#forecast").empty();

    //get value from input
    var qEl = $("#search-input").val().trim();
    //form query url
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + qEl + "&units=metric&appid=88c1c3f53bd4ff31a0846bec366c6e7c";
    //get data from query
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            displayForecast(response);
            saveSearch(qEl);
        })
        //Display error message
        .catch(err =>
            alert("Something went wrong, search for a city again")
        );
});

function displayForecast(response){

    today = moment();
    //store response from query
    results = response;
    console.log(results);

    //get city name
    var city = response.city.name;
    //get today's most recent data
    var todayData = response.list[0];


    //Todays weather forecast

    //Display heading
    $("#today").children("h2").text(city +" "+today.format("DD/MM/YYYY"));
    $("#today").children("img").attr("src","https://openweathermap.org/img/wn/"+todayData.weather[0].icon+"@2x.png");

    //Display weather data
    $("#today").children("p").html(
        "Temp: "+(todayData.main.temp).toFixed(1)+"°C"+"<br>"+
        "Wind: "+todayData.wind.speed+" KPH"+"<br>"+
        "Humidty: "+todayData.main.humidity+"%");
    
    //5 Days weather forecast
    //for each card in the 5 day forecast area
    for (var i = 0; i < 5; i++) {
        
        //create new div, add bootstrap class
        var cardDiv = $("<div>").attr("class", "card card-body");


        //grab todays date at each iteration
        today = moment();
        //get headline
        cardDate = today.add(i+1,"days"); 
        var headline = $("<h5>").text(cardDate.format("DD/MM/YYYY"));
        
        // search through the list array for the entries that store data for the next day at 15:00
        var cardDateData = response.list.find(function(data){
            return cardDate.format("YYYY-MM-DD")+" 15:00:00"==data.dt_txt;
        })

        //add weather icon
        var cardImage =$("<img>").attr("src","https://openweathermap.org/img/wn/"+cardDateData.weather[0].icon+"@2x.png");
        
        //add weather info
        var p = $("<p>").html(
            "Temp: "+(cardDateData.main.temp).toFixed(1)+"°C"+"<br>"+
            "Wind: "+cardDateData.wind.speed+" KPH"+"<br>"+
            "Humidty: "+cardDateData.main.humidity+"%");

        //append all elements to card div
        cardDiv.append(headline, cardImage, p);
        //append card div to forecast area
        $("#forecast").append(cardDiv);
    }

}
//Save search and render new button
function saveSearch(value){

    //create a button
    var button = $("<button>")
    button.text(value).attr("class","btn")

    // add to the history area in html
    $("#history").prepend(button);

    //save search in array and save to local storage
    searches.push(value);
    localStorage.setItem("savedSearches",JSON.stringify(searches))

}

//Render all saved searches as buttons
function renderSearches(){
    var savedSearches = JSON.parse(localStorage.getItem("savedSearches"))

    //if there are saved searches in the local storage, then update the searches array
    if(savedSearches!= null){
        searches =savedSearches;
    }

    for(i =0; i<searches.length;i++){
        var button = $("<button>")
        button.text(searches[i]).attr("class","btn savedBtn")

        $("#history").prepend(button);
    }
}

// Display data when clicked on the button from history search
$(document).on("click",".savedBtn",function(event){
    event.preventDefault();
    //empty forecast area
    $("#forecast").empty();

    //get value from the saved button
    var buttonText = $(this).text().trim();

    //form query url
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + buttonText + "&units=metric&appid=88c1c3f53bd4ff31a0846bec366c6e7c";
    //get data from query
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            displayForecast(response);
        })
        //Display error message
        .catch(err =>
            alert("Something went wrong, search for a city again h")
        );
});