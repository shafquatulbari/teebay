import React from "react";
import { useQuery, gql } from "@apollo/client";

const GET_USER_TRANSACTIONS = gql`
  query GetUserTransactions {
    getUserTransactions {
      id
      product {
        name
        price
      }
      type
      createdAt
    }
  }
`;

const TransactionDashboard = () => {
  const { loading, error, data } = useQuery(GET_USER_TRANSACTIONS);

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const userSoldProducts = data.getUserTransactions.filter(
    (transaction) => transaction.product.owner.id === data.userId
  );

  return (
    <div>
      <h2>My Transactions</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.getUserTransactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.product.name}</td>
              <td>${transaction.product.price.toFixed(2)}</td>
              <td>{transaction.type}</td>
              <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDashboard;
