const request = require("supertest");
const app = require("../src/app");

describe("GET /status", () => {
  test("should return ok", async () => {
    const response = await request(app).get("/status");

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("ok");
  });
});