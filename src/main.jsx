import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./index.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthProvider"
import { CartProvider } from "./context/CartProvider"
import { CatalogProvider } from "./context/CatalogProvider"

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            {/* Sesión, catálogo y carrito disponibles en toda la app.
                El carrito va dentro del catálogo porque lee de él los precios y el stock. */}
            <AuthProvider>
                <CatalogProvider>
                    <CartProvider>
                        <App />
                    </CartProvider>
                </CatalogProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
