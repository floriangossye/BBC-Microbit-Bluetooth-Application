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
        console.log("whut");
    });
}
// Success callback for get geo coordinates
var onMapSuccess = function (position) {
    Latitude = position.coords.latitude;
    Longitude = position.coords.longitude;
    getMap(Latitude, Longitude);

}
// setting map
function getMap(latitude, longitude) {
    latLong = new google.maps.LatLng(latitude, longitude);
    latLong2 = new google.maps.LatLng(latitude + 0.002, longitude);

    mapOptions = {
        center: new google.maps.LatLng(latitude, longitude),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    //Map Object & Directions Object
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
    //Requesting direction Service
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
    request = {
        origin: latlong,
        destination: latlong2,
        travelMode: 'WALKING'
    };

    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsService.route(request, function (result, status) {
        if (status == 'OK') {
            directionsDisplay.setDirections(result);

        }
    });
}
//Setting 2 markers


//Animation function
function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}

// Success callback for watching your changing position
var onMapWatchSuccess = function (position) {

    var updatedLatitude = position.coords.latitude;
    var updatedLongitude = position.coords.longitude;

    if (updatedLatitude != Latitude && updatedLongitude != Longitude) {

        Latitude = updatedLatitude;
        Longitude = updatedLongitude;

        getMap(updatedLatitude, updatedLongitude);
        setMarker(updatedLatitude, updatedLongitude);
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
