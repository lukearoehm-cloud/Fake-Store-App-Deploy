/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import cartReducer from "../../store/cartSlice";
import ProductCard from "../ProductCard";
import Cart from "../Cart";
import type { Product } from "../../types";

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

const mockProduct: Product = {
  id: "99",
  title: "Integration Test Hoodie",
  price: 49.99,
  category: "men's clothing",
  description: "A hoodie used for integration testing",
  image: "https://example.com/hoodie.jpg",
};

const renderApp = () => {
  const store = configureStore({
    reducer: { cart: cartReducer },
  });

  return render(
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <ProductCard product={mockProduct} />
          <Cart />
        </div>
      </BrowserRouter>
    </Provider>,
  );
};

describe("Add to Cart Integration", () => {
  test("adding a product updates the cart", () => {
    renderApp();

    // Cart should start empty
    expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();

    // Click Add to Cart
    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    // Cart should now show the product
    const cartItems = screen.getByRole("heading", {
      name: /shopping cart/i,
    }).parentElement;
    expect(cartItems?.textContent).toContain("Integration Test Hoodie");
    expect(screen.getByText(/Total Items: 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Price: \$49.99/i)).toBeInTheDocument();
  });
});
