// Hilfsfunktionen	- Erstelle Marker in bestimmter Farbe

// Erstelle Standard Marker(blau)
window.createDefaultMarker = function (latlng) {
    return L.marker(latlng);
}

// Grüner Marker für Parks
window.createGreenMarker = function (latlng) {
    const greenIcon = new L.Icon({
        iconUrl: 'https://cdn.jsdelivr.net/gh/pointhi/leaflet-color-markers/img/marker-icon-green.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return L.marker(latlng, { icon: greenIcon });
}

// Grauer Marker für Friedhöfe(lokales Icon)
window.createCemeteryMarker = function (latlng) {
    const cemeteryIcon = new L.Icon({
        iconUrl: '../assets/images/friedhof.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });

    return L.marker(latlng, { icon: cemeteryIcon });
}

// Marker für Spielplätze 
window.createPlaygroundMarker = function (latlng) {
    const icon = new L.Icon({
        iconUrl: '../assets/images/spielplatzogd.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });

    return L.marker(latlng, { icon: icon });
};

window.createThemedPlaygroundMarker = function (latlng) {
    const icon = new L.Icon({
        iconUrl: '../assets/images/spielplatzogd.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });
    return L.marker(latlng, { icon: icon });
};

window.createToddlerPlaygroundMarker = function (latlng) {
    const icon = new L.Icon({
        iconUrl: '../assets/images/spielplatzogd.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });
    return L.marker(latlng, { icon: icon });
};

window.createGenerationalPlaygroundMarker = function (latlng) {
    const icon = new L.Icon({
        iconUrl: '../assets/images/spielplatzogd.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });
    return L.marker(latlng, { icon: icon });
};

window.createBallPlaygroundMarker = function (latlng) {
    const icon = new L.Icon({
        iconUrl: '../assets/images/spielplatzogd.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });
    return L.marker(latlng, { icon: icon });
};

window.createBallCagePlaygroundMarker = function (latlng) {
    const icon = new L.Icon({
        iconUrl: '../assets/images/spielplatzogd.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });
    return L.marker(latlng, { icon: icon });
};

window.createForrestPlaygroundMarker = function (latlng) {
    const icon = new L.Icon({
        iconUrl: '../assets/images/spielplatzogd.png',
        iconSize: [25, 25],
        iconAnchor: [12, 25],
        popupAnchor: [1, -25]
    });
    return L.marker(latlng, { icon: icon });
};