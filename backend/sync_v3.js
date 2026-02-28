require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/property");
const https = require("https");

mongoose.connect(process.env.DATABASE_URL);

async function fetchGeom(obreb, numer) {
    // Czyszczenie numeru: usuwamy kropki na końcu i zbędne spacje
    const cleanNumer = numer.replace(/\.+$/, "").trim();
    const cleanObreb = obreb.trim();

    // Różne warianty zapytań
    const variants = [
        `${cleanObreb} ${cleanNumer}`,
        `Dobra ${cleanObreb} ${cleanNumer}`,
        `${cleanObreb.replace("-", " ")} ${cleanNumer}`,
        `miasto Dobra ${cleanNumer}`
    ];

    for (const query of variants) {
        const res = await new Promise((resolve) => {
            const url = `https://uldk.gugik.gov.pl/?request=GetParcelByIdOrNr&id=${encodeURIComponent(query)}&result=id,geom_wkt&srid=4326`;
            https.get(url, (res) => {
                let data = "";
                res.on("data", chunk => data += chunk);
                res.on("end", () => {
                    const lines = data.split('\n').filter(l => l.trim() !== "");
                    let foundGeom = null;
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
        if (res) return res; // Jeśli znaleźliśmy geometrię, przerywamy pętlę wariantów
    }
    return null;
}

async function syncAll() {
    const properties = await Property.find({ wkt: { $exists: false } }); 
    console.log(`Próba V3 dla ${properties.length} brakujących działek...`);

    let count = 0;
    for (const p of properties) {
        count++;
        process.stdout.write(`[${count}/${properties.length}] ${p.obreb} ${p.numerDzialki}... `);
        
        const geom = await fetchGeom(p.obreb, p.numerDzialki);
        if (geom) {
            p.wkt = geom;
            await p.save();
            console.log("\x1b[32mOK\x1b[0m");
        } else {
            console.log("\x1b[31mFAIL\x1b[0m");
        }
        await new Promise(r => setTimeout(r, 100)); 
    }

    console.log("Synchronizacja V3 zakończona!");
    process.exit();
}

syncAll();
