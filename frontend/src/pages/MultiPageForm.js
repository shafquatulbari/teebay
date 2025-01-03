import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";

export const GET_CATEGORIES = gql`
  query GetCategories {
    getCategories {
      id
      name
    }
  }
`;

export const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $description: String!
    $price: Float!
    $categoryId: Int!
  ) {
    addProduct(
      name: $name
      description: $description
      price: $price
      categoryId: $categoryId
    ) {
      id
      name
      description
      price
      category {
        id
        name
      }
      status
    }
  }
`;
export const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $id: Int!
    $name: String
    $description: String
    $price: Float
    $status: String
  ) {
    editProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      status: $status
    ) {
      id
      name
      description
      price
      status
      category {
        id
        name
      }
    }
  }
`;

const MultiPageForm = ({ isEditing, productId, preloadedData }) => {
  const [step, setStep] = useState(1);
  const { control, handleSubmit } = useForm({
    defaultValues: preloadedData || {
      name: "",
      description: "",
      price: "",
      categoryId: "",
    },
  });

  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const [addProduct] = useMutation(ADD_PRODUCT, {
    update(cache, { data: { addProduct } }) {
      cache.modify({
        fields: {
          getProducts(existingProducts = []) {
            const newProductRef = cache.writeFragment({
              data: addProduct,
              fragment: gql`
                fragment NewProduct on Product {
                  id
                  name
                  description
                  price
                  category {
                    id
                    name
                  }
                  status
                }
              `,
            });
            return [...existingProducts, newProductRef];
          },
        },
      });
    },
  });

  const [editProduct] = useMutation(EDIT_PRODUCT);

  const onSubmit = async (data) => {
    try {
      if (isEditing) {
        await editProduct({
          variables: { id: productId, ...data },
        });
        alert("Product updated successfully!");
      } else {
        await addProduct({
          variables: {
            ...data,
            price: parseFloat(data.price), // Ensure price is a Float
            categoryId: parseInt(data.categoryId), // Ensure categoryId is an Int
          },
        });
        alert("Product added successfully!");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {step === 1 && (
          <>
            <label>Name</label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <input {...field} placeholder="Product Name" required />
              )}
            />
            <label>Description</label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder="Product Description"
                  required
                />
              )}
            />
          </>
        )}
        {step === 2 && (
          <>
            <label>Price</label>
            <Controller
              name="price"
              control={control}
              render={({ field }) => (
                <input {...field} type="number" placeholder="Price" required />
              )}
            />
            <label>Category</label>
            {loading && <p>Loading categories...</p>}
            {error && <p>Error loading categories: {error.message}</p>}
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <select {...field} required disabled={loading || error}>
                  <option value="">Select a Category</option>
                  {data?.getCategories?.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </>
        )}
        <div>
          {step > 1 && (
            <button type="button" onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
          )}
          {step < 2 && (
            <button type="button" onClick={() => setStep((s) => s + 1)}>
              Next
            </button>
          )}
          {step === 2 && <button type="submit">Submit</button>}
        </div>
      </form>
    </div>
  );
};

export default MultiPageForm;
