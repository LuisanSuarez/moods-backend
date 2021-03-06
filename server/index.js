require("dotenv").config();

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const fs = require("fs");
const { LocalStorage } = require("node-localstorage");
localStorage = new LocalStorage("./scratch");

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000/",
    // "http://localhost:3000/*",
    "http://localhost:3000/login",
    "http://localhost:3000/login",
    "localhost:3000/",
    // "localhost:3000/*",
    "localhost:3000/login",
    "localhost:3000/login",
    // "*",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Origin", origin);
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

app.use((req, res, next) => {
  const { dbName } = req.query;
  if (dbName) {
    localStorage.setItem("dbName", dbName);
  }
  return next();
});

const PORT = process.env.PORT || 3000;

const auth = require("./routes/auth");
const api = require("./routes/api");

app.use("/auth", auth);
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("SPOTIFY MOODS BACKEND");
});

app.listen(PORT, () => console.log(`Moods listening on port ${PORT}!\n\n\n`));
