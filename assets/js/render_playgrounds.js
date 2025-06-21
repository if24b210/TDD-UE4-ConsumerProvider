// Spielplatz-Marker aus window.playgroundData basierend: TYP_DETAIL

// LayerGroup initialisieren (einmalig, global)
window.playgroundLayerGroup =
  window.playgroundLayerGroup || L.layerGroup().addTo(window.map);

function renderPlaygrounds() {
  if (!window.playgroundData) {
    console.warn("Playground-Daten nicht verfügbar.");
    return;
  }

  // Checkbox-Elemente
  const cbGeneral = document.getElementById("general-playgrounds"); // Checkbox für Spielplätze aktivieren, erst wenn General checkbox aktiviert ist
  const cbThemed = document.getElementById("themed-playgrounds"); // Checkbox für thematische Spielplätze
  const cbToddler = document.getElementById("toddler-playgrounds");
  const cbGenerational = document.getElementById("generational-playgrounds");
  const cbBall = document.getElementById("ball-playgrounds");
  const cbBallCage = document.getElementById("ball-cage-playgrounds");
  const cbForrest = document.getElementById("forrest-playgrounds");

  // Subfilter-Checkboxen sind aktiv, erst wenn General-Checkbox aktiviert ist
  const subFilterCheckboxes = [
    cbThemed,
    cbToddler,
    cbGenerational,
    cbBall,
    cbBallCage,
    cbForrest,
  ];

  subFilterCheckboxes.forEach((cb) => {
    if (cb) cb.disabled = !cbGeneral.checked;
  });

  // Vorherige Marker entfernen
  window.playgroundLayerGroup.clearLayers();

  // Wenn General-Checkbox nicht aktiviert, Layer entfernen und Funktion beenden
  if (!cbGeneral.checked) {
    window.map.removeLayer(window.playgroundLayerGroup);
    return;
  }

  // FILTER LOGIK
  // Checkboxen für weitere Filter
  // GeoJSON-Features filtern, Checkbox für thematische Spielplätze
  const filteredFeatures = window.playgroundData.features.filter((f) => {
    const typeDetail = f.properties.TYP_DETAIL;

    if (cbThemed.checked && typeDetail === "Themenspielplatz") return true;
    if (cbToddler.checked && typeDetail === "Kleinkinderspielplatz")
      return true;
    if (cbGenerational.checked && typeDetail === "Generationenspielplatz")
      return true;
    if (cbBall.checked && typeDetail === "Ballspielplatz") return true;
    if (cbBallCage.checked && typeDetail === "Ballspielkäfig") return true;

    // Wenn nichts ausgewählt ist, zeigen wir alles
    if (
      !cbThemed.checked &&
      !cbToddler.checked &&
      !cbGenerational.checked &&
      !cbBall.checked &&
      !cbBallCage.checked
    ) {
      return true; // General playground fallback
    }

    return false; // sonst ausfiltern
  });

  const fc = {
    // FeatureCollection für die gefilterten Spielplätze
    type: "FeatureCollection",
    features: filteredFeatures,
  };

  // GeoJSON-Layer mit Icons erstellen, Marker-Funktion
  const playgroundLayer = L.geoJSON(fc, {
    pointToLayer: (feature, latlng) => {
      // Marker-Funktion für alle Spielplätze
      // Je nach TYP_DETAIL des Spielplatzes wird ein anderes Icon gesetzt.
      // TODO: map_helpr.js anpassen, für unterschiedliche Icons
      const typeDetail = feature.properties.TYP_DETAIL;

      if (typeDetail === "Themenspielplatz")
        return window.createThemedPlaygroundMarker(latlng);
      if (typeDetail === "Kleinkinderspielplatz")
        return window.createToddlerPlaygroundMarker(latlng);
      if (typeDetail === "Generationenspielplatz")
        return window.createGenerationalPlaygroundMarker(latlng);
      if (typeDetail === "Ballspielplatz")
        return window.createBallPlaygroundMarker(latlng);
      if (typeDetail === "Ballspielkäfig")
        return window.createBallCagePlaygroundMarker(latlng);

      // Fallback: General Playground
      return window.createPlaygroundMarker(latlng);
    },
    // Popup-Informationen für jeden Spielplatz
    onEachFeature: (feature, layer) => {
      // 1) Popup registrieren
      layer.bindPopup(generatePopupContent(feature.properties));

      // 2) Klick: Side-Panel füllen & Popup öffnen
      layer.on("click", () => {
        showParkDetails(feature.properties);
        layer.openPopup();
      });
    },
  }).addTo(window.playgroundLayerGroup);

  // in die LayerGroup hinzufügen(zusammenpacken) und auf Karte
  window.playgroundLayerGroup.addLayer(playgroundLayer); // Playground-Layer zur LayerGroup hinzufügen
  window.playgroundLayerGroup.addTo(window.map); // LayerGroup zur Karte hinzufügen
}

// Event-Listener für Checkboxen
const allFilters = [
  "general-playgrounds",
  "themed-playgrounds",
  "toddler-playgrounds",
  "generational-playgrounds",
  "ball-playgrounds",
  "ball-cage-playgrounds",
];

allFilters.forEach((id) => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("change", renderPlaygrounds);
});
// Optionaler Marker
//window.createPlaygroundMarker = function (latlng);
