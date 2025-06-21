// Hilfsfunktionen	- Erstelle Marker in bestimmter Farbe

// Erstelle Standard Marker(blau)
window.createDefaultMarker = function (latlng) {
  return L.marker(latlng);
}

// Grüner Marker für Parks
// TODO: Ersetze später durch 'assets/images/icons/figma-park.svg'
window.createGreenMarker = function (latlng) {
  const parkIcon = new L.Icon({
    iconUrl: 'assets/images/figma-park.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25],
  });

  return L.marker(latlng, { icon: parkIcon });
};

// Hunde Marker für Hundewiesen
// TODO: Ersetze später durch 'assets/images/icons/figma-dog.svg'
window.createDogMarker = function (latlng) {
  const dogIcon = new L.Icon({
    iconUrl: "assets/images/figma-dog.png",
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25],
  });
  return L.marker(latlng, { icon: dogIcon });
};


// Grauer Marker für Friedhöfe(lokales Icon)
window.createCemeteryMarker = function (latlng) {
  const cemeteryIcon = new L.Icon({
    iconUrl: 'assets/images/friedhof.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25]
  });

  return L.marker(latlng, { icon: cemeteryIcon });
};


// Marker für Spielplätze, standard for option of playgrounds
// TODO: Ersetze später durch 'assets/images/icons/figma-playground.svg'
window.createGenericPlaygroundMarker = function (latlng) {
  const icon = new L.Icon({
    iconUrl: 'assets/images/figma-playground.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [1, -25]
  });

  return L.marker(latlng, { icon: icon });
};

// Spielplatz-Varianten (aktuell identisch, später individuell ersetzbar)
window.createPlaygroundMarker = createGenericPlaygroundMarker;                   // TODO: figma-playground.svg
window.createThemedPlaygroundMarker = createGenericPlaygroundMarker;            // TODO: figma-themed-playground.svg
window.createToddlerPlaygroundMarker = createGenericPlaygroundMarker;           // TODO: figma-toddler-playground.svg
window.createGenerationalPlaygroundMarker = createGenericPlaygroundMarker;      // TODO: figma-generational-playground.svg
window.createBallPlaygroundMarker = createGenericPlaygroundMarker;              // TODO: figma-ball-playground.svg
window.createBallCagePlaygroundMarker = createGenericPlaygroundMarker;          // TODO: figma-cage-playground.svg
window.createForrestPlaygroundMarker = createGenericPlaygroundMarker;           // TODO: figma-forrest-playground.svg

window.createMarkerByCategory = function (category, coords) {
  const cat = category?.toLowerCase();
  if (!cat) return createGreenMarker(coords);

  if (cat.includes("dog")) return createDogMarker(coords);
  if (cat.includes("friedhof") || cat.includes("cemetery")) return createCemeteryMarker(coords);
  if (cat.includes("spielplatz") || cat.includes("playground")) return createPlaygroundMarker(coords);
  return createGreenMarker(coords); // fallback
};