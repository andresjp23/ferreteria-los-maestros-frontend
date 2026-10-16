import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

import CartHero from "../components/cart/CartHero";
import CartItems from "../components/cart/CartItems";
import CartSummary from "../components/cart/CartSummary";

export default function Cart() {
  return (
    <main className="min-h-screen bg-slate-50">
      <CartHero />

      <div className="mx-auto max-w-7xl px-4 pt-6 md:px-6">
        <Link
          to="/productos"
          className="inline-flex items-center gap-2 text-sm font-medium text-primary transition hover:text-amber-700"
        >
          <ArrowLeft size={18} />
          Seguir comprando
        </Link>
      </div>

      <div className="mx-auto grid max-w-7xl items-start gap-6 px-4 py-5 md:px-6 lg:grid-cols-[2fr_1fr]">
        <CartItems />
        <CartSummary />
      </div>
    </main>
  );
}
