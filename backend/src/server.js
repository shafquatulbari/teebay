const { ApolloServer, gql } = require("apollo-server");
const prisma = require("./prisma");

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: async () => {
      const users = await prisma.user.findMany();
      return `Number of users: ${users.length}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
