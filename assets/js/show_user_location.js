// zeigt den Standort des Benutzers auf der Karte an
// und zentriert die Karte darauf. Wenn der Benutzer seinen Standort nicht freigibt,
// wird eine Fehlermeldung angezeigt.
// importiert den Standardmarker aus der Datei map_helper.js
// Parameter : map-> function is encapsulated in a Promise to handle asynchronous geolocation

function getUserLocation(map = null) {  // get user location and update map view
    return new Promise((resolve, reject) => { // Promise to handle geolocation
        if (!navigator.geolocation) {
            alert('Geolocation will not work in this browser.');
            //console.error('Geolocation is not supported by this browser.');
            reject('Geolocation not supported!');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            position => {

                const coords = [position.coords.latitude, position.coords.longitude];
                //console.log('User coordinates:', coords);

                // Save user coordinates in localStorage
                localStorage.setItem("user-coordinates", JSON.stringify(coords));

                if (map && typeof createDefaultMarker === 'function') {
                    const userMarker = createDefaultMarker(coords).addTo(map);  // Create a marker at user coordinates
                    userMarker.bindPopup('You are here!').openPopup();

                    map.setView(coords, 14);    // Set map view to user coordinates
                }
                resolve(coords); // Resolve with user coordinates
            },
            error => {
                // Handle errors
                let errMessage;

                // Set error messages based on the error code
                // https://developer.mozilla.org/en-US/docs/Web/API/PositionError
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        errMessage = 'User denied the request for Geolocation.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        errMessage = 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        errMessage = 'The request to get user location timed out.';
                        break;
                    case error.UNKNOWN_ERROR:
                        errMessage = 'An unknown error occurred.';
                        break;
                    default:
                        errMessage = 'An unexpected error occurred.';
                        break;
                }

                if (error.code != error.PERMISSION_DENIED) {
                    console.error('Error message:', errMessage);
                }
                alert(errMessage + ' \n\nDefault location will be shown.');

                // Optional Fallback - Default koorinates 
                const defaultLatLng = [48.2082, 16.3738];   // Vienna Center coordinates

                // Save default coordinates in localStorage
                localStorage.setItem("user-coordinates", JSON.stringify(defaultLatLng));


                if (map && typeof createDefaultMarker === 'function') {
                    const defaultMarker = createDefaultMarker(defaultLatLng).addTo(map);
                    defaultMarker.bindPopup('Default Location: Vienna Center').openPopup(); //

                    map.setView(defaultLatLng, 14); // default view
                }

                resolve(defaultLatLng); // Resolve with default coordinates
            },
            {
                enableHighAccuracy: true, // Use high accuracy if available
                timeout: 10000, // 10 seconds
                maximumAge: 0 // Do not use cached position 
            }
        );
    });
}

function removeUserMarker() {
    if (userMarker && map) {
        map.removeLayer(userMarker);
        userMarker = null;
    }
}

// Export global : function for use in other scripts
window.getUserLocation = getUserLocation;
window.removeUserMarker = removeUserMarker;
