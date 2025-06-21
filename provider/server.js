const express = require("express");
const app = express();
const PORT = 1235; // exakt dieser Port!

app.get("/spielplaetze", (req, res) => {
    res.json([
        {
            type: "Feature",
            id: "SPIELPLATZPUNKTOGD.2225591",
            geometry: {
                type: "Point",
                coordinates: [16.36248055, 48.18779685],
            },
            geometry_name: "SHAPE",
            properties: {
                // Bug #2
                OBJECTID: "2225591",
                ANL_NAME: "Rudolf-Sallinger-Park",
                BEZIRK: 5,
                // Bug #1
                //BEZIRK: 5,
                SPIELPLATZ_DETAIL: "Fußball, Klettern, Rutschen, ...",
                TYP_DETAIL: "Ballspielkäfig, Spielplatz",
                SE_ANNO_CAD_DATA: null,
            },
        },
    ]);
});

app.listen(PORT, () => {
    console.log(`PlaygroundProvider läuft auf http://localhost:${PORT}`);
});
