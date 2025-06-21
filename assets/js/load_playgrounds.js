// Die Datei lädt die GeoJSON-Daten für Spielplätze (inkl. TYP_DETAIL)
// und speichert sie in window.playgroundData.

const playgroundsUrlOnline =
  "https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:SPIELPLATZPUNKTOGD&srsName=EPSG:4326&outputFormat=json";
const playgroundsUrlLocal = "../data/SPIELPLATZPUNKTOGD.json";

async function loadPlaygrounds() {
  try {
    const response = await fetch(playgroundsUrlOnline);
    if (!response.ok) throw new Error("Online-Daten nicht erreichbar");

    const data = await response.json();
    console.log("Playgrounds: Online-Daten geladen", data);

    window.playgroundData = data;
    renderPlaygrounds();
  } catch (error) {
    console.warn(
      "Playgrounds: Fehler beim Laden der Online-Daten, versuche lokale Datei...",
      error
    );

    try {
      const response = await fetch(playgroundsUrlLocal);
      if (!response.ok) throw new Error("Lokale Datei nicht gefunden");

      const data = await response.json();
      console.log("Playgrounds: Lokale Datei geladen", data);

      window.playgroundData = data;
      renderPlaygrounds();
    } catch (fallbackError) {
      console.error(
        "Playgrounds: Fehler beim Laden der lokalen Datei",
        fallbackError
      );
    }
  }
}

loadPlaygrounds();
// renderPlaygrounds();    // Spielplätze auf der Karte anzeigen
