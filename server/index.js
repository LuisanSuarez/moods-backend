require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const db = require("./methods");
const data = require("./mockData");

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;
const user = process.env.DEV_USER || testUser;

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

main();

app.get("/", (req, res) => {
  res.send(process.env.DATABASE_PASSWORD);
});

app.listen(PORT, () => console.log(`Gator app listening on port ${PORT}!`));
