require("dotenv").config();
const mongoose = require("mongoose");
const PageData = require("./models/data");
const Page = require("./models/page");

async function seedDB() {
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await PageData.deleteMany({});
    await Page.deleteMany({});
    
    // 1. Seed Main Content (PageData)
    const finalData = new PageData({
      slides: [
        {
          label: "Gmina Dobra",
          title: "Portal Mienia Komunalnego",
          content: "Transparentność i dostępność informacji o zasobach publicznych dla wszystkich mieszkańców.",
          image: "dobra.jpg",
        }
      ],
      about: {
        header: "Oficjalny Portal Mienia Komunalnego Gminy Dobra",
        content: "Gmina Dobra to region o bogatej historii i dynamicznym rozwoju. Nasz portal mienia komunalnego to element strategii 'Inwestuj w Dobrej', mającej na celu zapewnienie przejrzystości i wsparcia dla mieszkańców oraz przyszłych inwestorów. Zapewniamy pełny dostęp do informacji o gruntach, budynkach i terenach inwestycyjnych stanowiących własność gminy.",
        experienceYears: 30,
      },
      team: [],
      services: [
        "Udostępnianie wykazu nieruchomości gminnych",
        "Informacje o przeznaczeniu gruntów",
        "Wsparcie dla inwestorów",
        "Transparentność gospodarki mieniem"
      ],
      additionalServices: [
        { title: "Wykaz działek", desc: "Pełna baza gruntów stanowiących własność Gminy Dobra.", icon: "pi pi-map" },
        { title: "Oferty inwestycyjne", desc: "Tereny przygotowane pod inwestycje produkcyjne i usługowe.", icon: "pi pi-chart-line" },
        { title: "Procedury", desc: "Informacje o trybach sprzedaży i dzierżawy nieruchomości.", icon: "pi pi-file-edit" },
        { title: "Kontakt", desc: "Bezpośrednie wsparcie Referatu Gospodarki Nieruchomościami.", icon: "pi pi-phone" }
      ],
      stripe: "Zainteresowany mieniem gminnym? Sprawdź aktualny wykaz!",
      contact: {
        address: "Pl. Wojska Polskiego 10\n62-730 Dobra",
        phone: "(63) 279-90-11",
        email: "um@dobra24.pl",
        workingHours: "Pon: 07:30 – 16:30 | Wt-Czw: 07:30 – 15:30 | Pt: 07:30 – 14:30",
        googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d19687.309910670985!2d18.612908949999998!3d51.9172849!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spl!2spl!4v1772192098376!5m2!1spl!2spl"
      },
    });

    await finalData.save();

    // 2. Seed SEO Data (Page)
    const seoData = [
      {
        slug: 'home',
        title: 'Strona Główna',
        metaTitle: 'Mienie Komunalne Gminy Dobra - Oficjalny Portal Informacyjny',
        metaDescription: 'Sprawdź wykaz mienia komunalnego Gminy Dobra. Baza działek, budynków i terenów inwestycyjnych dostępnych w zasobach gminnych.'
      },
      {
        slug: 'offer',
        title: 'Wykaz Mienia',
        metaTitle: 'Wykaz Mienia Komunalnego - Gmina Dobra',
        metaDescription: 'Pełna lista nieruchomości stanowiących własność Gminy Dobra. Filtruj według obrębu, przeznaczenia i powierzchni.'
      },
      {
        slug: 'contact',
        title: 'Kontakt',
        metaTitle: 'Kontakt - Urząd Miejski w Dobrej | Referat Gospodarki Nieruchomościami',
        metaDescription: 'Skontaktuj się z nami w sprawie mienia gminnego. Dane kontaktowe, godziny pracy i lokalizacja Urzędu Miejskiego w Dobrej.'
      }
    ];

    await Page.insertMany(seoData);
    
    console.log("Database seeded with Official Gmina Dobra content!");
  } catch (err) {
    console.error("Error during seed:", err);
  } finally {
    mongoose.connection.close();
  }
}

seedDB();
