import React, { useState, useEffect } from "react";
import type { Product } from "../types";
import { addProduct, updateProduct } from "../services/productService";

interface ProductFormProps {
  productToEdit?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
  productToEdit,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState(() => {
    if (productToEdit) {
      return {
        title: productToEdit.title,
        price: productToEdit.price.toString(),
        category: productToEdit.category,
        description: productToEdit.description,
        image: productToEdit.image,
      };
    }
    return {
      title: "",
      price: "",
      category: "",
      description: "",
      image: "",
    };
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.resolve().then(() => {
      if (productToEdit) {
        setFormData({
          title: productToEdit.title,
          price: productToEdit.price.toString(),
          category: productToEdit.category,
          description: productToEdit.description,
          image: productToEdit.image,
        });
      } else {
        setFormData({
          title: "",
          price: "",
          category: "",
          description: "",
          image: "",
        });
      }
    });
  }, [productToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const productData = {
        title: formData.title,
        price: parseFloat(formData.price),
        category: formData.category,
        description: formData.description,
        image: formData.image,
      };

      if (productToEdit) {
        await updateProduct(productToEdit.id, productData);
      } else {
        await addProduct(productData);
      }

      onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <h2>{productToEdit ? "Edit Product" : "Add New Product"}</h2>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          step="0.01"
          required
        />
        <input
          type="text"
          placeholder="Category (e.g. electronics, men's clothing)"
          value={formData.category}
          onChange={(e) =>
            setFormData({ ...formData, category: e.target.value })
          }
          required
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={3}
          required
        />
        <input
          type="url"
          placeholder="Image URL"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          required
        />

        <div className="form-buttons">
          <button type="submit" disabled={loading}>
            {loading
              ? "Saving..."
              : productToEdit
                ? "Update Product"
                : "Add Product"}
          </button>
          <button type="button" onClick={onCancel} className="cancel-btn">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
