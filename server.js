const express = require("express");
const app = express();
const PORT = 5500;
const dotenv = require("dotenv").config();
const cors = require("cors");
const { Resend } = require("resend");

// Middleware to parse JSON in the request body
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

const apiKey = process.env.RESEND_API_KEY;
const resend = new Resend(apiKey);

// const emailTo = "maheshbehera6970@gmail.com";
// const emailTo = "manas865873@gmail.com";
// const emailFrom = "manas865873@gmail.com";

app.post("/sendemail", async (req, res) => {

    const receivedData = req.body;
    console.log('Received data:', receivedData);

    const { data, error } = await resend.emails.send({
        from: 'Manas <no-replay@goboolean.in>',
        to: [`${receivedData.email}`],
        subject: 'For Testing Purpose',
        // html: `<h2>Hey, ${receivedData.name}, How are you?</h2>`,
        html: `${receivedData.htmlTemplate}`,
      });
    
      if (error) {
        console.log(error)
        // res.send({error})
        // return console.error({ error });
        return res.status(400).json({ success: false, error });
      }

      if(data) {
          console.log({ data });
          // res.send({data})

          res.status(200).json({success: true, data });
      }
        // res.send("Hello World");
})

app.listen(PORT, () => {
    console.log("App is running on port:", PORT);
    // const resend = new Resend(apiKey);
})