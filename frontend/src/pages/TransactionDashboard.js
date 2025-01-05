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
  const currentUserId = Number(localStorage.getItem("userId"));

  if (loading) return <p className="text-gray-500">Loading transactions...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const purchases =
    data?.getUserTransactions?.filter(
      (transaction) =>
        transaction.type === "BUY" &&
        transaction.product.owner.id !== currentUserId
    ) || [];

  const sales =
    data?.getUserTransactions?.filter(
      (transaction) =>
        transaction.type === "SELL" &&
        transaction.product.owner.id === currentUserId
    ) || [];

  const borrowed =
    data?.getUserTransactions?.filter(
      (transaction) =>
        transaction.type === "BORROW" &&
        transaction.product.owner.id !== currentUserId
    ) || [];

  const lent =
    data?.getUserTransactions?.filter(
      (transaction) =>
        transaction.type === "LEND" &&
        transaction.product.owner.id === currentUserId
    ) || [];

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">My Transactions</h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Purchased Products</h3>
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((transaction) => (
              <tr key={transaction.id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2 text-center">
                  {transaction.product.name}
                </td>
                <td className="px-4 py-2 text-center">
                  ${transaction.product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {new Date(Number(transaction.createdAt)).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Sold Products</h3>
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-500 text-white">
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((transaction) => (
              <tr key={transaction.id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2 text-center">
                  {transaction.product.name}
                </td>
                <td className="px-4 py-2 text-center">
                  ${transaction.product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  {new Date(Number(transaction.createdAt)).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Borrowed Products</h3>
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-yellow-500 text-white">
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {borrowed.map((transaction) => (
              <tr key={transaction.id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2 text-center">
                  {transaction.product.name}
                </td>
                <td className="px-4 py-2 text-center">
                  {new Date(Number(transaction.createdAt)).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-4">Lent Products</h3>
        <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-red-500 text-white">
              <th className="px-4 py-2">Product Name</th>
              <th className="px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {lent.map((transaction) => (
              <tr key={transaction.id} className="border-t hover:bg-gray-100">
                <td className="px-4 py-2 text-center">
                  {transaction.product.name}
                </td>
                <td className="px-4 py-2 text-center">
                  {new Date(Number(transaction.createdAt)).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionDashboard;
