const map = L.map('map').setView([48.2082, 16.3738], 17); // Wien-Zentrum
// Zoom factor: 17

// Grundkarte
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// GeoJSON Grünflächen laden
fetch('https://www.data.gv.at/katalog/api/3/action/package_show?id=d0145df8-7f6d-46e1-9bc6-ee7897054104')
    .then(response => response.json())
    .then(data => {
        const geojsonUrl = data.result.resources.find(r => r.format === "GeoJSON").url;
        return fetch(geojsonUrl);
    })
    .then(response => response.json())
    .then(geojsonData => {
        L.geoJSON(geojsonData).addTo(map);
    })
    .catch(error => console.error('Fehler beim Laden der Daten:', error));

// Geolocation: Zeige aktuellen Standort, wenn erlaubt  // PIN - your own ort
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        position => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;

            // Marker auf aktuelle Position
            const marker = L.marker([userLat, userLng]).addTo(map);
            marker.bindPopup('You are here').openPopup();

            // Karte auf aktuellen Standort zentrieren
            map.setView([userLat, userLng], 14);
        },
        error => {
            console.warn('Geolocation fehlgeschlagen oder abgelehnt:', error.message);
            // Optional: Fallback bleibt Wien-Zentrum
        }
    );
} else {
    console.warn('Geolocation wird von diesem Browser nicht unterstützt.');
}