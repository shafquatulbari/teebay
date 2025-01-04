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
    getCategories: async () => {
      return await prisma.category.findMany();
    },
    getUserTransactions: async (_, __, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized: Please log in to view transactions.");
      }

      return await prisma.transaction.findMany({
        where: { userId },
        include: { product: true },
      });
    },
  },

  Mutation: {
    addProduct: async (
      _,
      { name, description, price, rentalRate, categoryId },
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
          rentalRate,
          categoryId,
          ownerId: userId,
        },
        include: {
          owner: true, // Ensure the owner is included in the response
          category: true, // Ensure the category is included in the response
        },
      });
    },

    editProduct: async (
      _,
      { id, name, description, price, rentalRate, status },
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
        data: { name, description, price, rentalRate, status },
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
    rentProduct: async (_, { productId }, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized: Please log in to rent a product.");
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new Error(`Product with ID ${productId} does not exist.`);
      }

      if (product.status !== "AVAILABLE") {
        throw new Error("Product is not available for rent.");
      }

      const transaction = await prisma.transaction.create({
        data: {
          productId,
          userId,
          type: "RENT",
        },
      });

      await prisma.product.update({
        where: { id: productId },
        data: { status: "RENTED" },
      });

      return transaction;
    },

    buyProduct: async (_, { productId }, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized: Please log in to buy a product.");
      }

      const product = await prisma.product.findUnique({
        where: { id: productId },
      });
      if (!product) {
        throw new Error(`Product with ID ${productId} does not exist.`);
      }

      if (product.status !== "AVAILABLE") {
        throw new Error("Product is not available for purchase.");
      }

      const transaction = await prisma.transaction.create({
        data: {
          productId,
          userId,
          type: "BUY",
        },
      });

      await prisma.product.update({
        where: { id: productId },
        data: { status: "SOLD" },
      });

      return transaction;
    },
  },
};

module.exports = productResolvers;
