const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.render("login", { path: req.url });
});

router.post("/", async (req, res) => {
  const { login, password } = req.body;
  
  const ADMIN_USER = process.env.ADMIN_USER;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

  if (!ADMIN_USER || !ADMIN_PASSWORD) {
    console.error("CRITICAL ERROR: ADMIN_USER or ADMIN_PASSWORD is not defined in .env!");
    return res.status(500).send("Błąd konfiguracji serwera (brak .env)");
  }

  if (!login || !password) {
    return res.render("login", { message: "Podaj login i hasło!", path: req.url });
  }
  try {
    const userMatch = login === ADMIN_USER;
    const passMatch = await bcrypt.compare(password, ADMIN_PASSWORD);

    if (userMatch && passMatch) {
      req.session.regenerate((err) => {
        if (err) {
          console.error("Session regeneration error:", err);
          return res.status(500).send("Błąd serwera");
        }
        req.session.user = { login: ADMIN_USER };
        res.redirect("/dashboard");
      });
      return;
    } else {
      res.render("login", { message: "Nieprawidłowe dane!", type: 'danger', path: req.url });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Błąd serwera");
  }
});

module.exports = router;