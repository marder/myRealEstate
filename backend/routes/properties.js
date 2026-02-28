const express = require("express");
const router = express.Router();
const Property = require("../models/property");

// Middleware to check if user is signed in
function checkSignIn(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/login");
  }
}

// List properties with pagination and search
router.get("/", checkSignIn, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let query = {};
    if (req.query.search) {
      query = {
        $or: [
          { obreb: { $regex: req.query.search, $options: "i" } },
          { numerDzialki: { $regex: req.query.search, $options: "i" } },
        ],
      };
    }

    const total = await Property.countDocuments(query);
    const properties = await Property.find(query)
      .sort({ lp: 1 })
      .skip(skip)
      .limit(limit);

    res.render("properties/index", {
      properties,
      current: page,
      pages: Math.ceil(total / limit),
      search: req.query.search || "",
      path: "/properties",
      title: "Nieruchomości Gminne",
      total
    });
  } catch (err) {
    req.session.message = { type: "danger", message: err.message };
    res.redirect("/dashboard");
  }
});

// Edit property view
router.get("/edit/:id", checkSignIn, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.redirect("/properties");
    res.render("properties/edit", {
      property,
      path: "/properties",
      title: "Edytuj Nieruchomość",
      action: `/properties/edit/${property._id}?_method=PUT`
    });
  } catch (err) {
    res.redirect("/properties");
  }
});

// Edit property route
router.put("/edit/:id", checkSignIn, async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.redirect("/properties");

    property.obreb = req.body.obreb;
    property.numerDzialki = req.body.numerDzialki;
    property.powierzchnia = req.body.powierzchnia;
    property.wartosc = req.body.wartosc;
    property.uzytki = req.body.uzytki;
    property.przeznaczenie = req.body.przeznaczenie;

    await property.save();
    req.session.message = { type: "success", message: "Nieruchomość została zaktualizowana." };
    res.redirect("/properties");
  } catch (err) {
    req.session.message = { type: "danger", message: "Błąd podczas aktualizacji: " + err.message };
    res.redirect(`/properties/edit/${req.params.id}`);
  }
});

// Delete property
router.delete("/:id", checkSignIn, async (req, res) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    req.session.message = { type: "success", message: "Nieruchomość została usunięta." };
    res.redirect("/properties");
  } catch (err) {
    req.session.message = { type: "danger", message: "Błąd podczas usuwania: " + err.message };
    res.redirect("/properties");
  }
});

// API for suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const search = req.query.query;
    if (!search || search.length < 2) return res.json([]);

    // Find matches in both fields
    const matches = await Property.find({
      $or: [
        { obreb: { $regex: search, $options: "i" } },
        { numerDzialki: { $regex: search, $options: "i" } },
      ],
    })
      .limit(20)
      .select("obreb numerDzialki -_id");

    const results = [];
    const seen = new Set();

    matches.forEach(m => {
      // Check for Obreb match
      if (m.obreb.toLowerCase().includes(search.toLowerCase())) {
        const val = m.obreb;
        if (!seen.has(`o:${val}`)) {
          results.push({ text: val, type: 'Obręb', icon: 'fa-map-location-dot' });
          seen.add(`o:${val}`);
        }
      }
      // Check for Plot match
      if (m.numerDzialki.toLowerCase().includes(search.toLowerCase())) {
        const val = m.numerDzialki;
        const fullText = `${val} (Obręb: ${m.obreb})`;
        if (!seen.has(`d:${val}`)) {
          results.push({ text: val, type: 'Działka', sub: m.obreb, icon: 'fa-vector-square' });
          seen.add(`d:${val}`);
        }
      }
    });

    res.json(results.slice(0, 10));
  } catch (err) {
    res.status(500).json([]);
  }
});

// API for stats (Dashboard data)
router.get("/stats", async (req, res) => {
  try {
    const totalProperties = await Property.countDocuments();
    
    const stats = await Property.aggregate([
      {
        $group: {
          _id: null,
          totalArea: { $sum: "$powierzchnia" },
          totalValue: { $sum: "$wartosc" }
        }
      }
    ]);

    const obrebStats = await Property.aggregate([
      {
        $group: {
          _id: "$obreb",
          count: { $sum: 1 },
          area: { $sum: "$powierzchnia" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const dashboardStats = stats[0] || { totalArea: 0, totalValue: 0 };
    
    res.json({
      totalProperties,
      totalArea: dashboardStats.totalArea,
      totalValue: dashboardStats.totalValue,
      obrebStats
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API for frontend with filtering
router.get("/list", async (req, res) => {
  try {
    let query = {};
    if (req.query.obreb) {
      query.obreb = { $regex: req.query.obreb, $options: "i" };
    }
    if (req.query.numerDzialki) {
      query.numerDzialki = { $regex: req.query.numerDzialki, $options: "i" };
    }
    if (req.query.search) {
      query.$or = [
        { obreb: { $regex: req.query.search, $options: "i" } },
        { numerDzialki: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const properties = await Property.find(query).sort({ lp: 1 });
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// API for a single property
router.get("/:id", async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) return res.status(404).json({ message: "Nie znaleziono nieruchomości" });
    res.json(property);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
