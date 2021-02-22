const express = require("express");
const router = express.Router();
const methods = require("../methods");

const collection = "testUser";
const allSongs = "testUser";

router.get("/getAllTracks", async function (req, res) {
  let tracks;
  try {
    tracks = await methods.getTracks(collection);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  GET Tracks Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send(tracks);
});

router.get("/getTracksBulk", async function (req, res) {
  let { playlists } = req.query;
  playlists = playlists ? playlists : [];

  let idsArray;
  if (typeof playlists[0] === "string") {
    idsArray = playlists.map(item => JSON.parse(item).id);
  } else {
    idsArray = playlists.map(item => item.id);
  }
  const query = { _id: { $in: idsArray } };
  let tracks;
  try {
    tracks = await methods.get(allSongs, query);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  GET Tracks Bulk Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send(tracks);
});

router.post("/loadTracks", async function (req, res) {
  const { tracks } = req.body;
  tracks.forEach(track => (track._id = track.id));

  try {
    result = await methods.loadData(collection, tracks);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  HEADER ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    console.error(error.result.result.writeErrors);
    console.error(error.result.result.insertedIds);
  }
  res.send(result);
});

router.post("/loadTracksFromPlaylist", async function (req, res) {
  const { tracks } = req.body;
  tracks.forEach(track => (track._id = track.id));

  try {
    result = await methods.updateBulk(collection, tracks);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  HEADER ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    console.error(error.result.result.writeErrors);
    console.error(error.result.result.insertedIds);
  }
  res.send(result);
});

router.post("/loadTags", async function (req, res) {
  const { newTag, newTags, trackId } = req.body;
  const result = {};
  const collection = "testUser";
  const filter = { id: trackId };
  const newSong = { id: trackId };
  const data = { tags: newTags };
  try {
    result.updateSong = await methods.update(collection, filter, data);
    result.updateTag = await methods.loadData(newTag, [newSong]);
    result.updateTagsCollection = await methods.update(
      "tags",
      { tag: newTag },
      { tag: newTag }
    );
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  LOAD TAGS ERROR ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send({ error, msg: "error-updating" });
  }
  res.send(result);
});

router.post("/removeTags", async function (req, res) {
  const { deletedTag, newTags, trackId } = req.body;
  const result = {};
  const collection = "testUser";
  const filter = { id: trackId };
  const newSong = { id: trackId };
  const data = { tags: newTags };
  try {
    result.updateSong = await methods.update(collection, filter, data);
    result.updateTag = await methods.remove(filter, deletedTag);
    //remove the entire tag if there's no more sogns in the tag
    result.updateTagsCollection = await methods.update(
      { tag: newTag },
      "tags",
      { tag: newTag }
    );
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  LOAD TAGS ERROR ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send({ error, msg: "error-updating" });
  }
  res.send(result);
});

router.get("/getTags", async function (req, res) {
  let tags;
  try {
    tags = await methods.getTags();
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  GET Tags Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send(tags);
});

router.get("/getSongTags", async function (req, res) {
  const { uri } = req.query;
  const query = { uri };
  let track;
  try {
    track = await methods.getTracks(query);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  GET Tags Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send(track[0].tags);
});

router.get("/getAllPlaylists", async function (req, res) {
  const collection = "allPlaylists";
  let playlists;
  try {
    playlists = await methods.get(collection);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  GET All Playlists Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send(playlists);
});

router.get("/getPlaylist", async function (req, res) {
  const { id } = req.query;
  let playlist;
  try {
    playlist = await methods.get(id);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  GET Playlist Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send(playlist);
});

router.get("/getUntaggedSongs", async function (req, res) {
  let playlist;
  try {
    playlist = await methods.get(collection, { tags: { $in: [[], null] } });
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  GET Playlist Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send(playlist);
});

router.post("/createOrUpdatePlaylistCollection", async function (req, res) {
  const { playlistId, trackIds } = req.body;
  trackIds.forEach(item => (item._id = item.id));

  let result;
  try {
    result = await methods.updateBulk(playlistId, trackIds);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  UPDATE Playlist Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    try {
      console.error(error);
      result = await methods.loadData(playlistId, trackIds);
    } catch (error) {
      console.error("~~~~~~~~~~~~~~~~~~~~~");
      console.error("~~~  CREATE Playlist Error ~~~");
      console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
      console.error(error);

      res.send(error);
    }
  } finally {
    res.send(result);
  }
});

router.post("/addPlaylistToAllPlaylists", async function (req, res) {
  const { id, name } = req.body;

  const filter = { id };
  const data = { _id: id, id, name };
  let result;
  try {
    result = await methods.update("allPlaylists", filter, data);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  UPDATE Playlist Error ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);

    res.send(error);
  }
  res.send(result);
});

router.post("/removeTag", async function (req, res) {
  const { deletedTag, newTags, trackId } = req.body;
  let result;
  try {
    const filter = { id: trackId };
    const data = { tags: newTags };
    result.songTags = await methods.update(deletedTag, filter, data);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  /REMOVE TAG FROM SONG ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  try {
    const query = { id: trackId };
    result.tagsCollection = await methods.remove(query, deletedTag);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  /REMOVE SONG FROM TAG ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
    res.send(error);
  }
  res.send;
});

router.post("/remove", async function (req, res) {
  const { tracks } = req.body;
  const tracksIds = tracks.map(track => track.id);
  const query = { id: { $in: tracksIds } };
  const result = {};
  try {
    result.songs = await methods.remove(query);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  /REMOVE SONG ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
  }

  try {
    result.tags = {};
    tracks.forEach(track => {
      track.tags.forEach(tag => {
        result.tags.tag = methods.remove({ id: track.id }, tag);
      });
    });
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  /REMOVE TAGS ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
  }
  res.send(result);
});

router.get("/getTracksFromTag", async function (req, res) {
  const { tag } = req.query;
  let result;
  try {
    result = await methods.get(tag);
  } catch (error) {
    console.error("~~~~~~~~~~~~~~~~~~~~~");
    console.error("~~~  /REMOVE TAGS ~~~");
    console.error("~~~~~~~~~~~~~~~~~~~~~\n\n");
    console.error(error);
  }
  result = result.map(uri => uri.id);
  res.send(result);
});

module.exports = router;
