import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client";
import { useQuery } from "@apollo/client";
import { useLocation } from "react-router-dom";

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
    $rentalRate: Float
    $categoryId: Int!
  ) {
    addProduct(
      name: $name
      description: $description
      price: $price
      rentalRate: $rentalRate
      categoryId: $categoryId
    ) {
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
    }
  }
`;

export const EDIT_PRODUCT = gql`
  mutation EditProduct(
    $id: Int!
    $name: String
    $description: String
    $price: Float
    $rentalRate: Float
    $status: String
  ) {
    editProduct(
      id: $id
      name: $name
      description: $description
      price: $price
      rentalRate: $rentalRate
      status: $status
    ) {
      id
      name
      description
      price
      rentalRate
      status
      category {
        id
        name
      }
    }
  }
`;

const MultiPageForm = ({ isEditing, productId }) => {
  const [step, setStep] = useState(1);
  const { state } = useLocation();

  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      id: state?.product?.id || "",
      name: state?.product?.name || "",
      description: state?.product?.description || "",
      price: state?.product?.price || "",
      rentalRate: state?.product?.rentalRate || "",
      categoryId: state?.product?.category?.id || "",
      status: state?.product?.status || "",
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
                  rentalRate
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

  const [editProduct] = useMutation(EDIT_PRODUCT, {
    update(cache, { data: { editProduct } }) {
      cache.modify({
        fields: {
          getProducts(existingProducts = []) {
            const updatedProductRef = cache.writeFragment({
              data: editProduct,
              fragment: gql`
                fragment UpdatedProduct on Product {
                  id
                  name
                  description
                  price
                  category {
                    id
                    name
                  }
                  rentalRate
                  status
                }
              `,
            });
            return existingProducts.map((product) =>
              product.id === editProduct.id ? updatedProductRef : product
            );
          },
        },
      });
    },
  });

  React.useEffect(() => {
    if (isEditing && state?.product) {
      const { product } = state;
      Object.keys(product).forEach((key) => {
        setValue(key, product[key]);
      });
    }
  }, [isEditing, state, setValue]);

  const onSubmit = async (data) => {
    const variables = {
      id: productId || state?.product?.id,
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      rentalRate: data.rentalRate ? parseFloat(data.rentalRate) : null,
      status: data.status || null,
    };

    console.log("Variables for editProduct:", variables);

    try {
      if (isEditing) {
        await editProduct({ variables });
        alert("Product updated successfully!");
      } else {
        await addProduct({
          variables: {
            ...variables,
            categoryId: parseInt(data.categoryId),
          },
        });
        alert("Product added successfully!");
      }
    } catch (err) {
      console.error("variables", variables);
      console.error("GraphQL Error:", err);
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
            <label>Rental Rate</label>
            <Controller
              name="rentalRate"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Rental Rate"
                  required={!isEditing}
                />
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
