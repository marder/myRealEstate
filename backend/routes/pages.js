const express = require("express");
const router = express.Router();
const Page = require("../models/page");

// Get SEO data for a specific page by slug
router.get("/:slug", async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) {
      return res.status(404).json({ message: "Page not found" });
    }
    res.json(page);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
