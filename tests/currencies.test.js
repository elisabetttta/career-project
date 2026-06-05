require("dotenv").config();
const request = require("supertest");
const app = require("../src/app");
describe("Currencies API", () => {
  test("GET /currencies", async () => {
const res = await request(app)
   .get("/currencies")
    .set("Authorization", `Bearer ${process.env.TOKEN}`)
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
  test("POST /currencies", async () => {
 const res = await request(app)
   .post("/currencies")
   .set("Authorization", `Bearer ${process.env.TOKEN}`)
   .send({
   name: "US Dollar",
   ticker: "USD"
  });
console.log(res.statusCode);
console.log(res.text);
console.log(res.body);
 expect(res.statusCode).toBe(201);
 expect(res.body.ticker).toBe("USD");
});
});