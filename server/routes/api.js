const express = require("express");
const router = express.Router();
const methods = require("../methods");

router.get("/getAll", async function (req, res) {
  console.log("get all songs");
  let tracks;
  try {
    tracks = await methods.getAllTracks();
  } catch (error) {
    console.log("~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~  GET Tracks Error ~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.log(error);
  }
  console.log({ tracks });
  res.send(tracks);
});

router.post("/loadAll", async function (req, res) {
  console.log("load songs");
  const { tracks } = req.body;
  try {
    result = await methods.loadData("testUser", tracks);
  } catch (error) {
    console.log("~~~~~~~~~~~~~~~~~~~~~");
    console.log("~~~  HEADER ~~~");
    console.log("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.log(error);
  }
  console.log({ result });
  res.send(result);
});

module.exports = router;
