const mongoose = require("mongoose");
const request = require("supertest");
require("dotenv").config();

const app = require("../app");

const { DB_HOST, PORT = 3000 } = process.env;

describe("test login controller", () => {
  let server;
  beforeAll(() => (server = app.listen(PORT)));
  afterAll(() => server.close());

  beforeEach((done) => {
    mongoose.connect(DB_HOST).then(() => done());
  });

  afterEach((done) => {
    mongoose.connection.close(() => done());
  });

  test("test login", async () => {
    const response = await request(app)
      .post("/api/users/login")
      .send({ email: "mary@mail.com", password: "123456" });
    expect(response.statusCode).toBe(200);
    const { body } = response;
    expect(body.user.token).toBeTruthy();
    expect(typeof body.user.email).toBe("string");
    expect(typeof body.user.subscription).toBe("string");
  });
});
