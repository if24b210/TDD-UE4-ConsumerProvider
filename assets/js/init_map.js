// Initialisierung der Leaflet-Karte und Layergruppen
// Popup für Parkdaten
window.generatePopupContent = function (props) {
    // Name ermitteln
    const name = props.ANL_NAME || props.NAME || props.PARK || '-';

    // Typ: entweder TYP_DETAIL oder aus Park-/Dog-Flags abgeleitet
    // Typ-Logik
    let type = props.TYP_DETAIL;
    if (type === 'Spielplatz') {
        type = 'Playground';
    } else if (type === 'Themenspielplatz') {
        type = 'Themed Playground';
    } else if (props.TYP === 'Hundezone') {
        type = 'Dog Zone';
    } else if (!type) {
        // Park oder Dog Park
        if (props.HUNDE_IM_PARK === 'Ja') type = 'Dog Park';
        else if (props.SPIELEN_IM_PARK === 'Ja') type = 'Playground';
        else type = 'Park';
    }

    // Adresse oder Bezirk
    let addr = '';
    if (props.ADRESSE) {
        addr = props.ADRESSE;
    } else if (props.BEZIRK) {
        addr = `District: ${props.BEZIRK}`;
    }

    return `
        <b>${name}</b><br>
        <b>Type:</b> ${type}<br>
        ${addr ? `<div>${addr}</div>` : ''}
    `;
};


// Leaflet-Karte initialisieren
const map = L.map('map', {
    center: [48.2082, 16.3738], // Wien Zentrum
    zoom: 12,
    zoomControl: true,
    attributionControl: true
});

// OpenStreetMap Layer hinzufügen
const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 19
});
baseLayer.addTo(map);

// Layergruppe für Parks
const parkLayerGroup = L.layerGroup().addTo(map);
// Layergruppe für Friedhöfe erst bei "checked"
const cemeteriesLayerGroup = L.layerGroup();    //.addTo(map);
// Layergruppe für Spielplätze erst bei "checked"
const playgroundLayerGroup = L.layerGroup();    //.addTo(map);

// Export der Karte und Layergruppe
window.map = map;
window.parkLayerGroup = parkLayerGroup;
window.cemeteriesLayerGroup = cemeteriesLayerGroup;
window.playgroundLayerGroup = playgroundLayerGroup;
