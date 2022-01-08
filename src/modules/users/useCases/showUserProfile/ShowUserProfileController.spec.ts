import request from "supertest";
import { hash } from 'bcryptjs';
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../app"
import createConnection from "../../../../database";

describe("Show User Profile Controller", () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash("123456", 8);

    await connection.query(`
      INSERT INTO users(id, name, email, password, created_at, updated_at)
      values('${id}', 'user', 'user@email.com', '${password}', 'now()', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show user profile", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to show user profile when user is not logged in", async () => {
    const response = await request(app)
      .get("/api/v1/profile");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should not be able to show user profile when user is not found", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    await connection.query(`
      DELETE FROM users WHERE email = 'user@email.com'
    `);

    const { token } = responseToken.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
