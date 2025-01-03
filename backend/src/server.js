const { gql } = require("apollo-server");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const fs = require("fs");
const path = require("path");
const prisma = require("./prisma");
const userResolvers = require("./resolvers/userResolvers");
const productResolvers = require("./resolvers/productResolvers");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const SECRET_KEY = "supersecretkey"; // Replace this with your secure key

const resolvers = [userResolvers, productResolvers];

// Read schema
const typeDefs = fs.readFileSync(
  path.join(__dirname, "../src/schema/schema.graphql"),
  "utf8"
);

const parseToken = (token) => {
  try {
    if (!token) {
      return null;
    }
    // Remove "Bearer " prefix if present
    const cleanedToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(cleanedToken, SECRET_KEY);
    return decoded.userId; // Extract and return only userId
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
};

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    const token = req.headers.authorization || "";
    const userId = parseToken(token); // Only return userId
    // if (!userId) {
    //   throw new Error("Unauthorized: Invalid or missing token");
    // }
    return { userId };
  },
});

server.start().then(() => {
  server.applyMiddleware({ app });
  app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
});
