var responseData;
var dataDiv = $('#data-div');
var newsDiv = $('#news-div');
var currentPage = 1;

function newsAPI(search, location, page, resultsPerPage) {
    var apiKey = '5b5900f1a1e0479491c99baf6798e14f'
    var queryURL = `https://newsapi.org/v2/everything?q=${search},+${locationEncoded}&page=${page}&pageSize=${resultsPerPage}&apiKey=${apiKey}`; 
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
            
            for (i=0; i<response.articles.length; i++) {
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
        printSearchResults();

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

var pages = $('li');
var pagesArr = [];
for(var i=0; i<pages.length; i++) {
    pagesArr.push(pages[i].textContent);
}

var previousBtn = $('.pagination-previous');
var nextBtn = $('.pagination-next');

// pagination function
function whatPage() {
    if (1 < currentPage) {
        previousBtn.removeClass('disabled');
        previousBtn.text('«  Previous');
    } else {
        previousBtn.addClass('disabled');
        previousBtn.text("Previous");
    }

    if (currentPage > 4) {
        $('.extra-pages').removeClass('display-none');
        $('.added-page').text(currentPage).attr('aria-label', `Page ${currentPage}`);
    } else {
        $('.extra-pages').addClass('display-none');
    }

    pages.removeClass('current');
    for(var i=0; i < pages.length; i++) {
        if(parseInt(pages[i].textContent) === currentPage) {
            pages[i].setAttribute("class", "current");
        } 
    }
    console.log(currentPage);
}
// pagination event listeners
pages.on("click", function(event) {
    event.preventDefault();
    
    for(var i=0; i < pages.length; i++) {
        var pagesText = pages[i].textContent;
        if(!isNaN(pagesText)) currentPage = parseInt($(this).text());
    }
    whatPage();
    newsAPI('coronavirus+covid-19', location, currentPage, 5);
})
previousBtn.on('click', (event) => {
    event.preventDefault();
    if (currentPage > 1) currentPage--;

    whatPage();

    newsAPI('coronavirus+covid-19', location, currentPage, 5);
})
nextBtn.on('click', (event) => {
    event.preventDefault();

    if (currentPage < 20) currentPage++;

    whatPage();

    newsAPI('coronavirus+covid-19', location, currentPage, 5);
})


function submitSearch() {
    var location = $('#user-location-search').val();
    locationEncoded = encodeURIComponent(location);

    dataDiv.parent().removeClass('display-none');
    newsDiv.parent().removeClass('display-none');
    newsAPI('coronavirus+covid-19', locationEncoded, 1, 5);
    coronadataAPI(location);
}

$('#submit-button').on("click", function(event) {
    event.preventDefault();
    submitSearch();
});

$("#user-location-search").keypress(function(e) {
    if(e.which == 13) {
        e.preventDefault();
        $("#submit-button").click();
    }
});