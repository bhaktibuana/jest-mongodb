const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const app = require("../../src/app");

describe("Programmer", () => {
  let mongoServer;
  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    await mongoServer.start();
    const URI = mongoServer.getUri();

    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async (done) => {
    mongoose.disconnect(done);
    await mongoServer.stop();
  });

  afterEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany();
    }
  });

  it("should be able to create a programmer", async () => {
    const response = await request(app)
      .post("/programmer")
      .send({
        firstName: "Bhakti",
        lastName: "Mega Buana",
        age: 20,
        programmingLanguages: ["JavaScript", "Java", "Python"],
      });

    expect(response.status).toBe(200);
    const responseGet = await request(app).get("/programmer");
    expect(responseGet.body.length).toBe(1);
  });

  it("should be able to list all programmers", async () => {
    const response = await request(app).get("/programmer");
    expect(response.status).toBe(200);
  });

  it("should not show programmer with unknown id", async () => {
    const response = await request(app).get("/programmer/x");
    expect(response.status).toBe(500);
  });

  it("should show programmer with known id", async () => {
    const responseCreate = await request(app)
      .post("/programmer")
      .send({
        firstName: "Bhakti",
        lastName: "Mega Buana",
        age: 20,
        programmingLanguages: ["JavaScript", "Java", "Python"],
      });
    expect(responseCreate.status).toBe(200);
    const responseGet = await request(app).get(
      `/programmer/${responseCreate.body._id}`
    );
    expect(responseGet.status).toBe(200);
  });

  it("should be able to update a programmer", async () => {
    const responseCreate = await request(app)
      .post("/programmer")
      .send({
        firstName: "Bhakti",
        lastName: "Mega Buana",
        age: 20,
        programmingLanguages: ["JavaScript", "Java", "Python"],
      });
    expect(responseCreate.status).toBe(200);

    const responseUpdate = await request(app)
      .put(`/programmer/${responseCreate.body._id}`)
      .send({
        firstName: "Bhakti",
        lastName: "Mega Buana",
        age: 25,
        programmingLanguages: ["JavaScript", "Java", "Python"],
      });
    expect(responseUpdate.status).toBe(200);

    const responseGet = await request(app).get(
      `/programmer/${responseUpdate.body._id}`
    );
    expect(responseGet.body.age).toBe(25);
  });

  it("should be able to delete a programmer", async () => {
    const responseCreate = await request(app)
      .post("/programmer")
      .send({
        firstName: "Bhakti",
        lastName: "Mega Buana",
        age: 20,
        programmingLanguages: ["JavaScript", "Java", "Python"],
      });
    expect(responseCreate.status).toBe(200);

    const responseDelete = await request(app).delete(
      `/programmer/${responseCreate.body._id}`
    );
    expect(responseDelete.status).toBe(200);

    const response = await request(app).get("/programmer");

    expect(response.body.length).toBe(0);
  });

  it("should not be able to delete nonexistant programmer", async () => {
    const responseDelete = await request(app).delete("/programmer/xx");
    expect(responseDelete.status).toBe(404);
  });
});
