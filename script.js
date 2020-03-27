var responseData;
var dataDiv = $('#data-div');
var newsDiv = $('#news-div');
function newsAPI(search, location) {
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

        // attach to the DOM, use these lines to put the news articles in the DOM
        $('#news-div').empty();
        for (var i=0; i<5; i++) {
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
        //
    });
}
function submitSearch() {
    dataDiv.parent().removeClass('display-none');
    newsDiv.parent().removeClass('display-none');
    newsAPI('coronavirus+covid-19', location);
    coronadataAPI('coronavirus', location);
}

$('#submit-button').on("click", function(event) {
    event.preventDefault();
    submitSearch();
});

function coronadataAPI(search, location) {
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
        var words = location.split(" ")
        location = []
        for(let i = 0; i < words.length; i++){
            if(i < words.length-1){
                location = location + words[i][0].toUpperCase() + words[i].slice(1) + " ";
            }
            else{
                location = location + words[i][0].toUpperCase() + words[i].slice(1);
            }
        }
        if(location == 'United States') {
            location = 'USA';
        }
        if(location == 'United Kingdom') {
            location = 'UK';
        }
        for(let i = 0; i<country_data.countries_stat.length;i++){
            var country_name = country_data.countries_stat[i].country_name;
            if(country_name == location) {
                var country = i;
                break;
            }
        }
        var country_cases = country_data.countries_stat[country].cases;
        var title = 'World cases: ' + world_cases;
        var content = location + ' cases: ' + country_cases;
        var contentTwo = 'Cases in ' + location + ' as a percentage of world cases: ' + ((country_cases.replace(",","")) / (world_cases.replace(",","")) * 100).toFixed(2) + '%';
        // attach to the DOM, use these lines to put the news articles in the DOM
        let card = $('<div>').addClass('card');
        let cardTitle = $('<div>').addClass('card-divider').text(title);
        // let cardImage = $('<img>').attr('src', urlToImage)
        let cardContent = $('<div>').addClass('card-divider').text(content);
        let cardContentTwo = $('<div>').addClass('card-divider').text(contentTwo);
        card.append(cardTitle, cardContent, cardContentTwo);
        $('#data-div').empty();
        $('#data-div').append(card);
        //
    })}));
}
// $("#user-location-search").on("change", function(event) {
//     event.preventDefault();
//     // var keycode = (event.keyCode ? event.keyCode : event.which); // listens for the Enter key only
//     // if (keycode === "13") {
//         submitSearch();
//     // }
// });