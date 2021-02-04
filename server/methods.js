const { MongoClient, ObjectID } = require("mongodb");

const methods = () => {
  const uri = `mongodb+srv://luisan:${process.env.DB_PASSWORD}@moods.hfxeh.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  const dbName = "users";

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

  return { loadData };
};

module.exports = methods();
