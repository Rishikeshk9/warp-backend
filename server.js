const express = require("express");
const port = 5000;
const cors = require("cors");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const app = express();

require("dotenv").config();

app.use(cors());
app.set("view engine", "ejs");
app.use(express.json());
const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  }),
);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/send", (req, res) => {
  console.log(req.body);
  try {
    transporter.sendMail({
      to: req.body.to_name,
      from: process.env.SERVICE_EMAIL,
      subject: "You have received a new File from " + req.body.from_name,
      html: `
              <p>Connect ${req.body.wallet} </p>
              <a href="https://warp-frontend-xi.vercel.app/download/${req.body.message}">Click here to View & Download File</a>
              ${req.body.message}
              `,
    });
    console.log("sending Mail");
    res.status(201).send("sent");
  } catch (error) {
    console.log("error", error);

    res.status(500).send(error);
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
