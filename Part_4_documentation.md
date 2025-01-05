# Part 4 Documentation

## Overview
This document provides a detailed explanation of how each part of the problem was solved during the development process. It serves as a technical guide for engineers to understand the implementation and rationale behind each step.

---

## 1. Initialize Project Structure and Setup Environment
### Solution:
- Created a project structure with separate `frontend` and `backend` directories.
- Installed necessary dependencies:
  - **Frontend:** React, Apollo Client, React Router DOM, Tailwind CSS.
  - **Backend:** Apollo Server, Prisma, PostgreSQL, bcrypt, jsonwebtoken.
- Configured ESLint and Prettier for code consistency.

---

## 2. Setup Prisma with PostgreSQL and Define User Model
### Solution:
- Configured Prisma to connect to the PostgreSQL database using a `.env` file for the connection string.
- Defined the `User` model in the Prisma schema:
  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    email     String   @unique
    password  String
    name      String
    createdAt DateTime @default(now())
  }
  ```
- Ran `npx prisma migrate dev` to generate and apply the initial migration, creating the `User` table in the database.

---

## 3. Implement User Registration and Login Resolvers
### Solution:
- Added GraphQL mutations for `registerUser` and `loginUser` in the backend.
- Used `bcrypt` to securely hash passwords during registration and validate passwords during login.
- Generated JWT tokens using `jsonwebtoken` for user authentication.
- Example resolver:
  ```javascript
  loginUser: async (_, { email, password }) => {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error("Invalid email or password");
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) throw new Error("Invalid email or password");
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    return { token, user };
  }
  ```

---

## 4. Implement Login and Registration Forms in React
### Solution:
- Created React components for login and registration forms.
- Integrated Apollo Client to call the `registerUser` and `loginUser` mutations.
- Implemented routing using `react-router-dom` for `/login` and `/register` paths.
- Used Tailwind CSS for styling.

---

## 5. Add Product and Category Models, Implement Product Resolvers
### Solution:
- Extended the Prisma schema to include `Product` and `Category` models with relationships:
  ```prisma
  model Product {
    id          Int      @id @default(autoincrement())
    name        String
    description String
    price       Float
    categoryId  Int
    category    Category @relation(fields: [categoryId], references: [id])
  }
  ```
- Added GraphQL resolvers for adding, editing, and deleting products.
- Ran migrations to update the database schema.

---

## 6. Create Multi-Page Form for Adding and Editing Products
### Solution:
- Built a multi-page form using `react-hook-form` for handling input validation and submission.
- Added navigation buttons (`Next`, `Back`) for a step-by-step form process.
- Integrated Apollo Client to submit data via `addProduct` and `editProduct` mutations.

---

## 7. Implement Product Listing with Edit and Delete Options
### Solution:
- Created a `ProductList` component to fetch and display products using the `getProducts` query.
- Added `Edit` and `Delete` buttons for each product.
- Integrated `deleteProduct` mutation with Apollo Client cache updates to reflect changes immediately in the UI.

---

## 8. Integrate Apollo Cache Updates for Product Management
### Solution:
- Updated Apollo Client cache after add, edit, and delete operations:
  ```javascript
  cache.modify({
    fields: {
      getProducts(existingProducts = []) {
        const newProductRef = cache.writeFragment({
          data: addProduct,
          fragment: gql`fragment NewProduct on Product { id name }`
        });
        return [...existingProducts, newProductRef];
      }
    }
  });
  ```
- Ensured the UI reflects the latest state without requiring a refetch.

---

## 9. Fix Navigation, Implement Rental/Buying Feature, and Add RentalRate Field
### Solution:
- Updated navigation logic to redirect users after login and logout.
- Added `rentalRate` to the `Product` model and updated database migrations.
- Implemented `buyProduct` and `rentProduct` mutations for purchasing and renting products.
- Ensured products with `AVAILABLE` status are displayed with appropriate actions.

---

## 10. Store UserId in LocalStorage
### Solution:
- Decoded the JWT token on the frontend using `jwt-decode` to extract the `userId` and stored it in `localStorage`.
- Updated components to fetch `userId` directly from `localStorage`, eliminating the need for an extra API call.

---

## 11. Add Authentication, Product Management, and Transaction Handling with Styled UI
### Solution:
- Implemented JWT-based authentication with secure password hashing.
- Designed user-friendly login, registration, and product management UIs using Tailwind CSS.
- Added transaction handling for buying and renting products.
- Displayed user-specific data like username and product ownership status in the navigation bar.

---

## 12. Enhance Product Actions with Availability Checks and Fix Transaction Creation
### Solution:
- Added checks in the `ProductList` component to show `Buy` and `Rent` options only for products with `AVAILABLE` status.
- Updated `buyProduct` resolver to return a complete `Transaction` object:
  ```javascript
  const buyTransaction = await prisma.transaction.create({
    data: { productId, userId, type: "BUY" },
    include: { product: true }
  });
  ```
- Improved error handling for unauthorized actions and unavailable products.

---

## Conclusion
This project demonstrates a complete e-commerce platform with user authentication, product management, and transaction handling, using React, Apollo Client, Prisma, and PostgreSQL. The codebase is modular, scalable, and styled for a modern user experience.
