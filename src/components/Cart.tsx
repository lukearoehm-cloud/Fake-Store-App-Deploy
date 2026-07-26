import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch, useAuth } from "../hooks";
import { removeFromCart, clearCart } from "../store/cartSlice";
import { createOrder } from "../services/orderService";
import type { CartItem } from "../types";
import { useNavigate } from "react-router-dom";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleRemove = (id: string) => {
    dispatch(removeFromCart(id));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    if (!currentUser) {
      alert("Please login to checkout");
      navigate("/login");
      return;
    }

    try {
      await createOrder({
        userId: currentUser.uid,
        userEmail: currentUser.email || "",
        items: cartItems,
        totalItems,
        totalPrice,
        createdAt: new Date().toISOString(),
      });

      dispatch(clearCart());
      sessionStorage.removeItem("cart");

      alert("Order placed successfully! Thank you for your purchase.");
      navigate("/orders");
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <div className="cart">
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map((item: CartItem) => (
              <div key={item.id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/100x100?text=No+Image";
                  }}
                />
                <div className="item-details">
                  <h4>{item.title}</h4>
                  <p>
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <p>Total Items: {totalItems}</p>
            <p>Total Price: ${totalPrice.toFixed(2)}</p>
            <button onClick={handleCheckout} className="checkout-btn">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
