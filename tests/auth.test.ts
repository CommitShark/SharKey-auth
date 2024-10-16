import request from "supertest";
import bcrypt from "bcrypt";
import app from "../src/app";
import User from "../src/models/User";
import sequelize from "../src/db/init";

jest.mock("../src/models/User");

jest.mock("bcrypt", () => ({
  compare: jest.fn((password, hash) => password === "password123"), // Always return true for 'password123'
  hash: jest.fn((password) => Promise.resolve(`hashed${password}`)), // Fake hash function
}));

describe("Auth API Tests with Mocked DB", () => {
  beforeEach(() => {
    // Clear mock calls and reset mock behavior before each test
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe("POST /signup", () => {
    it("should create a new user", async () => {
      // Mock the create method to return a simulated user
      (User.create as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
        password: "hashedpassword123",
      });

      const res = await request(app).post("/signup").send({
        email: "test@example.com",
        password: "Password123@",
        firstName: "Pelumi",
        lastName: "Akinrele",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("email", "test@example.com");
      expect(User.create).toHaveBeenCalledWith({
        email: "test@example.com",
        password: expect.any(String),
        firstName: "Pelumi",
        lastName: "Akinrele",
      });
    });

    it("should not allow duplicate emails", async () => {
      // Mock the findOne method to simulate an existing user
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "test@example.com",
      });

      const res = await request(app).post("/signup").send({
        email: "test@example.com",
        password: "Password123@",
        firstName: "Pelumi",
        lastName: "Akinrele",
      });

      expect(res.status).toBe(400); // Expecting a failure due to duplicate email
    });
  });

  describe("POST /login", () => {
    it("should log in an existing user and return a JWT token", async () => {
      // Mock the findOne method to return a user for login
      (User.findOne as jest.Mock).mockResolvedValue({
        id: 1,
        email: "testlogin@example.com",
        password: await bcrypt.hash("password123", 10), // Simulate hashed password
      });

      const res = await request(app).post("/login").send({
        email: "testlogin@example.com",
        password: "password123",
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    it("should return 401 for invalid credentials", async () => {
      // Mock findOne to return null (user not found)
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post("/login").send({
        email: "wrong@example.com",
        password: "incorrect",
      });

      expect(res.status).toBe(401);
    });
  });
});
