const prisma = require("../prisma");

const productResolvers = {
  Query: {
    getProducts: async () => {
      return await prisma.product.findMany({
        include: { category: true, owner: true },
      });
    },
    getProductById: async (_, { id }) => {
      return await prisma.product.findUnique({
        where: { id },
        include: { category: true, owner: true },
      });
    },
    getUserTransactions: async (_, __, { userId }) => {
      return await prisma.transaction.findMany({
        where: { userId },
        include: { product: true },
      });
    },
  },

  Mutation: {
    addProduct: async (
      _,
      { name, description, price, categoryId },
      { userId }
    ) => {
      if (!userId) {
        throw new Error("Unauthorized: Please log in to add a product.");
      }

      // Check if the category exists
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) {
        throw new Error(`Category with ID ${categoryId} does not exist.`);
      }

      // Create the product and include the owner relationship
      return await prisma.product.create({
        data: {
          name,
          description,
          price,
          categoryId,
          ownerId: userId,
        },
        include: {
          owner: true, // Ensure the owner is included in the response
        },
      });
    },

    editProduct: async (
      _,
      { id, name, description, price, status },
      { userId }
    ) => {
      if (!userId) {
        throw new Error("Unauthorized: Please log in to edit a product.");
      }

      // Find the product by ID
      const product = await prisma.product.findUnique({ where: { id } });

      // If the product does not exist, throw an error
      if (!product) {
        throw new Error(`Product with ID ${id} does not exist.`);
      }

      // Ensure the user is the owner of the product
      if (product.ownerId !== userId) {
        throw new Error("Unauthorized: You can only edit your own products.");
      }

      // Update the product and include the owner relationship
      return await prisma.product.update({
        where: { id },
        data: { name, description, price, status },
        include: { owner: true }, // Ensure the owner is included in the response
      });
    },

    deleteProduct: async (_, { id }, { userId }) => {
      const product = await prisma.product.findUnique({ where: { id } });
      if (product.ownerId !== userId) {
        throw new Error("Unauthorized to delete this product");
      }
      await prisma.product.delete({ where: { id } });
      return "Product deleted successfully";
    },
  },
};

module.exports = productResolvers;
