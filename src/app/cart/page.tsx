import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingCart, ArrowRight, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "Cart",
  description: "Your CanaDent Education Center shopping cart.",
};

export default function CartPage() {
  return (
    <>
      <section
        className="py-14 px-4"
        style={{ background: "linear-gradient(135deg, #0f2150, #1b3a8a)" }}
      >
        <div className="max-w-7xl mx-auto">
          <nav className="text-sm text-white/50 mb-4">
            <Link href="/" className="hover:text-[#c9a84c] transition-colors">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Cart</span>
          </nav>
          <span className="section-label">Registration</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mt-3">
            Your Cart
          </h1>
        </div>
      </section>

      <section className="py-20 px-4" style={{ background: "#f5f7fb" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
            style={{ background: "#e2e8f0" }}
          >
            <ShoppingCart className="h-9 w-9" style={{ color: "#1b3a8a" }} />
          </div>
          <h2 className="font-heading text-2xl font-bold text-[#0f2150] mb-3">
            Your Cart is Empty
          </h2>
          <p className="text-[#1a1a2e]/60 mb-8 max-w-md mx-auto">
            You haven&apos;t added any courses yet. Browse our upcoming and available courses
            and register for one today.
          </p>
          <Link href="/courses" className="btn-primary inline-flex">
            <BookOpen className="h-4 w-4" />
            Browse Courses
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Order summary placeholder for when items are present */}
      <section className="py-10 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <h3 className="font-heading text-xl font-bold text-[#0f2150] mb-6">
            Order Summary
          </h3>
          <div
            className="rounded-xl border p-6 text-sm text-[#1a1a2e]/50 text-center"
            style={{ borderColor: "#e2e8f0", background: "#f5f7fb" }}
          >
            No items in your cart.
          </div>

          <div className="mt-6 pt-6 border-t border-[#e2e8f0]">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-[#1a1a2e]/60">Subtotal</span>
              <span className="font-semibold text-[#0f2150]">$0.00</span>
            </div>
            <div className="flex items-center justify-between text-sm mb-5">
              <span className="text-[#1a1a2e]/60">Tax (HST 13%)</span>
              <span className="font-semibold text-[#0f2150]">$0.00</span>
            </div>
            <div className="flex items-center justify-between font-bold text-base mb-6">
              <span className="text-[#0f2150]">Total</span>
              <span className="text-[#0f2150]">$0.00</span>
            </div>
            <button className="btn-primary w-full opacity-50 cursor-not-allowed" disabled>
              Proceed to Checkout
            </button>
          </div>

          <p className="text-xs text-center text-[#1a1a2e]/40 mt-4">
            Need help? Call us at{" "}
            <a href="tel:14373700122" className="underline">1.437.370.0122</a>{" "}
            or email{" "}
            <a href="mailto:canadent.edu@gmail.com" className="underline">canadent.edu@gmail.com</a>
          </p>
        </div>
      </section>
    </>
  );
}
