/*Created by Florian Gossye for FabLab Factory*/
var Latitude = undefined;
var Longitude = undefined;
var mapOptions;
var request;
var map;
var latlong;
var latlong2;
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
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

}
// Setting map
function getMap(latitude, longitude) {
    latLong = new google.maps.LatLng(latitude, longitude);
    latLong2 = new google.maps.LatLng(latitude + 0.003, longitude);

    mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Map Object & Directions Object
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    console.log("Map is set");
    //Requesting direction Service
    /*
    var markerA = new google.maps.Marker({
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: latLong
    });
    var markerB = new google.maps.Marker({
        draggable: true,
        animation: google.maps.Animation.DROP,
        position: latLong2
    });
    markerA.setMap(map);
    markerB.setMap(map);
*/
    //Creating & displaying directions
    console.log("requesting directions");
    var request = {
        origin: latLong,
        destination: latLong2,
        travelMode: 'WALKING'
    };

    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);
        }
    });
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    console.log("directions set");
}
// Success callback for watching your changing position
var onMapWatchSuccess = function (position) {

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
