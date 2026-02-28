//API ROUTES
const express = require("express");
const router = express.Router();
const Data = require("../models/data");

//Getting all posts
router.get("/", async (req, res) => {
  try {
    const frontpage = await Data.findOne();
    res.json(frontpage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
