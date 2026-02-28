require("dotenv").config();
const mongoose = require("mongoose");
const Property = require("./models/property");

mongoose.connect(process.env.DATABASE_URL);

async function fixData() {
    console.log("Rozpoczynam czyszczenie nazw obrębów...");

    // 1. Naprawa "Dąbrowica- Kolonia" -> "Dąbrowica-Kolonia"
    const res1 = await Property.updateMany(
        { obreb: "Dąbrowica- Kolonia" },
        { $set: { obreb: "Dąbrowica-Kolonia" } }
    );
    console.log(`Zaktualizowano Dąbrowica-Kolonia: ${res1.modifiedCount} dokumentów.`);

    // 2. Ogólne czyszczenie spacji na końcach i podwójnych spacji
    const properties = await Property.find({});
    let count = 0;
    for (const p of properties) {
        const fixedObreb = p.obreb.trim().replace(/\s+/g, ' ');
        if (fixedObreb !== p.obreb) {
            p.obreb = fixedObreb;
            await p.save();
            count++;
        }
    }
    console.log(`Oczyszczono dodatkowo ${count} nazw obrębów.`);

    process.exit();
}

fixData();
