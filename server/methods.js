const { MongoClient, ObjectID } = require("mongodb");

const methods = () => {
  const uri = `mongodb+srv://luisan:${process.env.DB_PASSWORD}@moods.hfxeh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const dbName = "users";
  const collection = "testUser";

  function getAllTracks() {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri);
      try {
        await client.connect();
        const db = client.db(dbName);
        let tracks = db.collection(collection).find();
        resolve(await tracks.toArray());
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  function loadData(user, data) {
    return new Promise(async (resolve, reject) => {
      const client = new MongoClient(uri, { useNewUrlParser: true });
      try {
        await client.connect();
        const db = client.db(dbName);

        results = await db.collection(user).insertMany(data);
        resolve(results);
        client.close();
      } catch (error) {
        reject(error);
      }
    });
  }

  return { loadData, getAllTracks };
};

module.exports = methods();
