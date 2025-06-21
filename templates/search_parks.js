// This script fetches parks data from a given API endpoint and displays it on the webpage.
// It first tries to load the data from an online source, and if that fails, it attempts to load a local JSON file.


// Suche nach Name

// filtert Parks nach Name und Typ (Hunde, Spielplätze) und zeigt sie auf der Karte an
// Filter: Parks, Hunde Park, Spielplätze
// Filter nach Features(Trinkbrunnen, Hunde erlaubt)

// Checkboxen: Hunde, Spielplätze, Wasser, Hunde erlaubt

// Mehrfachauswahl Typ  Feature möglich

// Popup-Content für Parks: Name, Typ (Hunde, Spielplätze)

// Details anzeige für features
// =============================================================================//


document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const typeCheckboxIds = ["parks", "dogs", "general-playgrounds"];
    const featureCheckboxIds = ["fountains", "dogs-allowed"];


    // Sub-Filter für Spielplätze deaktivieren/aktivieren
    const cbGeneral = document.getElementById('general-playgrounds');
    const subIds = [
        'themed-playgrounds',
        'toddler-playgrounds',
        'generational-playgrounds',
        'ball-playgrounds',
        'ball-cage-playgrounds',
        'forrest-playgrounds'
    ];

    // Unterfilter standardmäßig deaktivieren
    subIds.forEach(id => {
        // Suche nach Checkbox-Elementen anhand der IDs
        const cb = document.getElementById(id);
        if (cb) cb.disabled = true;
    });

    // Search und Filter-Setup 
    // const searchInput = document.getElementById('searchInput'); // Removed duplicate declaration

    const typeCheckboxes = typeCheckboxIds.map(id => document.getElementById(id));
    const featureCheckboxes = featureCheckboxIds.map(id => document.getElementById(id));

    const subCheckboxes = subIds.map(id => document.getElementById(id));

    // Aktivierte Checkboxen abrufen
    function getActiveTypes() {
        return typeCheckboxIds.reduce((active, id) => {
            active[id] = document.getElementById(id).checked;
            return active;
        }, {});
    }

    // Funktion zum Abfragen aktiver Subtypen
    function getActiveSubTypes() {
        return subIds.reduce((active, id) => {
            active[id] = document.getElementById(id).checked;
            return active;
        }, {});
    }

    function getActiveFeatures() {
        return featureCheckboxIds.reduce((active, id) => {
            active[id] = document.getElementById(id).checked;
            return active;
        }, {});
    }

    function getTypeForFeature(feature) {
        if (feature.properties.HUNDE_IM_PARK === 'Ja') return 'Dog Park';
        if (feature.properties.SPIELEN_IM_PARK === 'Ja') return 'Playground';
        return 'Park';
    }

    // Playground && Feature
    function checkFeatureMatchPlaygrounds(feature, feats) {
        if (!Object.values(feats).includes(true)) return true;

        if (feats.fountains) {
            // Check Wasserbrunnen auf dem Playground
            if (feature.properties.WASSER_IM_PARK !== 'Ja') return false;
        }

        if (feats['dogs-allowed']) {
            // Auf Spielplätzen sind Hunde meistens NICHT erlaubt → immer false
            return false; // Hunde nicht erlaubt
        }

        return true;
    }


    function checkFeatureMatch(feature, feats) {
        // wenn keine Feature-Checkbox aktiv, immer true
        if (!Object.values(feats).includes(true)) return true;
        if (feats.fountains && feature.properties.WASSER_IM_PARK !== 'Ja') return false;
        if (feats['dogs-allowed'] && feature.properties.HUNDE_IM_PARK !== 'Ja') return false;
        return true;
    }




    function translateYesNo(val) {
        if (val === 'Ja') return 'Yes';
        if (val === 'Nein') return 'No';
        return val;
    }


    // ─── map-Update-Funktion : filtert und rendert Parks (und optional Friedhöfe) ────────────────────────────────────────────────
    function updateMap() {
        // bestehende Marker löschen
        window.parkLayerGroup.clearLayers();
        window.cemeteriesLayerGroup.clearLayers();
        window.playgroundLayerGroup.clearLayers();

        if (!window.parksData || !window.playgroundData) {
            // Wenn Parks-Daten noch nicht geladen sind, abbrechen
            console.error('Parks-Daten noch nicht geladen.');
            return;
        }

        // Search text einlesen und Checkboxen 
        const term = searchInput.value.toLowerCase();
        const types = getActiveTypes();
        const feats = getActiveFeatures();

        // wenn alles leer/aus, nichts tun
        if (
            term === '' &&
            !Object.values(types).includes(true) &&
            !Object.values(feats).includes(true)
        ) {
            return;
        }

        // Parks filtern
        const filteredParks = window.parksData.features.filter(f => {
            const nameMatch = (f.properties.ANL_NAME || '').toLowerCase().includes(term);

            // Prüfe, ob der Park die gesuchten Eigenschaften hat
            // Prüfe, ob der Park Spielplätze oder Hunde erlaubt hat
            const hasPG = f.properties.SPIELEN_IM_PARK === 'Ja';
            const isDog = f.properties.HUNDE_IM_PARK === 'Ja';

            // Typ-Logik
            let typeOk = false;
            if (types.parks && types['general-playgrounds']) {
                typeOk = hasPG;
            } else if (types.parks) {
                typeOk = true;
            }
            if (types.dogs && isDog) {
                typeOk = true;
            }

            return nameMatch && typeOk && checkFeatureMatch(f, feats);
        });


        const subTypes = getActiveSubTypes();   // Abfrage der aktiven Subtypen

        // Playgrounds filtern: Datenquelle(window.playgroundData)
        // features aus window.playgroundData filtern (*.json)
        const filteredPlaygrounds = window.playgroundData.features.filter(f => {
            const nameMatch = (f.properties.ANL_NAME || '').toLowerCase().includes(term);
            // Playground Typ (TYP_DETAIL) z.B. 'Themenspielplatz'
            const typeDetail = f.properties.TYP_DETAIL;

            // Subtypen-Filter
            let typeOk = false;

            if (Object.values(subTypes).includes(true)) { // wenn Subfilter aktiv
                if (subTypes['themed-playgrounds'] && typeDetail === 'Themenspielplatz') typeOk = true;
                if (subTypes['toddler-playgrounds'] && typeDetail === 'Kleinkinderspielplatz') typeOk = true;
                if (subTypes['generational-playgrounds'] && typeDetail === 'Generationenspielplatz') typeOk = true;
                if (subTypes['ball-playgrounds'] && typeDetail === 'Ballspielplatz') typeOk = true;
                if (subTypes['ball-cage-playgrounds'] && typeDetail === 'Ballspielkäfig') typeOk = true;
                if (subTypes['forrest-playgrounds'] && typeDetail === 'Waldspielplatz') typeOk = true;
            } else {
                typeOk = true; // keine Subfilter aktiv → alle erlauben
            }

            // Feature Filter für Playgrounds (Trinkbrunnen, Hunde erlaubt)
            const featureOK = checkFeatureMatchPlaygrounds(f, feats);

            return nameMatch && typeOk && featureOK;
        });

        // zeige gefilterte Parks
        L.geoJSON({
            type: 'FeatureCollection',
            features: filteredParks
        }, {
            pointToLayer: (feature, latlng) => {
                const hasPG = feature.properties.SPIELEN_IM_PARK === 'Ja';
                if (types['general-playgrounds'] && hasPG) {
                    //console.log('Playground-Icon für:', feature.properties.ANL_NAME);
                    return createPlaygroundMarker(latlng);
                }
                return createGreenMarker(latlng);
            },
            onEachFeature: (feature, layer) => {
                // 1) Popup einmalig binden
                layer.bindPopup(generatePopupContent(feature.properties));

                // 2) Klick: Side-Panel füllen und Popup öffnen
                layer.on('click', () => {
                    showParkDetails(feature.properties);
                    layer.openPopup();
                });
            }
        }).addTo(window.parkLayerGroup);

        // Playgrounds rendern
        L.geoJSON({
            type: 'FeatureCollection',
            features: filteredPlaygrounds
        }, {
            pointToLayer: (feature, latlng) => {
                const typeDetail = feature.properties.TYP_DETAIL;

                if (typeDetail === 'Themenspielplatz') return window.createThemedPlaygroundMarker(latlng);
                if (typeDetail === 'Kleinkinderspielplatz') return window.createToddlerPlaygroundMarker(latlng);
                if (typeDetail === 'Generationenspielplatz') return window.createGenerationalPlaygroundMarker(latlng);
                if (typeDetail === 'Ballspielplatz') return window.createBallPlaygroundMarker(latlng);
                if (typeDetail === 'Ballspielkäfig') return window.createBallCagePlaygroundMarker(latlng);
                if (typeDetail === 'Waldspielplatz') return window.createForrestPlaygroundMarker(latlng);

                return window.createPlaygroundMarker(latlng); // fallback
            },
            onEachFeature: (feature, layer) => {
                layer.bindPopup(generatePopupContent(feature.properties));
                layer.on('click', () => {
                    showParkDetails(feature.properties);
                    layer.openPopup();
                });
            }
        }).addTo(window.playgroundLayerGroup);


        // ─── Optional: Friedhöfe 
        if (document.getElementById('cemeteries').checked && window.cemeteriesData) {
            const cemFilt = window.cemeteriesData.features; // No filter applied, show all cemeteries
            L.geoJSON({
                type: 'FeatureCollection',
                features: cemFilt
            }, {
                //
                pointToLayer: (f, latlng) => createCemeteryMarker(latlng),  // Friedhof-Icon
                onEachFeature: (feature, layer) => {
                    layer.bindPopup(generatePopupContent(feature.properties));

                    layer.on('click', () => {
                        showParkDetails(feature.properties);
                        layer.openPopup();
                    });
                }
            }).addTo(window.cemeteriesLayerGroup.clearLayers());  // Clear previous layers before adding new ones
            // Friedhöfe Layer zur Karte hinzufügen, wenn Checkbox aktiv
            window.map.addLayer(window.cemeteriesLayerGroup);
        } else {
            window.map.removeLayer(window.cemeteriesLayerGroup);
        }
    }

    // ─── Event-Listener & Initialisierung ───────────────────────────────────────
    if (searchInput) {
        searchInput.addEventListener('input', updateMap);
    }

    typeCheckboxes.forEach(cb => {
        cb.addEventListener('change', updateMap);
    });

    // Event-Listener für Typ-Checkboxen und Feature-Checkboxen
    // Removed redundant iteration over typeCheckboxes to avoid duplicate event listeners
    featureCheckboxes.forEach(cb => cb.addEventListener('change', updateMap));

    // Event-Listener für Sub-Checkboxen
    subCheckboxes.forEach(cb => cb.addEventListener('change', updateMap));

    featureCheckboxes
        .filter(cb => cb && typeof cb.addEventListener === 'function') // Filter valid elements
        .forEach(cb => cb.addEventListener('change', updateMap));

    // Define cbCemeteries to reference the cemeteries checkbox
    const cbCemeteries = document.getElementById('cemeteries');
    // Friedhöfe Checkbox-Event-Listener
    if (cbCemeteries && typeof cbCemeteries.addEventListener === 'function') {
        // Friedhöfe Checkbox-Event-Listener    
        cbCemeteries.addEventListener('change', updateMap);
    } else {
        console.warn('Friedhöfe Checkbox nicht gefunden.', cbCemeteries);
    }


    // erstes Rendering (falls schon Checkboxen gesetzt)
    // Check if any filters or search terms are active before calling updateMap
    if (
        searchInput.value.trim() !== '' ||
        typeCheckboxes.some(cb => cb.checked) ||
        featureCheckboxes.some(cb => cb.checked) ||
        (cbCemeteries && cbCemeteries.checked)
    ) {
        updateMap();
    }
});

