const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Urząd Miejski w Dobrej" <${process.env.EMAIL_USER}>`,
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

  const subject = `Aktualizacja statusu sprawy: ${orderData.orderNumber}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0056b3;">Dzień dobry, ${orderData.clientName}</h2>
      <p>Informujemy o zmianie statusu Twojej sprawy: <strong>${orderData.projectName}</strong> (Nr ref: ${orderData.orderNumber}).</p>
      <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 6px solid #0056b3; margin: 20px 0;">
        <p style="margin: 0;"><strong>Aktualny status:</strong> ${orderData.status}</p>
        ${orderData.notes ? `<p style="margin: 10px 0 0 0;"><strong>Dodatkowe informacje:</strong> ${orderData.notes}</p>` : ''}
      </div>
      <p>Postępy w sprawie możesz monitorować w naszym Portalu Mienia Komunalnego.</p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.85em; color: #666; font-style: italic;">Wiadomość została wygenerowana automatycznie przez system informatyczny Urzędu Miejskiego w Dobrej.</p>
    </div>
  `;
  return sendEmail(clientEmail, subject, html);
};

// Template for contact form confirmation (to client)
const sendContactConfirmation = async (clientEmail, clientName) => {
  const subject = "Potwierdzenie wpływu zapytania - Urząd Miejski w Dobrej";
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #0056b3;">Potwierdzenie otrzymania wiadomości</h2>
      <p>Szanowni Państwo,</p>
      <p>Dziękujemy za kontakt z <strong>Urzędem Miejskim w Dobrej</strong>. Niniejszym potwierdzamy, że Państwa zapytanie przesłane za pośrednictwem formularza w Portalu Mienia Komunalnego wpłynęło do naszego systemu.</p>
      <p>Państwa wiadomość została przekazana do właściwego referatu. Postaramy się odpowiedzieć na Państwa zapytanie bez zbędnej zwłoki.</p>
      <p>Z poważaniem,<br><strong>Urząd Miejski w Dobrej</strong></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 0.85em; color: #666; font-style: italic;">Wiadomość wygenerowana automatycznie. Prosimy nie odpowiadać na ten e-mail.</p>
    </div>
  `;
  return sendEmail(clientEmail, subject, html);
};

// Template for notification to admin
const sendAdminNotification = async (messageData) => {
  const subject = `Nowe zapytanie z Portalu Mienia: ${messageData.subject || 'Brak tematu'}`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #d9534f;">Nowa wiadomość w systemie CMS</h2>
      <p><strong>Osoba kontaktowa:</strong> ${messageData.name}</p>
      <p><strong>Adres e-mail:</strong> ${messageData.email}</p>
      <p><strong>Nr telefonu:</strong> ${messageData.phone || 'Nie podano'}</p>
      <p><strong>Temat:</strong> ${messageData.subject || 'Brak'}</p>
      <hr>
      <p><strong>Treść wiadomości:</strong></p>
      <div style="background: #f4f4f4; padding: 15px; border-radius: 5px; white-space: pre-wrap;">
        ${messageData.message}
      </div>
      <p style="margin-top: 20px;"><a href="https://dobra.byst.re/messages" style="background: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Otwórz panel zarządzania</a></p>
    </div>
  `;
  return sendEmail(process.env.NOTIFICATION_EMAIL, subject, html);
};

module.exports = {
  sendStatusUpdateEmail,
  sendContactConfirmation,
  sendAdminNotification
};
