import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Account from './pages/Account'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import ProductForm from './pages/ProductForm'
import AdminCategories from './pages/AdminCategories'
import SiteSettings from './pages/SiteSettings'
import Orders from './pages/Orders'
import AdminOrders from './pages/AdminOrders'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { ProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoute'

export default function App() {
  return <BrowserRouter><DataProvider><AuthProvider><CartProvider><Routes><Route path="/admin/login" element={<AdminLogin/>}/><Route path="/admin" element={<AdminProtectedRoute><AdminLayout/></AdminProtectedRoute>}><Route index element={<AdminDashboard/>}/><Route path="products" element={<AdminProducts/>}/><Route path="products/new" element={<ProductForm/>}/><Route path="products/:id/edit" element={<ProductForm/>}/><Route path="categories" element={<AdminCategories/>}/><Route path="orders" element={<AdminOrders/>}/><Route path="site-settings" element={<SiteSettings/>}/></Route><Route path="*" element={<div className="min-h-screen flex flex-col bg-[#FFFCF8] text-[#382F32]"><Navbar /><main className="flex-1"><Routes>
    <Route path="/" element={<Home />} />
    <Route path="/products" element={<Catalog />} />
    <Route path="/shop" element={<Catalog />} />
    <Route path="/products/:slug" element={<ProductDetail />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/checkout" element={<Checkout />} />
    <Route path="/login" element={<Login />} />
    <Route path="/signup" element={<Signup />} />
    <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
    <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
    <Route path="*" element={<NotFound />} />
  </Routes></main><Footer /></div>}/></Routes></CartProvider></AuthProvider></DataProvider></BrowserRouter>
}
