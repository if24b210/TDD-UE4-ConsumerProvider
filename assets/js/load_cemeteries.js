/*
Diese JS-Datei lädt die GeoJSON-Daten für Friedhöfe und speichert sie in window.cemeteriesLayerGroup
und window.cemeteriesLayer
Die Daten werden von der URL geladen, die in der Konstante CEMETERIES_URL definiert ist
Die Daten werden in einem Layer gespeichert, der auf der Karte angezeigt werden kann
*/

// Die URL ist eine WFS-Anfrage an die Stadt Wien, die GeoJSON-Daten für Friedhöfe zurückgibt(online und local)
const cemeteriesUrlOnline =
  "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:FRIEDHOFOGD&srsName=EPSG:4326&outputFormat=json";
const cemeteriesUrlLocal = "../data/FREIDHOFOGD.json";

// Layergruppe für Friedhöfe
async function loadCemeteries() {
  try {
    const response = await fetch(cemeteriesUrlOnline);
    if (!response.ok) throw new Error("Online-Daten nicht erreichbar");

    const data = await response.json();
    console.log("Cemeteries: Online-Daten geladen", data);

    window.cemeteriesData = data;

    renderCemeteries(data);
  } catch (error) {
    console.warn(
      "Cemeteries: Fehler beim Laden der Online-Daten, versuche lokale Datei...",
      error
    );

    try {
      const response = await fetch(cemeteriesUrlLocal);
      if (!response.ok) throw new Error("Lokale Datei nicht gefunden");

      const data = await response.json();
      console.log("Cemeteries: Lokale Datei geladen", data);

      window.cemeteriesData = data;

      renderCemeteries(data);
    } catch (fallbackError) {
      console.error(
        "Cemeteries: Fehler beim Laden der lokalen Datei",
        fallbackError
      );
    }
  }
}

// Funktion zur Anzeige der Marker auf der karte
function renderCemeteries(geojsonData) {
  const cemeteryLayer = L.geoJSON(geojsonData, {
    pointToLayer: (feature, latlng) => createCemeteryMarker(latlng),
    onEachFeature: (feature, layer) => {
      const name = feature.properties.NAME || "Cemetery";
      const address = feature.properties.ADRESSE || "";
      const id = feature.properties.ID;
      const popupHtml = `<b>${name}</b><br>${address}`;
      layer.bindPopup(popupHtml);

      layer.on("click", () => {
        const coords = feature.geometry.coordinates; // [lng, lat]
        localStorage.setItem("park-name", name);
        localStorage.setItem("park-coordinates", JSON.stringify([coords[1], coords[0]])); // lat, lng
        localStorage.setItem("park-type", "Friedhof");  // Typ des Parks
      })
    },
  });

  window.cemeteriesLayerGroup.clearLayers(); // Vorherige Marker entfernen
  window.cemeteriesLayerGroup.addLayer(cemeteryLayer); // Neue Marker hinzufügen

  // Nur wenn Checkbox aktiv ist "checked", dann die Marker anzeigen
  const cemeteriesCheckbox = document.getElementById("cemeteries");
  if (cemeteriesCheckbox && cemeteriesCheckbox.checked) {
    window.cemeteriesLayerGroup.addTo(window.map);
  } else {
    window.map.removeLayer(window.cemeteriesLayerGroup);
  }
}

loadCemeteries();
