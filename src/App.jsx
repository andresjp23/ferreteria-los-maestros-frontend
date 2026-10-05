import { Routes, Route } from 'react-router'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Products from './pages/Products'
import AboutUs from './pages/AboutUs'
import Contact from "./pages/Contact"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Products />} />
        <Route path="/nosotros" element={<AboutUs />} />
        <Route path="/contacto" element={<Contact />} />
        {/* Cuando crees las páginas, agrégalas aquí:
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/login" element={<Login />} /> */}
      </Route>
    </Routes>
  )
}

export default App