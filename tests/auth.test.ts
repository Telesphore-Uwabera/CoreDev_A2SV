import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../src/app";
import { userRepository } from "../src/repositories/user.repository";

describe("Auth routes", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("POST /api/auth/register succeeds with valid payload", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue(null);
    vi.spyOn(userRepository, "findByUsername").mockResolvedValue(null);
    vi.spyOn(userRepository, "create").mockResolvedValue({
      id: "user-123",
      username: "testuser",
      email: "test@example.com",
      password: "hashed-password",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Awaited<ReturnType<typeof userRepository.create>>);

    const response = await request(app).post("/api/auth/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "Password1!",
    });

    expect(response.status).toBe(201);
    expect(response.body.Success).toBe(true);
    expect(response.body.Object).toMatchObject({
      id: "user-123",
      username: "testuser",
      email: "test@example.com",
      role: "USER",
    });
    expect(response.body.Object).not.toHaveProperty("password");
  });

  test("POST /api/auth/register fails with invalid payload", async () => {
    const response = await request(app).post("/api/auth/register").send({
      username: "ab",
      email: "not-an-email",
      password: "weak",
    });

    expect(response.status).toBe(400);
    expect(response.body.Success).toBe(false);
  });

  test("POST /api/auth/login succeeds with valid credentials", async () => {
    const hashedPassword = await bcrypt.hash("Password1!", 4);
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue({
      id: "user-123",
      username: "testuser",
      email: "test@example.com",
      password: hashedPassword,
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@example.com",
      password: "Password1!",
    });

    expect(response.status).toBe(200);
    expect(response.body.Success).toBe(true);
    expect(response.body.Object.token).toBeDefined();
    expect(response.body.Object.user).toMatchObject({
      id: "user-123",
      username: "testuser",
      email: "test@example.com",
      role: "USER",
    });
  });

  test("POST /api/auth/login returns 401 for invalid credentials", async () => {
    vi.spyOn(userRepository, "findByEmail").mockResolvedValue(null);

    const response = await request(app).post("/api/auth/login").send({
      email: "missing@example.com",
      password: "Password1!",
    });

    expect(response.status).toBe(401);
    expect(response.body.Success).toBe(false);
  });
});

