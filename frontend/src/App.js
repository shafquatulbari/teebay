import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MultiPageForm from "./pages/MultiPageForm";
import ProductList from "./pages/ProductList";
import TransactionDashboard from "./pages/TransactionDashboard";
import { useState } from "react";

const AppRoutes = ({ isAuthenticated, setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const username = localStorage.getItem("username");

  return (
    <div>
      <header className="p-4 bg-gray-900 text-white text-center text-2xl font-bold">
        Teebay
      </header>
      {isAuthenticated && (
        <nav className="p-4 bg-gray-800 text-white flex justify-between items-center">
          <h1 className="text-lg font-bold">
            Logged in user: {localStorage.getItem("username")}
          </h1>
          <div>
            <button
              onClick={() => navigate("/products")}
              className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 mr-2"
            >
              Products
            </button>
            <button
              onClick={() => navigate("/transactions")}
              className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 mr-2"
            >
              Transactions
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded-md hover:bg-red-600 mr-2"
            >
              Logout
            </button>
            <button
              onClick={() => navigate("/add")}
              className="px-4 py-2 bg-yellow-500 rounded-md hover:bg-yellow-600"
            >
              Add Product
            </button>
          </div>
        </nav>
      )}
      <Routes>
        {!isAuthenticated && (
          <>
            <Route
              path="/login"
              element={<Login onLogin={() => setIsAuthenticated(true)} />}
            />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
        {isAuthenticated && (
          <>
            <Route path="/products" element={<ProductList />} />
            <Route path="/add" element={<MultiPageForm />} />
            <Route
              path="/edit/:id"
              element={<MultiPageForm isEditing={true} />}
            />
            <Route path="/transactions" element={<TransactionDashboard />} />
            <Route path="*" element={<Navigate to="/products" />} />
          </>
        )}
      </Routes>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  return (
    <Router>
      <AppRoutes
        isAuthenticated={isAuthenticated}
        setIsAuthenticated={setIsAuthenticated}
      />
    </Router>
  );
};

export default App;
