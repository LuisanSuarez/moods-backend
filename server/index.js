require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const db = require("./methods");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json());

app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000/",
    "http://localhost:3000/*",
    "http://localhost:3000/login",
    "http://localhost:3000/login",
    "localhost:3000/",
    "localhost:3000/*",
    "localhost:3000/login",
    "localhost:3000/login",
    "*",
  ];
  const origin = req.headers.origin;
  console.log({ origin });
  if (allowedOrigins.includes(origin)) {
    console.log({ origin });
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", true);
  return next();
});

const PORT = process.env.PORT || 3000;
const user = process.env.DEV_USER || testUser;

const auth = require("./routes/auth");
const api = require("./routes/api");

const uri = `mongodb+srv://luisan:${process.env.DB_PASSWORD}@moods.hfxeh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
async function main() {
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    await client.connect();
  } catch (error) {
    console.log(
      "\n\n~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~~  CLIENT CONNECTION ERROR  ~~~\n ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ \n\n"
    );
    console.error(error);
  }

  try {
    const results = await db.loadData(user, data);
    assert.equal(data.length, results.insertedCount);
  } catch (error) {
    console.error(error);
  } finally {
    client.close();
  }
}

// main();

app.use("/auth", auth);
app.use("/api", api);

app.get("/", (req, res) => {
  res.send("SPOTIFY MOODS BACKEND");
});

app.listen(PORT, () => console.log(`Gator app listening on port ${PORT}!`));

//change
