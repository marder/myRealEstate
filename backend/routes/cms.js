const express = require("express");
const router = express.Router();
const Post = require("../models/blog");
const Property = require("../models/property");
const PageData = require("../models/data");
const Page = require("../models/page");
const multer = require("multer");
const fs = require("fs");
const sharp = require("sharp");

// Multer storage for memory (to process with sharp)
const storage = multer.memoryStorage();

// File filter for Multer
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
}).single("image");

// Middleware to process image with sharp
const processImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  try {
    const filename = `image_${Date.now()}.webp`;
    const outputPath = `./public/uploads/${filename}`;

    await sharp(req.file.buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);

    req.processedImageFilename = filename;
    next();
  } catch (error) {
    console.error("Error processing image with sharp:", error);
    req.session.message = {
      type: "danger",
      message: "Błąd przetwarzania obrazu: " + error.message,
    };
    return res.redirect("back");
  }
};

// --- SEO MANAGEMENT ROUTES ---

router.get("/pages/seo", checkSignIn, async (req, res) => {
  try {
    const slugs = ['home', 'about'];
    const pages = {};
    
    for (const slug of slugs) {
      let page = await Page.findOne({ slug });
      if (!page) {
        const defaultTitles = {
          home: 'Strona Główna',
          about: 'O projekcie'
        };
        const defaultDescriptions = {
          home: 'Baza danych nieruchomości Gminy Dobra.',
          about: 'Informacje o projekcie bazy danych nieruchomości gminnych.'
        };
        page = new Page({
          slug,
          title: defaultTitles[slug],
          metaTitle: `${defaultTitles[slug]} - Nieruchomości Gminy Dobra`,
          metaDescription: defaultDescriptions[slug]
        });
        await page.save();
      }
      pages[slug] = page;
    }
    
    res.render("pages/seo", { pages, path: "/pages/seo" });
  } catch (err) {
    req.session.message = { type: "danger", message: err.message };
    res.redirect("/dashboard");
  }
});

router.post("/pages/seo", checkSignIn, async (req, res) => {
  try {
    const slugs = ['home', 'about'];
    
    for (const slug of slugs) {
      const metaTitle = req.body[`${slug}_metaTitle`];
      const metaDescription = req.body[`${slug}_metaDescription`];
      
      await Page.findOneAndUpdate(
        { slug },
        { metaTitle, metaDescription },
        { upsert: true }
      );
    }
    
    req.session.message = { type: "success", message: "Tagi SEO zostały zaktualizowane" };
    res.redirect("/pages/seo");
  } catch (err) {
    req.session.message = { type: "danger", message: "Błąd: " + err.message };
    res.redirect("/pages/seo");
  }
});

//Dashboard view
router.get("/dashboard", checkSignIn, async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    
    // Global stats
    const stats = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalArea: { $sum: "$powierzchnia" },
          totalValue: { $sum: "$wartosc" },
          avgArea: { $avg: "$powierzchnia" },
          avgValue: { $avg: "$wartosc" }
        }
      }
    ]);

    // Obreb stats
    const obrebStats = await Property.aggregate([
      {
        $group: {
          _id: "$obreb",
          count: { $sum: 1 },
          area: { $sum: "$powierzchnia" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Uzytki stats
    const uzytkiStats = await Property.aggregate([
      {
        $group: {
          _id: "$uzytki",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    const latestProperties = await Property.find().sort({ updatedAt: -1 }).limit(5);

    const dashboardStats = stats[0] || { totalArea: 0, totalValue: 0, avgArea: 0, avgValue: 0 };
    
    res.render("dashboard", {
      totalProperties,
      totalArea: dashboardStats.totalArea,
      totalValue: dashboardStats.totalValue,
      avgArea: dashboardStats.avgArea,
      avgValue: dashboardStats.avgValue,
      obrebStats,
      uzytkiStats,
      latestProperties,
      path: "/dashboard"
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).render("404", { title: "Błąd serwera", path: "/dashboard" });
  }
});

// Root redirect
router.get("/", (req, res) => {
  if (req.session.user) {
    res.redirect("/dashboard");
  } else {
    res.redirect("/login");
  }
});

// --- PAGE MANAGEMENT ROUTES ---

async function getPageData() {
  let data = await PageData.findOne();
  if (!data) {
     data = new PageData({
       about: { header: "O projekcie", content: "Opis projektu..." }
     });
     await data.save();
  }
  return data;
}

// HOME PAGE
router.get("/pages/home", checkSignIn, async (req, res) => {
  try {
    const data = await getPageData();
    res.render("pages/home", { data, path: "/pages/home" });
  } catch (err) {
    req.session.message = { type: "danger", message: err.message };
    res.redirect("/");
  }
});

router.put("/pages/home", checkSignIn, async (req, res) => {
  try {
    const data = await getPageData();
    data.stripe = req.body.stripe;
    
    const slides = [];
    if (req.body.slideTitle) {
      const titles = Array.isArray(req.body.slideTitle) ? req.body.slideTitle : [req.body.slideTitle];
      const labels = Array.isArray(req.body.slideLabel) ? req.body.slideLabel : [req.body.slideLabel];
      const contents = Array.isArray(req.body.slideContent) ? req.body.slideContent : [req.body.slideContent];
      const images = Array.isArray(req.body.slideImage) ? req.body.slideImage : [req.body.slideImage];

      for (let i = 0; i < titles.length; i++) {
        if (titles[i]) {
          slides.push({
            label: labels[i] || "",
            title: titles[i],
            content: contents[i] || "",
            image: images[i] || "",
          });
        }
      }
    }
    data.slides = slides;

    await data.save();
    req.session.message = { type: "success", message: "Strona główna zaktualizowana" };
    res.redirect("/pages/home");
  } catch (err) {
    req.session.message = { type: "danger", message: "Błąd: " + err.message };
    res.redirect("/pages/home");
  }
});

// ABOUT PROJECT
router.get("/pages/about", checkSignIn, async (req, res) => {
  try {
    const data = await getPageData();
    res.render("pages/about", { data, path: "/pages/about" });
  } catch (err) {
    req.session.message = { type: "danger", message: err.message };
    res.redirect("/");
  }
});

router.put("/pages/about", checkSignIn, async (req, res) => {
  try {
    const data = await getPageData();
    data.about.header = req.body.aboutHeader;
    data.about.content = req.body.aboutContent;
    
    await data.save();
    req.session.message = { type: "success", message: "Strona 'O projekcie' zaktualizowana" };
    res.redirect("/pages/about");
  } catch (err) {
    req.session.message = { type: "danger", message: "Błąd: " + err.message };
    res.redirect("/pages/about");
  }
});

// CONTACT PAGE
router.get("/pages/contact", checkSignIn, async (req, res) => {
  try {
    const data = await getPageData();
    res.render("pages/contact", { data, path: "/pages/contact" });
  } catch (err) {
    req.session.message = { type: "danger", message: err.message };
    res.redirect("/");
  }
});

router.put("/pages/contact", checkSignIn, async (req, res) => {
  try {
    const data = await getPageData();
    data.contact.address = req.body.contactAddress;
    data.contact.phone = req.body.contactPhone;
    data.contact.email = req.body.contactEmail;
    data.contact.workingHours = req.body.workingHours;
    data.contact.googleMapsEmbed = req.body.googleMapsEmbed;
    
    await data.save();
    req.session.message = { type: "success", message: "Strona 'Kontakt' zaktualizowana" };
    res.redirect("/pages/contact");
  } catch (err) {
    req.session.message = { type: "danger", message: "Błąd: " + err.message };
    res.redirect("/pages/contact");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

function checkSignIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
