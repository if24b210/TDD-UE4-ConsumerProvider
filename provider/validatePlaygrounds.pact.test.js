const path = require("path");
const { Verifier } = require("@pact-foundation/pact");

(async () => {
    try {
        const opts = {
            providerBaseUrl: "http://localhost:1235", // dein Provider-Server muss laufen
            pactUrls: [path.resolve(__dirname, "../pacts/PlaygroundConsumer-PlaygroundProvider.json")],
            logLevel: "INFO"
        };

        const output = await new Verifier(opts).verifyProvider();
        console.log("Pact-Verifizierung erfolgreich!");
        console.log(output);
    } catch (e) {
        console.error("Pact-Verifizierung fehlgeschlagen:", e);
    }
})();
