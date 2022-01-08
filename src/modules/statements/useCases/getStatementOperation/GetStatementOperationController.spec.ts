import request from "supertest";
import { hash } from 'bcryptjs';
import { Connection } from "typeorm";
import { v4 as uuidv4 } from "uuid";

import { app } from "../../../../app"
import createConnection from "../../../../database";

describe("Get Statement Operation Controller", () => {
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
    
    await connection.query(`
      INSERT INTO statements(id, user_id, description, amount, type, created_at, updated_at)
      values('${id}', '${id}', 'description', 200, 'deposit', 'now()', 'now()')
    `);
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to get user statement", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    var statement = await connection.query(`SELECT id FROM statements LIMIT 1`)
   
    const response = await request(app)
      .get(`/api/v1/statements/${statement[0].id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id");
  });

  it("should not be able to get user balance when user is not found", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    var statement = await connection.query(`SELECT id FROM statements LIMIT 1`)
    
    await connection.query(`
      DELETE FROM users WHERE email = 'user@email.com'
    `);

    const response = await request(app)
      .get(`/api/v1/statements/${statement[0].id}`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message");
  });

  it("should not be able to get user balance when statement is not found", async () => {
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "user@email.com",
        password: "123456",
      });

    const { token } = responseToken.body;

    const response = await request(app)
      .get(`/api/v1/statements/42c54e12-c2f4-4f4d-99e3-aedee26188a7`)
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
});
