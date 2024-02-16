const express = require("express");
const app = express();
const PORT = 5500;
const dotenv = require("dotenv").config();
const cors = require("cors");
const { Resend } = require("resend");
const fs = require("fs");

// Middleware to parse JSON in the request body
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

app.post("/sendemail", async (req, res) => {

    const receivedData = req.body;
    console.log('Received data:', receivedData);

    // Read the email template from the file system
    fs.readFile("./templates/email.html", "utf8", async (err, htmlTemplate) => {
      if (err) {
          console.error("Error reading email template file:", err);
          return res.status(500).json({ success: false, error: "Error reading email template file" });
      }

      // Modify the email template with dynamic content
      const modifiedTemplate = htmlTemplate
      .replace("{{name}}", receivedData.name)
      .replace("{{logoSrc}}", receivedData.logoSrc)
      .replace("{{bannerSrc}}", receivedData.bannerSrc)
      .replace("{{receiverUrl}}", receivedData.receiverUrl)


      const { data, error } = await resend.emails.send({
          from: 'Manas <no-replay@goboolean.in>',
          to: [`${receivedData.email}`],
          subject: 'For Testing Purpose',
          html: modifiedTemplate, // Use the read HTML template
      });

      if (error) {
          console.error("Error sending email:", error);
          return res.status(400).json({ success: false, error });
      }

      console.log("Email sent successfully:", data);
      res.status(200).json({ success: true, data });
  });
});

app.listen(PORT, () => {
    console.log("App is running on port:", PORT);
    // const resend = new Resend(apiKey);
})