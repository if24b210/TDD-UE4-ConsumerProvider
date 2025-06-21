// Helper: Ja/Nein übersetzen
function translateYesNo(val) {
    if (val === 'Ja') return 'Yes';
    if (val === 'Nein') return 'No';
    return val;
}

/*
// Hilfsfunktion, um den Park-Typ zu bestimmen: Park, Dog Park, Playground
function getTypeForFeature(props) {
    if (props.HUNDE_IM_PARK === 'Ja') return 'Dog Park';
    if (props.SPIELEN_IM_PARK === 'Ja') return 'Playground';
    return 'Park';
}
*/


// DOM ->  Elemente für die Park-Details
const detailsEl = document.getElementById('parkDetails');
const nameEl = document.getElementById('parkName');
const addrEl = document.getElementById('parkAddress');
const typeEl = document.getElementById('parkType');
const featsEl = document.getElementById('parkFeatures');
const descEl = document.getElementById('parkDescription');
const hoursEl = document.getElementById('parkOpeningHours');
const planBtn = document.getElementById('planVisitBtn');

// Funktion wird aufgerufen, wenn ein Park-Feature angeklickt wird, global verfügbar
window.showParkDetails = function (props) {

    let panelProps = props;
    if (props.SPIELPLATZ_DETAIL && window.parksData) {
        const parkFeature = window.parksData.features.find(f =>
            f.properties.ANL_NAME === props.ANL_NAME
        );
        if (parkFeature) {
            // Park-Daten zuerst, playground-Props danach (erhalten TYP_DETAIL  SPIELPLATZ_DETAIL)
            panelProps = { ...parkFeature.properties, ...props };
        }
    } else if (props.id && window.cemeteriesData) {
        // Für Friedhof: nutze NAME/ADRESSE-Felder
        // (optional, falls du separate Logik brauchst)
    }


    // 1) Name
    if (nameEl) {
        nameEl.innerText = panelProps.ANL_NAME || panelProps.NAME || panelProps.PARK || '-';
    }

    // 2) Adresse / Bezirk
    if (addrEl) {
        let text = '';
        if (panelProps.ADRESSE) {
            text = panelProps.ADRESSE;
        } else if (panelProps.BEZIRK) {
            text = `District: ${panelProps.BEZIRK}`;
        }
        addrEl.innerText = text;
    }

    // 3) Type
    if (typeEl) {
        let t;
        if (panelProps.TYP_DETAIL === 'Themenspielplatz') {
            t = 'Themed Playground';
        } else if (panelProps.TYP_DETAIL === 'Spielplatz') {
            t = 'Playground';
        } else if (panelProps.TYP === 'Hundezone') {
            t = 'Dog Zone';
        } else if (panelProps.TYP_DETAIL) {
            t = 'Playground';
        } else {
            t = panelProps.HUNDE_IM_PARK === 'Ja' ? 'Dog Park' :
                panelProps.SPIELEN_IM_PARK === 'Ja' ? 'Playground' : 'Park';
        }
        typeEl.innerText = `Type: ${t}`;
    }

    // 4) Features / Details je nach Datensatz
    if (featsEl) {
        const items = [];

        // Spielplatz-Ausstattung
        if (panelProps.SPIELPLATZ_DETAIL) {
            panelProps.SPIELPLATZ_DETAIL.split(',').forEach(str => {
                items.push(str.trim());
            });
        }


        // Park-Features
        if (panelProps.SPIELEN_IM_PARK) {
            items.push(`Playground: ${translateYesNo(panelProps.SPIELEN_IM_PARK)}`);
        }
        if (panelProps.WASSER_IM_PARK) {
            items.push(`Drinking fountain: ${translateYesNo(panelProps.WASSER_IM_PARK)}`);
        }
        if (panelProps.HUNDE_IM_PARK) {
            items.push(`Dogs allowed: ${translateYesNo(panelProps.HUNDE_IM_PARK)}`);
        }

        // Hundezone-Details
        if (panelProps.EINFRIEDUNG) {
            items.push(`Fencing: ${translateYesNo(panelProps.EINFRIEDUNG)}`);
        }
        if (panelProps.HUNDETRAENKE) {
            items.push(`Dog water fountains: ${panelProps.HUNDETRAENKE}`);
        }

        // Parkplatz-Fläche
        if (panelProps.FLAECHE) {
            items.push(`Area: ${panelProps.FLAECHE}`);
        }


        // Telefon/Weblink
        if (panelProps.TELEFON) {
            items.push(`Phone: ${panelProps.TELEFON}`);
        }
        if (panelProps.WEBLINK1) {
            items.push(`Website: <a href="${panelProps.WEBLINK1}" target="_blank">${panelProps.WEBLINK1}</a>`);
        }

        // Ausgabe
        featsEl.innerHTML = items.map(i => `<div>${i}</div>`).join('');
    }

    // 5) Beschreibung (falls vorhanden)
    if (descEl) {
        descEl.innerText = panelProps.BESCHREIBUNG || '';
    }

    // 6) Öffnungszeiten
    if (hoursEl) {
        hoursEl.innerText = panelProps.OEFF_ZEITEN
            ? `Öffnungszeiten: ${panelProps.OEFF_ZEITEN}`
            : '';
    }

    // 7) Panel anzeigen  Schließen-Button
    if (detailsEl) {
        detailsEl.style.display = 'block';
        if (planBtn) {
            planBtn.style.display = 'block';
            planBtn.onclick = () => {
                detailsEl.style.display = 'none';
            };
        }
    }
};