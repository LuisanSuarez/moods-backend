const { MongoClient, ObjectID } = require("mongodb");

const methods = () => {
  const uri = `mongodb+srv://luisan:${process.env.DB_PASSWORD}@moods.hfxeh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const dbName = process.env.DB_NAME;
  const collection = "testUser";

  function getTracks(query = {}) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        let tracks = db.collection(collection).find(query);
        tracks = await tracks.toArray();
        resolve(tracks);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function get(collection, query = {}) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        let result = db.collection(collection).find(query);
        result = await result.toArray();
        resolve(result);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function getTags() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        let tracks = db.collection("tags").find();
        tracks = await tracks.toArray();
        resolve(tracks);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function getSongTags(query) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        let tracks = db.collection(collection).find(query);
        tracks = await tracks.toArray();
        resolve(tracks);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function loadData(collection, data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri, { useNewUrlParser: true });
      try {
        await client.connect();
        const db = client.db(dbName);

        const results = await db.collection(collection).insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function update(collection, filter, data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri, { useNewUrlParser: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const results = await db
          .collection(collection)
          .findOneAndUpdate(filter, { $set: data }, { upsert: true });

        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function updateBulk(collection, data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri, { useNewUrlParser: true });
      try {
        await client.connect();
        const db = client.db(dbName);
        const bulk = db.collection(collection).initializeUnorderedBulkOp();
        data.forEach(item => {
          bulk.find({ _id: item._id }).upsert().update({ $set: item });
        });
        const results = await bulk.execute();
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function remove(query, collection = collection) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        const removed = await db.collection(collection).deleteMany(query);
        resolve(removed);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function deleteAll() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        const removed = await db.collection(collection).drop();
        resolve(removed);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return {
    loadData,
    get,
    getTracks,
    getTags,
    getSongTags,
    remove,
    update,
    updateBulk,
    deleteAll,
  };
};

module.exports = methods();
