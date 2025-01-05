# Project: Teebay

## Summary
Teebay is an e-commerce platform designed to facilitate product listings, rentals, and sales. The project is built with a modern tech stack comprising React, Apollo Client, Prisma, PostgreSQL, and Tailwind CSS. It features user authentication, product management, transaction handling, and a styled user interface.

### Key Features
- **User Authentication:** Secure registration and login using JWT and bcrypt.
- **Product Management:** Add, edit, delete, rent, and buy products.
- **Category Management:** Define product categories using Prisma Studio.
- **Transactions:** Handle product rentals and purchases with detailed records.
- **Responsive UI:** Styled with Tailwind CSS for a seamless user experience.

---

## Setup and Run Instructions

### Prerequisites
Ensure you have the following installed on your system:
- Node.js (v16 or above)
- PostgreSQL (configured and running)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the `.env` file with your database connection string:
   ```env
   DATABASE_URL="postgresql://<username>:<password>@localhost:5432/<database_name>"
   ```
4. Initialize Prisma and apply migrations:
   ```bash
   npx prisma migrate dev
   ```
5. Start the backend server:
   ```bash
   npm start
   ```

### Adding Categories with Prisma Studio
To add product categories:
1. Run Prisma Studio:
   ```bash
   npx prisma studio
   ```
2. Navigate to the `Category` model and add entries directly.
3. Save changes to reflect them in your database.

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## Scripts
| Script           | Description                                    |
|-------------------|------------------------------------------------|
| `npm start`      | Runs the development server for frontend.     |
| `npm run build`  | Builds the frontend for production.           |
| `npm run test`   | Runs tests for the frontend.                  |
| `npm start` (backend) | Starts the backend server.               |

---

## Dependencies
### Frontend
- React
- Apollo Client
- Tailwind CSS
- React Router DOM
- react-hook-form

### Backend
- Apollo Server
- Prisma
- PostgreSQL
- bcrypt
- jsonwebtoken

---

Teebay is designed for scalability and ease of use. Feel free to contribute or report issues to enhance the platform!
