require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/property");
const https = require("https");

mongoose.connect(process.env.DATABASE_URL);

async function fetchTeryt(obreb, numer) {
    return new Promise((resolve) => {
        const cleanNumer = numer.trim();
        const cleanObreb = obreb.trim();
        const query = `${cleanObreb} ${cleanNumer}`;
        const url = `https://uldk.gugik.gov.pl/?request=GetParcelByIdOrNr&id=${encodeURIComponent(query)}&result=id&srid=4326`;

        https.get(url, (res) => {
            let data = "";
            res.on("data", (chunk) => { data += chunk; });
            res.on("end", () => {
                const lines = data.split('\n').filter(l => l.trim() !== "");
                let foundTeryt = null;
                for (let i = 1; i < lines.length; i++) {
                    const teryt = lines[i].trim();
                    if (teryt.startsWith("302703")) {
                        foundTeryt = teryt;
                        break; 
                    }
                }
                resolve(foundTeryt);
            });
        }).on("error", () => resolve(null));
    });
}

async function migrate() {
    try {
        const properties = await Property.find({ teryt: { $exists: false } });
        console.log(`Znaleziono ${properties.length} nieruchomości do aktualizacji TERYT...`);

        let updated = 0;
        for (let i = 0; i < properties.length; i++) {
            const p = properties[i];
            const teryt = await fetchTeryt(p.obreb, p.numerDzialki);
            
            if (teryt) {
                p.teryt = teryt;
                await p.save();
                updated++;
            }
            
            if (i % 10 === 0) {
                console.log(`Postęp: ${i+1}/${properties.length} (Zaktualizowano: ${updated})`);
            }
            
            await new Promise(r => setTimeout(r, 50));
        }

        console.log(`Zakończono! Zaktualizowano ${updated} rekordów.`);
    } catch (err) {
        console.error("Błąd migracji:", err);
    } finally {
        process.exit();
    }
}

migrate();
