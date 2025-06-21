// zeigt den Standort des Benutzers auf der Karte an
// und zentriert die Karte darauf. Wenn der Benutzer seinen Standort nicht freigibt,
// wird eine Fehlermeldung angezeigt.
// importiert den Standardmarker aus der Datei map_helper.js



function showUserLocation() {
    if (!navigator.geolocation) {
        alert('Geolocation will not work in this browser.');
        console.error('Geolocation is not supported by this browser.');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            const userMarker = createDefaultMarker([lat, lng]).addTo(window.map);
            userMarker.bindPopup('You are here!').openPopup();

            window.map.setView([lat, lng], 14);
        },
        function (error) {
            // Handle errors
            let errMessage;

            // Set appropriate error messages based on the error code
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
            }

            if (error.code != error.PERMISSION_DENIED) {
                console.error('Error message:', errMessage);
            }
            alert(errMessage + ' \n\nDefault location will be shown.');

            // Optional Fallback - Default koorinates 
            const defaultLatLng = [48.2082, 16.3738];   // Vienna Center coordinates

            // Show a default marker if geolocation fails
            const defaultMarker = createDefaultMarker(defaultLatLng).addTo(window.map);
            defaultMarker.bindPopup('Default Location: Vienna Center').openPopup();

            window.map.setView(defaultLatLng, 14); // default view
        },
        {
            enableHighAccuracy: true, // Use high accuracy if available
            timeout: 10000, // 10 seconds
            maximumAge: 0 // Do not use cached position 
        }
    );
}

showUserLocation();
