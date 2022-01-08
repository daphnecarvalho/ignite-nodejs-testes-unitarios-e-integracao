import request from "supertest";
import { hash } from 'bcryptjs';
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../app"
import createConnection from "../../../../database";

describe("Create Statement Controller", () => {
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

  it("should be able to create a new deposit", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 200,
        description: "description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should be able to create a new withdraw", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        amount: 50,
        description: "description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to create a new statement when user has not enough funds", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 950,
        description: "description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should not be able to create a new statement when user is not logged in", async () => {
    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 950,
        description: "description",
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });

  it("should not be able to create a new statement when user is not found", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    await connection.query(`
      DELETE FROM users WHERE email = 'user@email.com'
    `);

    const response = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        amount: 950,
        description: "description",
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });
});
