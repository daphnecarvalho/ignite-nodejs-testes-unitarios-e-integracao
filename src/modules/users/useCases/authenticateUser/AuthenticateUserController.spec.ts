import request from "supertest";
import { hash } from 'bcryptjs';
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../app"
import createConnection from "../../../../database";

describe("Authenticate User Controller", () => {
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

  it("should be able to authenticate user", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    expect(responseToken.status).toBe(200);
    expect(responseToken.body).toHaveProperty("token");
  });

  it("should not be able to authenticate user when user is not found", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "admin@email.com",
        password: "123456",
      });

    expect(responseToken.status).toBe(401);
    expect(responseToken.body).toHaveProperty("message");
  });

  it("should not be able to authenticate user when password is incorret", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "password",
      });

    expect(responseToken.status).toBe(401);
    expect(responseToken.body).toHaveProperty("message");
  });
});
