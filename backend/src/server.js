const { ApolloServer, gql } = require("apollo-server");
const fs = require("fs");
const path = require("path");
const prisma = require("./prisma");
const userResolvers = require("./resolvers/userResolvers");

// Read schema
const typeDefs = fs.readFileSync(
  path.join(__dirname, "../src/schema/schema.graphql"),
  "utf8"
);

// const resolvers = {
//   Query: {
//     hello: async () => {
//       const users = await prisma.user.findMany();
//       return `Number of users: ${users.length}`;
//     },
//   },
// };

const server = new ApolloServer({ typeDefs, resolvers: userResolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
