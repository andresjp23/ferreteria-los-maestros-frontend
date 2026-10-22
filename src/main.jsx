import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router"

import "./index.css"
import App from "./App.jsx"
import { AuthProvider } from "./context/AuthProvider"
import { CartProvider } from "./context/CartProvider"

ReactDOM.createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            {/* Sesión y carrito disponibles en toda la app */}
            <AuthProvider>
                <CartProvider>
                    <App />
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
)
