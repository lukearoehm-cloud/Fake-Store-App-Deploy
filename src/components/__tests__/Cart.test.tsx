/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import cartReducer from "../../store/cartSlice";
import Cart from "../Cart";
import type { CartItem } from "../../types";

// Mock hooks to provide useAuth
jest.mock("../../hooks", () => ({
  ...jest.requireActual("../../hooks"),
  useAuth: () => ({
    currentUser: { uid: "test-user", email: "test@example.com" },
  }),
}));

// Mock Firebase
jest.mock("../../firebase", () => ({
  auth: {},
  db: {},
}));

// Mock orderService
jest.mock("../../services/orderService", () => ({
  createOrder: jest.fn(),
}));

const mockItems: CartItem[] = [
  {
    id: "1",
    title: "Test Product",
    price: 29.99,
    category: "electronics",
    description: "Test description",
    image: "https://example.com/image.jpg",
    quantity: 2,
  },
];

const renderCart = (items: CartItem[] = []) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
    preloadedState: {
      cart: { items },
    },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <Cart />
      </BrowserRouter>
    </Provider>,
  );
};

describe("Cart", () => {
  test("shows empty cart message when no items", () => {
    renderCart([]);
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
  });

  test("displays cart items and total correctly", () => {
    renderCart(mockItems);

    expect(screen.getByText("Test Product")).toBeInTheDocument();
    expect(screen.getByText("$29.99 x 2")).toBeInTheDocument();
    expect(screen.getByText(/Total Items: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Price: \$59.98/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /checkout/i }),
    ).toBeInTheDocument();
  });
});
