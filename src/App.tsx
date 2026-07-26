import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppDispatch, useAuth } from "./hooks";
import { addToCart } from "./store/cartSlice";
import ProductCard from "./components/ProductCard";
import ProductForm from "./components/ProductForm";
import Cart from "./components/Cart";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import OrderHistory from "./components/OrderHistory";
import { getProducts, deleteProduct } from "./services/productService";
import type { Product, CartItem } from "./types";
import "./App.css";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { currentUser } = useAuth();

  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart: CartItem[] = JSON.parse(savedCart);
        parsedCart.forEach((item) => {
          for (let i = 0; i < item.quantity; i++) {
            dispatch(addToCart(item));
          }
        });
      } catch (e) {
        console.error("Failed to parse saved cart", e);
      }
    }
  }, [dispatch]);

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter((category): category is string => !!category),
    ),
  );

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        queryClient.invalidateQueries({ queryKey: ["products"] });
      } catch (error) {
        console.error("Failed to delete product:", error);
        alert("Failed to delete product");
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setProductToEdit(null);
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setProductToEdit(null);
  };

  return (
    <>
      {showForm ? (
        <ProductForm
          productToEdit={productToEdit}
          onSuccess={handleFormSuccess}
          onCancel={handleCancelForm}
        />
      ) : (
        <>
          <section id="filters" className="filters">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "15px",
              }}
            >
              <div>
                <h2>Filter by Category</h2>
                <select
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  disabled={productsLoading}
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {currentUser && (
                <button
                  onClick={() => setShowForm(true)}
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#28a745",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  + Add New Product
                </button>
              )}
            </div>
          </section>

          <section id="products" className="products-section">
            <h2>Product Catalog</h2>
            {productsLoading ? (
              <p>Loading products...</p>
            ) : filteredProducts.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <div className="products-grid">
                {filteredProducts.map((product: Product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </section>

          <section id="cart" className="cart-section">
            <Cart />
          </section>
        </>
      )}
    </>
  );
}

function App() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="app">
      <header className="header">
        <h1>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            FakeStore E-commerce
          </Link>
        </h1>

        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/cart">Cart</Link>

          {currentUser ? (
            <>
              <Link to="/orders">My Orders</Link>
              <span className="user-email">{currentUser.email}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<OrderHistory />} />
        </Routes>
      </main>

      <footer>
        <p>Built with React, Redux Toolkit, React Query & Firebase</p>
      </footer>
    </div>
  );
}

export default App;
