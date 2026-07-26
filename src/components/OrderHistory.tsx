import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../hooks";
import { getUserOrders } from "../services/orderService";
import type { Order } from "../services/orderService";
import { Link } from "react-router-dom";

const OrderHistory: React.FC = () => {
  const { currentUser } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", currentUser?.uid],
    queryFn: () => getUserOrders(currentUser!.uid),
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Please log in to view your order history</h2>
        <Link to="/login">Go to Login</Link>
      </div>
    );
  }

  if (isLoading) {
    return <p>Loading your orders...</p>;
  }

  return (
    <div className="order-history">
      <h2>Your Order History</h2>

      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order: Order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div>
                  <strong>Order ID:</strong> {order.id}
                </div>
                <div>
                  <strong>Date:</strong>{" "}
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item">
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/60x60?text=No+Image";
                      }}
                    />
                    <div>
                      <p>{item.title}</p>
                      <p>
                        ${item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <p>
                  <strong>Total Items:</strong> {order.totalItems}
                </p>
                <p>
                  <strong>Total Price:</strong> ${order.totalPrice.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
