import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contect from './pages/Contect'
import Shop from './pages/Shop'
import Faq from './pages/Faq'
import Return from './pages/Return'
import ShoppingInfo from './pages/ShoppingInfo'
import Terms from './pages/Terms'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Login from './pages/Login'
import Register from './pages/Register'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import VerifyEmail from './pages/VerifyEmail'
import OrderSuccess from './pages/OrderSuccess'
import Profile from './pages/Profile'
import AdminRoute from './components/AdminRoute'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminProduct from './admin/AdminProduct'
import AdminProducts from './admin/AdminProducts'
import EditProduct from './admin/EditProduct'
import AdminOrders from './admin/AdminOrders'
import AdminUsers from './admin/AdminUsers'
const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contect />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/returns" element={<Return />} />
        <Route path="/shipping" element={<ShoppingInfo />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route element={<AdminRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="add-product" element={<AdminProduct />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="edit-product/:id" element={<EditProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="users" element={<AdminUsers />} />
          </Route>
        </Route>
      </Routes>
      <Footer />
    </Router>
  )
}

export default App