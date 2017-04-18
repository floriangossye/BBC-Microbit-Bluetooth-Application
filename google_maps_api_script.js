/*Created by Florian Gossye for FabLab Factory*/
var Latitude;
var Longitude;
var mapOptions;
var request;
var map;
var newPoint;
var markerA
var latlong;
var address;
var directionsJSON;
var jsonResult;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var geocoder = new google.maps.Geocoder();
var destination;

window.onload = getMap, autoUpdate();

// Get geo coordinates & call location
function getMapLocation() {
    navigator.geolocation.getCurrentPosition(onMapSuccess, onMapError, {
        enableHighAccuracy: true //Highest Gps accuracy
    });
    console.log("Initialising map");
}
// Success callback for get geo coordinates
var onMapSuccess = function (position) {
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    getMap(Latitude, Longitude);
    autoUpdate();
    geocodeAddress();
    createDirections();
}


//Update userTracker
function autoUpdate() {
    navigator.geolocation.getCurrentPosition(function (position) {
        newPoint = new google.maps.LatLng(position.coords.latitude,
            position.coords.longitude);
        if (markerA) {
            // Marker already created - Move it
            markerA.setPosition(newPoint);
        } else {
            // Marker does not exist - Create it
            markerA = new google.maps.Marker({
                position: newPoint,
                map: map
            });
        }
        // Center the map on the new position
        map.setCenter(newPoint);
    });
    // Call the autoUpdate() millisecond
    setTimeout(autoUpdate, 100);
}

// Setting map,geocode directions & display directions
function getMap(latitude, longitude) {
    latLong = new google.maps.LatLng(latitude, longitude);
    mapOptions = {
        center: latLong,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.TERRAIN
    };
    //Map Object & Directions Object
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log("Map is set");
}
//Geocode Adress
function geocodeAddress() {
    address = document.getElementById("address").value;
    console.log("Initialise geocoding");
    geocoder.geocode({
        'address': address
    }, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latGeo = results[0].geometry.location.lat();
            var longGeo = results[0].geometry.location.lng();
            destination = new google.maps.LatLng(latGeo, longGeo);
            console.log(destination);
        }
    });
    console.log("geocode finished")
}
//Creating & displaying directions
function createDirections() {
    console.log("requesting directions");
    var request = {
        origin: newPoint,
        destination: destination,
        travelMode: 'BICYCLING'
    };
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);
            jsonResult = JSON.stringify(result, null, "    ");
            console.log(jsonResult);
        }
    });
    directionsDisplay = new google.maps.DirectionsRenderer({
        draggable: true
        

    });
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById('right-panel'));
    autoUpdate();
    console.log("directions set");
}

// Success callback for watching your changing position
var onMapWatchSuccess =
    function (position) {

        var updatedLatitude = position.coords.latitude;
        var updatedLongitude = position.coords.longitude;

        if (updatedLatitude != Latitude && updatedLongitude != Longitude) {
            Latitude = updatedLatitude;
            Longitude = updatedLongitude;
            getMap(updatedLatitude, updatedLongitude);
        }
    }
// Error callback
function onMapError(error) {
    console.log('code: ' + error.code + '\n' +
        'message: ' + error.message + '\n');
}
// Watch your changing position
function watchMapPosition() {
    return navigator.geolocation.watchPosition(onMapWatchSuccess, onMapError, {
        enableHighAccuracy: true
    });
}
