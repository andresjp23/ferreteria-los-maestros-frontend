import { lazy, Suspense } from "react"
import { Routes, Route } from "react-router"
import Layout from "./components/layout/Layout"
import ScrollToTop from "./components/layout/ScrollToTop"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import Home from "./pages/Home"
import Products from "./pages/Products"
import AboutUs from "./pages/AboutUs"
import Contact from "./pages/Contact"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

// Los paneles de admin y vendedor se cargan bajo demanda (code splitting):
// un cliente nunca descarga su código, y la tienda pública carga más rápido.
const AdminLayout = lazy(() => import("./components/layout/AdminLayout"))
const Dashboard = lazy(() => import("./pages/admin/Dashboard"))
const AdminProducts = lazy(() => import("./pages/admin/Products"))
const AdminUsers = lazy(() => import("./pages/admin/Users"))
const SellerLayout = lazy(() => import("./components/layout/SellerLayout"))
const SellerOrders = lazy(() => import("./pages/seller/Orders"))

// Se muestra mientras se descarga el código de un panel
function PageLoader() {
    return (
        <p role="status" className="p-10 text-center text-sm text-gray-500">
            Cargando...
        </p>
    )
}

function App() {
    return (
        <>
            <ScrollToTop />

            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Paginas fuera del layout */}
                    <Route path="/login" element={<Login />} />

                    {/* Panel admin: solo entra el rol "admin" */}
                    <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<Dashboard />} />
                            <Route path="productos" element={<AdminProducts />} />
                            <Route path="usuarios" element={<AdminUsers />} />
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
                        <Route path="/productos/:id" element={<ProductDetail />} />
                        <Route path="/nosotros" element={<AboutUs />} />
                        <Route path="/contacto" element={<Contact />} />
                        <Route path="/carrito" element={<Cart />} />
                        <Route path="*" element={<NotFound />} />
                    </Route>
                </Routes>
            </Suspense>
        </>
    )
}

export default App
