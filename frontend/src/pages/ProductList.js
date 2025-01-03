import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      description
      price
      category {
        name
      }
      status
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: Int!) {
    deleteProduct(id: $id)
  }
`;

const ProductList = () => {
  const { loading, error, data } = useQuery(GET_PRODUCTS);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);

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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>My Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.getProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>${product.price.toFixed(2)}</td>
              <td>{product.category.name}</td>
              <td>{product.status}</td>
              <td>
                <button
                  onClick={() =>
                    alert(`Edit functionality for Product ID: ${product.id}`)
                  }
                >
                  Edit
                </button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
