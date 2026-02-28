const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"JUNKIERT INVESTMENT" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

// Template for status change
const sendStatusUpdateEmail = async (clientEmail, orderData) => {
  if (!clientEmail) return;

  const subject = `Aktualizacja statusu zlecenia: ${orderData.orderNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Dzień dobry, ${orderData.clientName}</h2>
      <p>Informujemy, że status Twojego zlecenia <strong>${orderData.projectName}</strong> (Nr: ${orderData.orderNumber}) uległ zmianie.</p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; border-left: 5px solid #007bff;">
        <p><strong>Nowy status:</strong> ${orderData.status}</p>
        ${orderData.notes ? `<p><strong>Notatki:</strong> ${orderData.notes}</p>` : ''}
      </div>
      <p>Postępy możesz śledzić na naszej stronie w zakładce "Sprawdź status zlecenia".</p>
      <hr>
      <p style="font-size: 0.9em; color: #777;">Wiadomość wygenerowana automatycznie przez system JUNKIERT INVESTMENT.</p>
    </div>
  `;
  return sendEmail(clientEmail, subject, html);
};

// Template for contact form confirmation (to client)
const sendContactConfirmation = async (clientEmail, clientName) => {
  const subject = "Potwierdzenie otrzymania wiadomości - JUNKIERT INVESTMENT";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Dziękujemy za kontakt, ${clientName}!</h2>
      <p>Twoja wiadomość została poprawnie wysłana do naszej pracowni. Postaramy się odpowiedzieć tak szybko, jak to możliwe.</p>
      <p>Z poważaniem,<br>Zespół JUNKIERT INVESTMENT</p>
    </div>
  `;
  return sendEmail(clientEmail, subject, html);
};

// Template for notification to admin
const sendAdminNotification = async (messageData) => {
  const subject = `Nowa wiadomość z formularza: ${messageData.subject || 'Brak tematu'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Otrzymano nową wiadomość w systemie CMS</h2>
      <p><strong>Od:</strong> ${messageData.name} (${messageData.email})</p>
      <p><strong>Telefon:</strong> ${messageData.phone || 'Nie podano'}</p>
      <p><strong>Temat:</strong> ${messageData.subject || 'Brak'}</p>
      <p><strong>Treść:</strong></p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px;">
        ${messageData.message}
      </div>
      <p><a href="https://geodeta.bieda.it/messages">Kliknij tutaj, aby zarządzać wiadomościami w panelu</a></p>
    </div>
  `;
  return sendEmail(process.env.NOTIFICATION_EMAIL, subject, html);
};

module.exports = {
  sendStatusUpdateEmail,
  sendContactConfirmation,
  sendAdminNotification
};
