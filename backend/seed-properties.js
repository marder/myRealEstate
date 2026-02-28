require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Property = require("./models/property");

async function seedProperties() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB for seeding properties...");

    const jsonPath = path.join(__dirname, "..", "realestate", "mienie_gminne_mongodb.json");
    const rawData = fs.readFileSync(jsonPath, "utf8");
    const jsonData = JSON.parse(rawData);

    // Clear existing properties
    await Property.deleteMany({});
    console.log("Cleared existing properties.");

    // Filter and map properties
    const propertiesToInsert = jsonData
      .filter((item) => typeof item.Lp === "number")
      .map((item) => ({
        lp: item.Lp,
        obreb: item["Obręb"],
        numerDzialki: item["Numer działki"],
        powierzchnia: item["Powierzchnia w m2"],
        wartosc: item["Wartość"],
        uzytki: item["Użytki"],
        przeznaczenie: item["Przeznaczenie nieruchomości w studium"],
      }));

    await Property.insertMany(propertiesToInsert);
    console.log(`Successfully seeded ${propertiesToInsert.length} properties!`);
  } catch (err) {
    console.error("Error during property seed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedProperties();
