import React from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import { Header } from "./components/Header";
import Customer from "./pages/Customer";
import Home from "./pages/Home";
import { AuthProvider } from "./context/auth";
import InteriorDesign from "./pages/InteriorDesign";
import ExteriorDesign from "./pages/Exterior Desgin";

import PrivateRoute from "./components/Routes/private";
import AdminRoute from "./components/Routes/AdminRoute";
import AdminDashBoard from "./pages/Admin/AdminDashBoard";
import Dashboard from "./User/DashBoard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import Users from "./pages/Admin/Users";
import Orders from "./User/Orders";
import Profile from "./User/profile";
import Products from "./pages/Admin/Product";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Contact from "./pages/Contact";
import Search from "./User/Search";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider } from "./context/cart";
import CartPage from "../src/pages/CartPage"
import { Toaster } from "react-hot-toast";


function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Header />
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/search" element={<Search/>} />
      <Route path="/cart" element={<CartPage/>} />
      <Route path="/dashboard" element={<PrivateRoute />}>
          <Route path="user" element={<Dashboard />} />
          <Route path="user/orders" element={<Orders />} />
          <Route path="user/profile" element={<Profile />} />
          </Route>
          <Route path="/dashboard" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashBoard />} ></Route>
          <Route path="admin/create-category" element={<CreateCategory />} ></Route>
          <Route path="admin/create-product" element={<CreateProduct />} ></Route>
          <Route path="admin/product/:slug" element={<UpdateProduct />} ></Route>
          <Route path="admin/products" element={<Products />} />
          <Route path="admin/users" element={<Users />} ></Route>
          </Route>
          <Route path="/auth" element={<Customer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/interior" element={<InteriorDesign />}/>
          <Route path="/exterior" element={<ExteriorDesign />}/>
      </Routes>
      <Footer />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
