$(document).ready(function() {

var latitude;
var longitude;
// Grab the user's lat and lon from the browser
function getLocation() {
  if (navigator.geolocation) {
    locationRaw = navigator.geolocation.getCurrentPosition(getPosition, showError);
    
  } else { 
    $('#user-search-location').parent().parent().append('Cound not determine location automatically, please search your country above.')
    locationRaw = $("#user-search-location").val();
  }
}
function showError(error) {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      $('#user-search-location').parent().parent().append('Cound not determine location automatically, please search your country above.')
      break;
    case error.POSITION_UNAVAILABLE:
      $('#user-search-location').parent().parent().append('Cound not determine location automatically, please search your country above.')
      break;
    case error.TIMEOUT:
      $('#user-search-location').parent().parent().append('Cound not determine location automatically, please search your country above.')
      break;
    case error.UNKNOWN_ERROR:
      $('#user-search-location').parent().parent().append('Cound not determine location automatically, please search your country above.')
      break;
  }
}
function getPosition(position) {
  latitude = position.coords.latitude; 
  longitude = position.coords.longitude;
  console.log(latitude, longitude);
  var location;
  
  var apikey = '040ef5207f5349aa9cd479ce16ccd1a0';
  var queryURL = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}%2C${longitude}&key=${apikey}`;
  function reverseGeocode() {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response);
        console.log(queryURL);
        console.log(response.results[0].components.country);
        var country = response.results[0].components.country;
        console.log(country);
        if (country === "United States of America") {
          location = "United States";
        } else {
          location = country;
        }
        console.log(location);
        function submitSearch() {
          console.log(location);
          locationEncoded = encodeURIComponent(location);
        
          dataDiv.parent().removeClass('display-none');
          newsDiv.parent().removeClass('display-none');
          newsAPI('coronavirus+covid-19', locationEncoded, 1, 5);
          coronadataAPI(location);
        
          $('#disclaimer').attr('style', 'margin: 0rem 3rem; padding: 1rem')
        }
        submitSearch();

        // Error handling
        if (response.status == 200) { 
            // Success!
            console.log(response.responseText);
        
        } else if (response.status <= 500) { 
            // We reached our target server, but it returned an error
                                  
            console.log("unable to geocode! Response code: " + response.status);
            var data = JSON.parse(response.responseText);
            console.log(data.status.message);
        } else {
            console.log("server error");
        }
          
		response.onerror = function() {
			// There was a connection error of some sort
			console.log("unable to connect to server");        
		};
          

    });
  }
  reverseGeocode();
}
getLocation();

})