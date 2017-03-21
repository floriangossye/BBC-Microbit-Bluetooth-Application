/**
 * Object that holds application data and functions.
 */
var app = {};

/**
 * Timeout (ms) after which a message is shown if the Microbit wasn't found.
 */
app.CONNECT_TIMEOUT = 3000;

/**
 * Object that holds Microbit UUIDs.
 */
app.microbit = {};

app.microbit.LED_SERVICE = 'e95dd91d-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_BITMAP = 'e95d7b77-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_TEXT = 'e95d93ee-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_TEXT_SPEED = 'e95d0d2d-251d-470a-a062-fa1922dfa9a8';
app.microbit.LED_SCROLL = 'E95D0D2D-251D-470A-A062-FA1922DFA9A8'
app.microbit.ACCEL_SRV = 'E95D0753-251D-470A-A062-FA1922DFA9A8'
app.microbit.ACCEL_DATA = 'E95DCA4B-251D-470A-A062-FA1922DFA9A8'
app.microbit.ACCEL_PERIOD = 'E95DFB24-251D-470A-A062-FA1922DFA9A8'


var BLE_NOTIFICATION_UUID = '00002902-0000-1000-8000-00805f9b34fb';
/**
 * Initialise the application.
 */
app.initialize = function () {
    document.addEventListener(
        'deviceready',
        function () {
            evothings.scriptsLoaded(app.onDeviceReady)
        },
        false);
}

function onConnect(context) {
    console.log("Client Connected");
    console.log(context);
}

app.onDeviceReady = function () {
    app.showInfo('Activate the Microbit and tap Start.');
}

app.showInfo = function (info) {
    document.getElementById('Status').innerHTML = info;
}

app.onStartButton = function () {
    app.onStopButton();
    app.startScan();
    app.showInfo('Status: Scanning...');
    app.startConnectTimer();
}

app.onStopButton = function () {
    // Stop any ongoing scan and close devices.
    app.stopConnectTimer();
    evothings.easyble.stopScan();
    evothings.easyble.closeConnectedDevices();
    app.showInfo('Status: Stopped.');
}

app.startConnectTimer = function () {
    // If connection is not made within the timeout
    // period, an error message is shown.
    app.connectTimer = setTimeout(
        function () {
            app.showInfo('Status: Scanning... ' +
                'Please start the Microbit.');
        },
        app.CONNECT_TIMEOUT)
}

app.stopConnectTimer = function () {
    clearTimeout(app.connectTimer);
}

app.startScan = function () {
    evothings.easyble.startScan(
        function (device) {
            // Connect if we have found an Microbit.
            if (app.deviceIsMicrobit(device)) {
                app.showInfo('Status: Device found: ' + device.name + '.');
                evothings.easyble.stopScan();
                app.connectToDevice(device);
                app.stopConnectTimer();
            }
        },
        function (errorCode) {
            app.showInfo('Error: startScan: ' + errorCode + '.');
        });
}

app.deviceIsMicrobit = function (device) {
    console.log('device name: ' + device.name);
    return (device != null) &&
        (device.name != null) &&
        ((device.name.indexOf('MicroBit') > -1) ||
            (device.name.indexOf('micro:bit') > -1));
};

/**
 * Read services for a device.
 */
app.connectToDevice = function (device) {
    app.showInfo('Connecting...');
    device.connect(
        function (device) {
            app.showInfo('Status: Connected - reading Microbit services...');
            app.readServices(device);
        },
        function (errorCode) {
            app.showInfo('Error: Connection failed: ' + errorCode + '.');
            evothings.ble.reset();
        });
}

app.readServices = function (device) {
    device.readServices(
		[app.microbit.LED_SERVICE],
        function (device) {
            app.showInfo('Connection established. Ready for input.');
            app.device = device;
        },
        function (errorCode) {
            console.log('Error: Failed to read services: ' + errorCode + '.');
        });
}

app.writeCharacteristic = function (device, ledUUID, value) {
    device.writeCharacteristic(
        ledUUID,
        new Uint8Array(value),
        function () {
            console.log('writeCharacteristic ' + ledUUID + ' ok.');
        },
        function (errorCode) {
            console.log('Error: writeCharacteristic: ' + errorCode + '.');
        });
}
app.printLeft = function () {
    //console.log(device.model);
    app.writeCharacteristic(app.device, app.microbit.LED_BITMAP, evothings.ble.toUtf8("bdhdb"));
    /* . . . # .
	                                                                                                 . . # . .
																									 . # . . .
																									 . . # . .
																									 . . . # . */
}
app.printRight = function () {
    //console.log(device.model);
    app.writeCharacteristic(app.device, app.microbit.LED_BITMAP, evothings.ble.toUtf8("hdbdh"));
    /* . # . . .
	                                                                                                    . . # . .
																									    . . . # .
																									    . . # . .
																									    . # . . . */
}
app.printUp = function () {
    //console.log(device.model);
    app.writeCharacteristic(app.device, app.microbit.LED_BITMAP, evothings.ble.toUtf8(" djq"));
    /* . . . . .
	                                                                                                    . . # . .
																									    . # . # .
																									. . . . .  */
}

app.value = function (elementId, value) {
    document.getElementById(elementId).innerHTML = value;
}

/**
 * print gpsLocation with an alert
 */
app.printLocation = function () {
    var onSuccess = function (position) {
        alert('Latitude: ' + position.coords.latitude + '\n' +
            'Longitude: ' + position.coords.longitude + '\n' +
            'Altitude: ' + position.coords.altitude + '\n' +
            'Accuracy: ' + position.coords.accuracy + '\n' +
            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
            'Heading: ' + position.coords.heading + '\n' +
            'Speed: ' + position.coords.speed + '\n' +
            'Timestamp: ' + position.timestamp + '\n');
    };

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    console.log("succes");
}
/**
 * print longitude & latitude of current position 
 */
app.getLocation = function () {
    function onSuccess(position) {
        var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude: ' + position.coords.latitude + '<br />' +
            'Longitude: ' + position.coords.longitude + '<br />' +
            '<hr />' + element.innerHTML;
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    }

    // Options: throw an error if no update is received every 30 seconds.
    //
    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, {
        timeout: 5000,
        enableHighAccuracy: true
    });
    console.log("succes");
}

  

// Initialize the app.
app.initialize();
