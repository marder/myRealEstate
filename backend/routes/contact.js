const express = require("express");
const router = express.Router();
const { sendAdminNotification, sendContactConfirmation } = require("../utils/mailer");

router.post("/", async (req, res) => {
  const { name, email, phone, subject, message, website } = req.body;

  // Honeypot check - 'website' field should be empty
  if (website) {
    console.log("Spam detected via Honeypot");
    return res.status(200).json({ success: true, message: "Wiadomość została wysłana pomyślnie!" }); // Silent reject
  }

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: "Proszę wypełnić wymagane pola (imię, e-mail, wiadomość)." });
  }

  try {
    // 1. Send notification to admin
    const adminSent = await sendAdminNotification({ name, email, phone, subject, message });
    
    // 2. Send confirmation to client
    const clientSent = await sendContactConfirmation(email, name);

    if (adminSent) {
      res.status(200).json({ success: true, message: "Wiadomość została wysłana pomyślnie!" });
    } else {
      res.status(500).json({ success: false, message: "Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później." });
    }
  } catch (error) {
    console.error("Contact Form Error:", error);
    res.status(500).json({ success: false, message: "Błąd serwera. Spróbuj ponownie później." });
  }
});

module.exports = router;
