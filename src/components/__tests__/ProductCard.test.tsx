/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../store/cartSlice";
import ProductCard from "../ProductCard";
import type { Product } from "../../types";

// Mock hooks to provide useAuth
jest.mock("../../hooks", () => ({
  ...jest.requireActual("../../hooks"),
  useAuth: () => ({
    currentUser: null,
  }),
}));

// Mock Firebase
jest.mock("../../firebase", () => ({
  auth: {},
  db: {},
}));

const mockProduct: Product = {
  id: "1",
  title: "Test Backpack",
  price: 99.99,
  category: "men's clothing",
  description: "A great backpack for testing",
  image: "https://example.com/image.jpg",
};

const renderWithRedux = (component: React.ReactElement) => {
  const store = configureStore({
    reducer: { cart: cartReducer },
  });

  return {
    ...render(<Provider store={store}>{component}</Provider>),
    store,
  };
};

describe("ProductCard", () => {
  test("renders product information correctly", () => {
    renderWithRedux(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Test Backpack")).toBeInTheDocument();
    expect(screen.getByText("$99.99")).toBeInTheDocument();
    expect(screen.getByText("men's clothing")).toBeInTheDocument();
    expect(
      screen.getByText(/A great backpack for testing/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add to cart/i }),
    ).toBeInTheDocument();
  });

  test("calls add to cart when button is clicked", () => {
    const { store } = renderWithRedux(<ProductCard product={mockProduct} />);

    const addButton = screen.getByRole("button", { name: /add to cart/i });
    fireEvent.click(addButton);

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].title).toBe("Test Backpack");
    expect(state.cart.items[0].quantity).toBe(1);
  });
});
