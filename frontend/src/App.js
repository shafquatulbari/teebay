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
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div>
      {isAuthenticated && (
        <nav>
          <h1> Logged in user: {localStorage.getItem("userId")}</h1>
          <button onClick={() => navigate("/products")}>Products</button>
          <button onClick={() => navigate("/transactions")}>
            Transactions
          </button>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/add")}>Add Product</button>
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
