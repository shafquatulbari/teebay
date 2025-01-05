const jwt = require("jsonwebtoken");
const SECRET_KEY = "supersecretkey"; // Replace with a secure key in production

const parseToken = (token) => {
  try {
    if (!token) {
      return null;
    }
    const cleanedToken = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(cleanedToken, SECRET_KEY);
    return decoded.userId;
  } catch (error) {
    console.error("Invalid token:", error.message);
    return null;
  }
};
