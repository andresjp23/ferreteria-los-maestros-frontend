import { Routes, Route } from 'react-router'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import AboutUs from './pages/AboutUs'
import Contact from "./pages/Contact"
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from "./pages/Login"
import ProtectedRoute from './components/auth/ProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminUsers from './pages/admin/Users'

import SellerLayout from "./components/layout/SellerLayout"
import SellerOrders from "./pages/seller/Orders"
import NotFound from "./pages/NotFound"



function App() {
  return (
    <Routes>
      {/* Paginas fuera del layout */}
      <Route path="/login" element={<Login />} />

      {/* Panel admin: solo entra el rol "admin" */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path='productos' element={<AdminProducts />} />
              <Route path='usuarios' element={<AdminUsers />} />
          </Route>
      </Route>
      
      {/* Panel del vendedor: acceso exclusivo para vendedores */}
      <Route element={<ProtectedRoute allowedRoles={["vendedor"]} />}>
          <Route path="/vendedor" element={<SellerLayout />}>
              <Route index element={<SellerOrders />} />
          </Route>
      </Route>

      {/* Rutas publicas */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/nosotros" element={<AboutUs />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/productos/:id" element={<ProductDetail />} />
        <Route path="/carrito" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
