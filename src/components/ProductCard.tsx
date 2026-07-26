import React, { useState } from "react";
import type { Product } from "../types";
import { useAppDispatch, useAuth } from "../hooks";
import { addToCart } from "../store/cartSlice";

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDelete,
}) => {
  const dispatch = useAppDispatch();
  const { currentUser } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleImageError = () => {
    setImgSrc("https://placehold.co/300x200?text=No+Image");
  };

  return (
    <div className="product-card">
      <img
        src={imgSrc}
        alt={product.title}
        onError={handleImageError}
        className="product-image"
      />
      <div className="product-info">
        <h3>{product.title}</h3>
        <p className="category">{product.category}</p>
        <p className="price">${product.price.toFixed(2)}</p>
        {product.rating && (
          <p className="rating">
            Rating: {product.rating.rate} ({product.rating.count})
          </p>
        )}
        <p className="description">
          {product.description.substring(0, 100)}...
        </p>

        <button onClick={handleAddToCart} className="add-to-cart-btn">
          Add to Cart
        </button>

        {/* Only show Edit/Delete if user is logged in */}
        {currentUser && (
          <div className="product-actions">
            <button
              className="edit-btn"
              onClick={() => onEdit && onEdit(product)}
            >
              Edit
            </button>
            <button
              className="delete-btn"
              onClick={() => onDelete && onDelete(product.id)}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {showToast && (
        <div className="toast">✅ {product.title} added to cart!</div>
      )}
    </div>
  );
};

export default ProductCard;
