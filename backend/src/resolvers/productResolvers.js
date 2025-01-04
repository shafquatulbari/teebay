const prisma = require("../prisma");

const productResolvers = {
  Query: {
    getProducts: async (_, __, { userId }) => {
      if (!userId) {
        throw new Error("Unauthorized: Please log in.");
      }

      const products = await prisma.product.findMany({
        include: { category: true, owner: true },
      });

      // Handle products with missing categories
      return products.map((product) => ({
        ...product,
        category: product.category || null,
      }));
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
        throw new Error("Unauthorized: Please log in.");
      }

      // Fetch transactions for the logged-in user
      return await prisma.transaction.findMany({
        where: {
          OR: [
            { userId }, // Transactions where the user is the buyer or borrower
            { product: { ownerId: userId } }, // Transactions where the user's product is sold or lent
          ],
        },
        include: {
          product: {
            include: {
              owner: true, // Include the owner details of the product
            },
          },
        },
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
          rentalRate: rentalRate || null, // Set rental rate to 0 if not provided
          categoryId,
          ownerId: userId,
        },
        include: {
          owner: true, // Ensure the owner is included in the response
          category: true, // Ensure the category is included in the response
        },
      });
    },

    editProduct: async (_, args, { userId }) => {
      console.log("Received Args:", args); // Log input arguments
      console.log("Context U ID:", userId); // Log the user ID from context

      if (!userId) {
        throw new Error("Unauthorized: Please log in to edit a product.");
      }

      const product = await prisma.product.findUnique({
        where: { id: args.id },
      });
      console.log("Found Product:", product);

      if (!product) {
        throw new Error(`Product with ID ${args.id} does not exist.`);
      }

      const updatedProduct = await prisma.product.update({
        where: { id: args.id },
        data: {
          name: args.name,
          description: args.description,
          price: args.price,
          rentalRate: args.rentalRate,
          status: args.status,
        },
        include: { owner: true },
      });

      console.log("Updated Product:", updatedProduct);
      return updatedProduct;
    },

    deleteProduct: async (_, { id }, { userId }) => {
      const product = await prisma.product.findUnique({ where: { id } });

      if (product.ownerId !== userId) {
        throw new Error("Unauthorized to delete this product");
      }

      // Delete associated transactions first
      await prisma.transaction.deleteMany({
        where: {
          productId: id,
        },
      });

      // Now delete the product
      await prisma.product.delete({
        where: {
          id,
        },
      });

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

      // Create two transactions (BORROW and LEND)
      const transactions = await prisma.transaction.createMany({
        data: [
          {
            productId,
            userId,
            type: "BORROW", // Borrow transaction
          },
          {
            productId,
            userId: product.ownerId,
            type: "LEND", // Lend transaction
          },
        ],
      });

      // Update product status
      await prisma.product.update({
        where: { id: productId },
        data: { status: "RENTED" },
      });

      // Fetch the created transactions with their IDs
      const createdTransactions = await prisma.transaction.findMany({
        where: { productId },
      });

      return createdTransactions;
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

      // Create two transactions (BUY and SELL)
      const transactions = await prisma.transaction.createMany({
        data: [
          {
            productId,
            userId,
            type: "BUY", // Buy transaction
          },
          {
            productId,
            userId: product.ownerId,
            type: "SELL", // Sell transaction
          },
        ],
      });

      // Update product status
      await prisma.product.update({
        where: { id: productId },
        data: { status: "SOLD" },
      });

      // Fetch the created transactions with their IDs
      const createdTransactions = await prisma.transaction.findMany({
        where: { productId },
      });

      return createdTransactions;
    },
  },
};

module.exports = productResolvers;
