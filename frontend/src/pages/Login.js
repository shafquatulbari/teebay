import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";

const LOGIN_USER = gql`
  mutation LoginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password)
  }
`;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loginUser, { data, loading, error }] = useMutation(LOGIN_USER);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({ variables: { ...formData } });
      const token = response.data.loginUser;
      localStorage.setItem("token", token); // Store the token
      alert("Login successful!");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>
      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />
      <button type="submit" disabled={loading}>
        Login
      </button>
      {error && <p>Error: {error.message}</p>}
      {data && <p>Login successful!</p>}
    </form>
  );
};

export default Login;
