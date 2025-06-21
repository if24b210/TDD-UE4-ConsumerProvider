// Pact Consumer Test für den PlaygroundService

// Pact-Bibliothek importieren
const path = require("path");
const { Pact, Matchers } = require("@pact-foundation/pact");    // Pact-Bibliothek importieren
const axios = require("axios"); // stellt anfrage an HTTP-Server

const { eachLike, like } = Matchers;    //  Mathers: beschreibt das erwatete Datenformat in der Antwort

// Pack-Mock-Provider konfiguration
const provider = new Pact({
    consumer: "PlaygroundConsumer",
    provider: "PlaygroundProvider",
    port: 1234,
    log: path.resolve(process.cwd(), "logs", "pact.log"),   // Pfad für das Pact-Logfile
    dir: path.resolve(process.cwd(), "pacts"),  // der Vertrag wird hier gespeichert
    logLevel: "INFO"
});

(async () => {
    try {
        await provider.setup();

        // 
        await provider.addInteraction({
            state: "Spielplatzdaten sind vorhanden",
            uponReceiving: "eine Anfrage für alle Spielplätze",
            withRequest: {
                method: "GET",
                path: "/spielplaetze"
            },
            willRespondWith: {
                status: 200,
                headers: { "Content-Type": "application/json; charset=utf-8" },
                body: eachLike({
                    type: like("Feature"),
                    id: like("SPIELPLATZPUNKTOGD.2225591"),
                    geometry: like({
                        type: like("Point"),
                        coordinates: like([16.36248055, 48.18779685])
                    }),
                    geometry_name: like("SHAPE"),
                    properties: like({
                        OBJECTID: like(2225591),
                        ANL_NAME: like("Rudolf-Sallinger-Park"),
                        BEZIRK: like(5),
                        SPIELPLATZ_DETAIL: like("Fußball, Klettern, Rutschen, ..."),
                        TYP_DETAIL: like("Ballspielkäfig, Spielplatz"),
                        SE_ANNO_CAD_DATA: null
                    })
                })
            }
        });

        const response = await axios.get("http://localhost:1234/spielplaetze");
        console.log("Status:", response.status);
        console.log("Erste Antwort:", JSON.stringify(response.data[0], null, 2));

        await provider.verify();
        await provider.finalize();
        console.log("Pact-Test erfolgreich abgeschlossen!");

    } catch (error) {
        console.error("Fehler beim Pact-Test:", error);
        await provider.finalize();
        process.exit(1);
    }
})();
