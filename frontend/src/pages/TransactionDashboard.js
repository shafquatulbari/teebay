import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_USER_TRANSACTIONS = gql`
  query GetUserTransactions {
    getUserTransactions {
      id
      product {
        id
        name
        price
        owner {
          id
        }
      }
      type
      createdAt
    }
  }
`;

const TransactionDashboard = () => {
  const { loading, error, data } = useQuery(GET_USER_TRANSACTIONS);
  console.log("Transaction Data:", data);

  const currentUserId = Number(localStorage.getItem("userId"));

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Filter transactions based on type and user involvement
  const purchases = data.getUserTransactions.filter(
    (transaction) =>
      transaction.type === "BUY" && transaction.userId === currentUserId
  );

  const sales = data.getUserTransactions.filter(
    (transaction) =>
      transaction.type === "SELL" &&
      transaction.product.owner.id === currentUserId
  );

  const borrowed = data.getUserTransactions.filter(
    (transaction) =>
      transaction.type === "BORROW" && transaction.userId === currentUserId
  );

  const lent = data.getUserTransactions.filter(
    (transaction) =>
      transaction.type === "LEND" &&
      transaction.product.owner.id === currentUserId
  );

  return (
    <div>
      <h2>My Transactions</h2>

      <h3>Purchased Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.product.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Sold Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.product.name}</td>
              <td>${transaction.product.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Borrowed Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
          </tr>
        </thead>
        <tbody>
          {borrowed.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.product.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Lent Products</h3>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
          </tr>
        </thead>
        <tbody>
          {lent.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.product.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDashboard;
