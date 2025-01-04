import React from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      id
      name
      description
      price
      rentalRate
      category {
        name
      }
      status
      owner {
        id
      }
    }
  }
`;

const GET_USER_ID = gql`
  query GetUserId {
    getUserId
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
  const { data: userData, loading: userLoading } = useQuery(GET_USER_ID); // Fetch user ID
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  const [rentProduct] = useMutation(RENT_PRODUCT);
  const [buyProduct] = useMutation(BUY_PRODUCT);

  const currentUserId = userData?.getUserId; // Current logged-in user ID
  const handleEdit = (product) => {
    navigate(`/edit/${product.id}`, { state: { product } });
  };

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
      await rentProduct({ variables: { productId: id } });
      alert("Product rented successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleBuy = async (id) => {
    try {
      await buyProduct({ variables: { productId: id } });
      alert("Product bought successfully!");
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading || userLoading) return <p>Loading...</p>; // Wait for both queries to load
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
            <th>Rental Rate</th> {/* Add Rental Rate */}
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
              <td>${product.rentalRate?.toFixed(2)}</td>
              {/* Rental Rate */}
              <td>{product.category.name}</td>
              <td>{product.status}</td>
              <td>
                {product.owner?.id === currentUserId ? (
                  <>
                    <button onClick={() => navigate(`/edit/${product.id}`)}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)}>
                      Delete
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleRent(product.id)}>Rent</button>
                    <button onClick={() => handleBuy(product.id)}>Buy</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
