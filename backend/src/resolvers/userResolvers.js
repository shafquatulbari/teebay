const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "supersecretkey"; // Replace with a secure key in production

const userResolvers = {
  Query: {
    getUserId: (_, __, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized: Please log in.");
      }
      return userId; // Return the user ID from the context
    },
  },
  Mutation: {
    registerUser: async (_, { email, password, name }) => {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error("User already exists with this email.");
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create user
      const newUser = await prisma.user.create({
        data: { email, password: hashedPassword, name },
      });

      return newUser;
    },

    loginUser: async (_, { email, password }) => {
      // Check if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error("Invalid email or password.");
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid email or password.");
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        SECRET_KEY,
        {
          expiresIn: "1h",
        }
      );

      return token;
    },
  },
};

module.exports = userResolvers;
