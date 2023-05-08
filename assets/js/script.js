var today = moment();
console.log(today);

var results;

//when search button is clicked
$("#search-button").on("click", function (event) {
    //prevent default
    event.preventDefault();

    //empty forecast area
    $("#forecast").empty();

    //get value from input
    var qEl = $("#search-input").val().trim();

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + qEl + "&units=metric&appid=88c1c3f53bd4ff31a0846bec366c6e7c";
    $.ajax({
        url: queryURL,
        method: "GET"
    })
        .then(function (response) {
            //store response from query
            results = response;
            console.log(results);

            //get city name
            var city = response.city.name;
            //get today's most recent data
            var todayData = response.list[0];

            //Display heading
            $("#today").children("h2").text(city +" "+today.format("DD/MM/YYYY"));
            $("#today").children("img").attr("src","https://openweathermap.org/img/wn/"+todayData.weather[0].icon+"@2x.png");

            //Display weather data
            $("#today").children("p").html(
                "Temp: "+(todayData.main.temp).toFixed(1)+"°C"+"<br>"+
                "Wind: "+todayData.wind.speed+" KPH"+"<br>"+
                "Humidty: "+todayData.main.humidity+"%");
            //Todays weather forecast

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
        })
        //Display error message
        .catch(err =>
            alert("Something went wrong, search for a city again")
        );
});
