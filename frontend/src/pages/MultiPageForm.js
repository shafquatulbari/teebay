import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

const MultiPageForm = () => {
  const [step, setStep] = useState(1);
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      categoryId: "",
    },
  });

  const onNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const onBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = (data) => {
    console.log("Form Data Submitted:", data);
    alert("Product added successfully!");
  };

  return (
    <div>
      <h2>Add/Edit Product</h2>
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
            <label>Category ID</label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="number"
                  placeholder="Category ID"
                  required
                />
              )}
            />
          </>
        )}
        <div>
          {step > 1 && (
            <button type="button" onClick={onBack}>
              Back
            </button>
          )}
          {step < 2 && (
            <button type="button" onClick={onNext}>
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
