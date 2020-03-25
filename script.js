var responseData;
var dataDiv = $('#data-div');
var newsDiv = $('#news-div');

function newsAPI(search, location, firstResult, lastResult) {
    var apiKey = '5b5900f1a1e0479491c99baf6798e14f'
    var location = $('#user-location-search').val();
    var queryURL = 'http://newsapi.org/v2/everything?q=' + search + '+' + location + '&apiKey=' + apiKey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        responseData = response;
        console.log(queryURL);

        // changing the footer position so it's out of the way for better screen space.
        // Best to leave in within the promise func so it happens simultanelously and doesn't hang out in the middle of the page while it's loading
        $("footer").removeClass('fixed');
        $("footer").addClass('not-fixed');

        // attach to the DOM, use these lines to put the news articles in the DOM
        function printSearchResults() {
            $('#news-div').empty();
            
            for (i=firstResult; i<lastResult; i++) {
                var title = response.articles[i].title;
                var urlToImage = response.articles[i].urlToImage;
                var content = response.articles[i].content;
                let articleURL = response.articles[i].url;
                let sourceName = response.articles[i].source.name;
                
                // Create card
                let card = $('<div>').addClass('card').attr('style', 'width: inherit;');
                let cardTitle = $('<div>').addClass('card-divider news-title').text(title);
                let cardImage = $('<img>').attr('src', urlToImage)
                let cardContentDiv = $('<div>').addClass('card-section');
                let cardSnippet = $("<div>").text('"' + content + '"');
                let cardSource = $("<a>").attr('href', articleURL).text(sourceName);
    
                // Append card
                cardContentDiv.append(cardSnippet, '<br>', 'Read more at: ', cardSource);
                card.append(cardTitle, cardImage, cardContentDiv);
                newsDiv.append(card);
            }
        }
        printSearchResults(0, 5);

        //
    });
}

function coronadataAPI(location) {
    var apiKey = '0c106cd7b1mshb071f2da45d3a0bp1c8a53jsnf62a5d04035a'
    var location = $('#user-location-search').val();
    var queryURLCountries = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php";
    var queryURLWorld = "https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php";

    function fetch_usa_data(){
    return fetch(queryURLCountries, {
        "method": "GET",
        "headers" : {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "0c106cd7b1mshb071f2da45d3a0bp1c8a53jsnf62a5d04035a"
        }
    }).then(response=> response.json())}

    fetch(queryURLWorld, {
        "method": "GET",
        "headers" : {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": "0c106cd7b1mshb071f2da45d3a0bp1c8a53jsnf62a5d04035a"
        }
    }).then(response=> response.json().then(world_data=>{

        fetch_usa_data().then(country_data=>{
        console.log(world_data);
        console.log(country_data);
        var world_cases = world_data.total_cases;
        var usa_cases = country_data.countries_stat[3].cases;
        var title = 'Total cases: ' + world_cases + ' & USA cases: ' + usa_cases;
        var content = 'Percentage of world cases: ' + (parseFloat(usa_cases) / parseFloat(world_cases) * 100).toFixed(2) + '%';

        // attach to the DOM, use these lines to put the news articles in the DOM
        let card = $('<div>').addClass('card').attr('style', 'width: 400px;');
        let cardTitle = $('<div>').addClass('card-divider').text(title);
        // let cardImage = $('<img>').attr('src', urlToImage)
        let cardContent = $('<div>').addClass('card-section').text(content);
        card.append(cardTitle, cardContent);
        $('#data-div').empty();
        $('#data-div').append(card);
        //
    })}));
}

var pages = $('ul').find('li');
pages.on("click", function() {
    var newPage = $(this);
    var curr

    if (isNaN(newPage.text()) === false) {
        $('li').removeClass('current');
        newPage.addClass('current');
    }
    if (newPage.text() > 1) {
        $('#previous-btn').removeClass('disabled');
        console.log("Not first page");
    } else {
        $('#previous-btn').addClass('disabled');
        console.log('first page');
    }
    
})



function submitSearch() {
    dataDiv.parent().removeClass('display-none');
    newsDiv.parent().removeClass('display-none');
    newsAPI('coronavirus+covid-19', location, 0, 5);
    coronadataAPI(location);
}

$('#submit-button').on("click", function(event) {
    event.preventDefault();
    submitSearch();
});
// $("#user-location-search").on("change", function(event) {
//     event.preventDefault();
//     // var keycode = (event.keyCode ? event.keyCode : event.which); // listens for the Enter key only
//     // if (keycode === "13") {
//         submitSearch();
//     // }
// });