describe("MongoDB", function () {
  it("¿Está corriendo el servidor?", function (next) {
    var MongoClient=require("mongod").MongoClient;

    MongoClient.Connect("mongodb://127.0.0.1:27017/inmo", function (err, db) {
      expect(err).toBe(null);
      next();
    });
  });
});

