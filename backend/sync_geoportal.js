require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/property");
const https = require("https");

mongoose.connect(process.env.DATABASE_URL);

async function fetchGeom(obreb, numer) {
    return new Promise((resolve) => {
        // Szukamy po samym obrębie i numerze, filtracja nastąpi w end()
        let query = `${obreb} ${numer.trim()}`;
        
        // Specjalna obsługa dla nazw złożonych - upewniamy się że nie ma zbędnych członów
        if (obreb.includes("Dąbrowica-Kolonia")) {
            query = `Dąbrowica ${numer.trim()}`;
        }

        const url = `https://uldk.gugik.gov.pl/?request=GetParcelByIdOrNr&id=${encodeURIComponent(query)}&result=id,geom_wkt&srid=4326`;

        https.get(url, (res) => {
            let data = "";
            res.on("data", chunk => data += chunk);
            res.on("end", () => {
                const lines = data.split('\n').filter(l => l.trim() !== "");
                let foundGeom = null;
                
                // Szukamy wyniku, który należy do Gminy Dobra (TUREK) - TERYT zaczyna się od 302703
                for (let i = 1; i < lines.length; i++) {
                    const parts = lines[i].split("|");
                    const teryt = parts[0] || "";
                    if (teryt.startsWith("302703")) {
                        const geom = parts[1] || "";
                        foundGeom = geom.includes(";") ? geom.split(";")[1] : geom;
                        break; 
                    }
                }
                resolve(foundGeom);
            });
        }).on("error", () => resolve(null));
    });
}

async function syncAll() {
    const properties = await Property.find({ wkt: { $exists: false } }); // Tylko te bez geometrii
    console.log(`Znalazłem ${properties.length} nieruchomości do synchronizacji...`);

    let count = 0;
    for (const p of properties) {
        count++;
        process.stdout.write(`Przetwarzanie ${count}/${properties.length}: ${p.obreb} ${p.numerDzialki}... `);
        
        const geom = await fetchGeom(p.obreb, p.numerDzialki);
        if (geom) {
            p.wkt = geom;
            await p.save();
            console.log("\x1b[32mOK\x1b[0m");
        } else {
            console.log("\x1b[31mNIE ZNALEZIONO\x1b[0m");
        }

        // Czekamy chwilę, żeby nie przeciążyć serwera GUGiK i nie dostać bana
        await new Promise(r => setTimeout(r, 200)); 
    }

    console.log("Synchronizacja zakończona!");
    process.exit();
}

syncAll();
