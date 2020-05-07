var responseData;
var dataDiv = $('#data-div');
var newsDiv = $('#news-div');
var currentPage = 1;

function newsAPI(search, location, page, resultsPerPage) {
    console.log(location);
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
    console.log(location);
    var apiKey = '0c106cd7b1mshb071f2da45d3a0bp1c8a53jsnf62a5d04035a'
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
        var contentTwo = `Cases in ${location} as a percentage of world cases:  ${(parseFloat(country_cases.replace(",","")) / parseFloat(world_cases.replace(",","")) * 100).toFixed(2)}%`;
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
var pages = $('li');
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
            pages[i].classList.add('current');
        } 
    }
    console.log(currentPage);
}
// pagination event listeners
$('.numbered-page').on('click', function(event) {
    event.preventDefault();

    currentPage = parseInt($(this).text());

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

// Search submission event listeners
function submitSearch() {
    var location = $('#user-location-search').val();
    locationEncoded = encodeURIComponent(location);

    dataDiv.parent().removeClass('display-none');
    newsDiv.parent().removeClass('display-none');
    newsAPI('coronavirus+covid-19', locationEncoded, 1, 5);
    coronadataAPI(location);

    $('#disclaimer').attr('style', 'margin: 0rem 3rem; padding: 1rem')

}

$('#submit-button').on('click', function(event) {
    event.preventDefault();
    submitSearch();
});

$("#user-location-search").keypress(function(e) {
    if(e.which == 13) {
        e.preventDefault();
        $("#submit-button").click();
    }
});