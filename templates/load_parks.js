// templates/load_parks.js

const onlineUrl = 'https://data.wien.gv.at/daten/geo?service=WFS&request=GetFeature&version=1.1.0&typeName=ogdwien:PARKINFOOGD&srsName=EPSG:4326&outputFormat=json';
const localUrl = '../data/PARKINFOOGD.json';

async function loadParkData() {
    const loadInfo = document.getElementById('loadInfo');

    try {
        const response = await fetch(onlineUrl);

        if (!response.ok) {
            throw new Error('Online-Daten konnten nicht geladen werden');
        }

        const data = await response.json();
        console.log('Online-Daten geladen:', data);

        loadInfo.innerText = 'Parks erfolgreich online geladen';
        window.parksData = data; // Nur speichern, NICHT anzeigen

    } catch (error) {
        console.error('Fehler beim Laden der Online-Daten, versuche lokale Datei:', error);

        try {
            const response = await fetch(localUrl);
            const data = await response.json();
            console.log('Lokale Datei geladen:', data);

            loadInfo.innerText = 'Online fehlgeschlagen, lokale Datei geladen';
            window.parksData = data; // Nur speichern

        } catch (fallbackError) {
            console.error('Fehler beim Laden der lokalen Datei:', fallbackError);
            loadInfo.innerText = 'Fehler: Konnte keine Parkdaten laden';
        }
    }
}

// Start
loadParkData();
