var map;
var currentCoords = {};

//function to call the user's geolocation using HTML5 Geolocation API
function displayLocation(position) {
  var latitude = position.coords.latitude;
  var longitude = position.coords.longitude;

  showMap(position.coords);
}

//showMap function to display the map
function showMap(coords) {
  var directionsRenderer = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();

  currentCoords.latitude = coords.latitude;
  currentCoords.longitude = coords.longitude;
  //get latlng from Geolocation
  var googleLatLong = new google.maps.LatLng(
    parseFloat(coords.latitude),
    parseFloat(coords.longitude)
  );
  //map options
  var mapOptions = {
    zoom: 13,
    center: googleLatLong,
    mapTypeId: "roadmap",
  };
  //insert map to HTML
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  //place new marker at the user location
  var marker = new google.maps.Marker({ map: map, position: googleLatLong });

  directionsRenderer.setMap(map);
  directionsRenderer.setPanel(document.getElementById("right-panel"));

  var control = document.getElementById("floating-panel");
  control.style.display = "block";
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);

  var onChangeHandler = function () {
    calculateAndDisplayRoute(directionsService, directionsRenderer);
  };
  document.getElementById("start").addEventListener("change", onChangeHandler);
  document.getElementById("end").addEventListener("change", onChangeHandler);
}

//function to calculate start and end driving directions
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
  var start = document.getElementById("start").value;
  var end = document.getElementById("end").value;
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: "DRIVING",
    },
    function (response, status) {
      if (status === "OK") {
        directionsRenderer.setDirections(response);
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );

  showData();

  function showData() {
    if (navigator.storage && navigator.storage.persist)
      navigator.storage.persisted().then((persistent) => {
        if (persistent)
          console.log(
            "Storage will not be cleared except by explicit user action"
          );
        else
          console.log(
            "Storage may be cleared by the UA under storage pressure."
          );
      });

    event.preventDefault();

    localStorage.setItem("startData", start);
    localStorage.setItem("endData", end);

    var sData = localStorage.getItem("startData");
    var eData = localStorage.getItem("endData");

    //var sObject = JSON.parse(sData);
    //var eObject = JSON.parse(eData);
  }
}

//function to display errors
function displayError(error) {
  var errors = [
    "Unknown error",
    "Permission denied by user",
    "Position not available",
    "Timeout error",
  ];
  var message = errors[error.code];
  console.warn("Error in getting your location: " + message, error.message);
}

//function to authorize HTML5 geolocation and call additional functions
window.onload = function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(displayLocation, displayError);
  } else {
    alert("Sorry, this browser doesn't support geolocation!");
  }
};

function saveData() {
  var startObject = document.getElementById("start");
  var endObject = document.getElementById("end");

  startObject.addEventListener("click", showData, false);
  endObject.addEventListener("click", showData, false);
}

function showData() {
  localStorage.setItem("startData", JSON.stringify(startObject));
  localStorage.setItem("endData", JSON.stringify(endObject));

  var sData = localStorage.getItem("startData");
  var eData = localStorage.getItem("endData");

  var sObject = JSON.parse(sData);
  var eObject = JSON.parse(eData);
}
