const path = require("path");
const { Pact, Matchers } = require("@pact-foundation/pact");
const axios = require("axios");

const { eachLike, like } = Matchers;

const provider = new Pact({
    consumer: "PlaygroundConsumer",
    provider: "PlaygroundProvider",
    port: 1234,
    log: path.resolve(process.cwd(), "logs", "pact.log"),
    dir: path.resolve(process.cwd(), "pacts"),
    logLevel: "INFO"
});

describe("Pact with PlaygroundProvider (realistische Datenstruktur)", () => {
    beforeAll(() => provider.setup());

    afterAll(() => provider.finalize());

    describe("GET /spielplaetze", () => {
        beforeAll(() => {
            return provider.addInteraction({
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
                            SE_ANNO_CAD_DATA: like(null)
                        })
                    })
                }
            });
        });

        test("GET /spielplaetze liefert eine Liste von Spielplätzen mit realistischer Struktur", async () => {
            const response = await axios.get("http://localhost:1234/spielplaetze");

            expect(response.status).toEqual(200);
            expect(Array.isArray(response.data)).toBe(true);

            const platz = response.data[0];
            expect(platz).toHaveProperty("type", "Feature");
            expect(platz).toHaveProperty("id");
            expect(platz).toHaveProperty("geometry");
            expect(platz).toHaveProperty("properties");
            expect(platz.properties).toHaveProperty("OBJECTID");
            expect(platz.properties).toHaveProperty("ANL_NAME");
            expect(platz.properties).toHaveProperty("BEZIRK");
        });

        afterEach(() => provider.verify());
    });
});
