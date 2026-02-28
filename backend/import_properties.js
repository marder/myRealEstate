require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const Property = require("./models/property");

async function importData() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Połączono z MongoDB. Rozpoczynam import...");

    // Wczytaj plik JSON
    const rawData = fs.readFileSync('C:/Users/Admin/Documents/myRealEstate/realestate/mienie_gminne_mongodb.json', 'utf-8');
    const jsonData = JSON.parse(rawData);

    // Wyczyść stare nieruchomości
    await Property.deleteMany({});
    console.log("Wyczyszczono starą kolekcję Property.");

    // Mapowanie pól z JSON na Model Mongoose
    const propertiesToInsert = jsonData.map(item => ({
      lp: item["Lp"],
      obreb: item["Obręb"],
      numerDzialki: item["Numer działki"],
      powierzchnia: item["Powierzchnia w m2"],
      wartosc: item["Wartość"],
      uzytki: item["Użytki"],
      przeznaczenie: item["Przeznaczenie nieruchomości w studium"]
    }));

    // Import masowy (Bulk Insert)
    const result = await Property.insertMany(propertiesToInsert);
    console.log(`Sukces! Zaimportowano ${result.length} nieruchomości.`);

  } catch (err) {
    console.error("Błąd podczas importu:", err);
  } finally {
    mongoose.connection.close();
  }
}

importData();
