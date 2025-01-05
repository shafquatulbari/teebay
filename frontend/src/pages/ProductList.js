import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      description
      price
      rentalRate
      category {
        id
        name
      }
      status
      owner {
        id
      }
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;

const RENT_PRODUCT = gql`
  mutation RentProduct($productId: Int!) {
    rentProduct(productId: $productId) {
      id
      product {
        id
        name
      }
      type
      createdAt
    }
  }
`;

const BUY_PRODUCT = gql`
  mutation BuyProduct($productId: Int!) {
    buyProduct(productId: $productId) {
      id
      product {
        name
      }
      type
      createdAt
    }
  }
`;

const ProductList = () => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [rentProduct] = useMutation(RENT_PRODUCT);
  const [buyProduct] = useMutation(BUY_PRODUCT);

  const currentUserId = Number(localStorage.getItem("userId"));
  console.log("Logged-in user ID:", currentUserId);

  const handleDelete = async (id) => {
    try {
      await deleteProduct({
        variables: { id },
        update(cache) {
          cache.modify({
            fields: {
              getProducts(existingProducts = [], { readField }) {
                return existingProducts.filter(
                  (product) => readField("id", product) !== id
                );
              },
            },
          });
        },
      });
      alert("Product deleted successfully!");
    } catch (err) {
      alert(`Failed to delete product: ${err.message}`);
    }
  };

  const handleRent = async (id) => {
    try {
      const response = await rentProduct({ variables: { productId: id } });
      console.log("Rent Transaction:", response.data.rentProduct);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleBuy = async (id) => {
    try {
      const response = await buyProduct({ variables: { productId: id } });
      console.log("Buy Transactions:", response.data.buyProduct);
      alert("Product bought successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (error) return <p className="text-red-500">Error: {error.message}</p>;
  if (loading) return <p className="text-gray-500">Loading products...</p>;

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center">My Products</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-500 text-white">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Rental Rate</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.getProducts.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-100 transition-colors"
              >
                <td className="px-4 py-2 text-center">{product.name}</td>
                <td className="px-4 py-2 text-center">{product.description}</td>
                <td className="px-4 py-2 text-center">
                  ${product.price.toFixed(2)}
                </td>
                <td className="px-4 py-2 text-center">
                  ${product.rentalRate?.toFixed(2) || "N/A"}
                </td>
                <td className="px-4 py-2 text-center">
                  {product.category?.name || "N/A"}
                </td>
                <td className="px-4 py-2 text-center">{product.status}</td>
                <td className="px-4 py-2 text-center">
                  {product.owner?.id === currentUserId ? (
                    <>
                      <button
                        onClick={() =>
                          navigate(`/edit/${product.id}`, {
                            state: { product },
                          })
                        }
                        className="px-4 py-2 bg-yellow-500 text-white rounded-md mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      {product.status === "AVAILABLE" && (
                        <>
                          <button
                            onClick={() => handleRent(product.id)}
                            className="px-4 py-2 bg-green-500 text-white rounded-md mr-2 hover:bg-green-600"
                          >
                            Rent
                          </button>
                          <button
                            onClick={() => handleBuy(product.id)}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                          >
                            Buy
                          </button>
                        </>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
