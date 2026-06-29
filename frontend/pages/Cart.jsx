import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBag, CreditCard } from "lucide-react";

/**
 * Premium shopping cart page displaying selected medicines, order totals, and checkout trigger.
 */
const Cart = () => {
  const { items, clearCart, total } = useCart();

  // If the cart is empty, show a premium empty state template
  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-lg">
          <div className="w-20 h-20 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
            <ShoppingBag className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-800">Your cart is empty</h1>
          <p className="mt-4 text-slate-500">
            Looks like you haven't added any medicines to your cart yet. Let's find some for you.
          </p>
          <Link to="/">
            <Button className="mt-8 bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 transition-all duration-300">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  // Cost calculations
  const subtotal = total;
  const deliveryCharge = subtotal > 500 ? 0 : 50; // free delivery for orders above ₹500
  const discount = Math.floor(subtotal * 0.05); // 5% discount
  const finalTotal = subtotal + deliveryCharge - discount;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Navigation & Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <Link to="/" className="inline-flex items-center text-teal-700 hover:text-teal-900 text-sm font-medium mb-2 group">
              <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Pharmacies
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-800">Shopping Cart</h1>
          </div>

          <Button
            variant="outline"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={clearCart}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Cart
          </Button>
        </div>

        {/* Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>

          {/* Checkout Order Summary Card */}
          <div>
            <Card className="border-teal-50 shadow-md sticky top-24">
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold text-slate-800 text-xl border-b pb-4">Order Summary</h3>

                {/* Sub-charges lines */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-semibold text-slate-800">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-slate-800">
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600 font-bold">FREE</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-green-600">
                    <span>Discount (5%)</span>
                    <span className="font-semibold">-₹{discount}</span>
                  </div>
                  {subtotal <= 500 && (
                    <p className="text-xs text-slate-400 mt-2 bg-slate-50 p-2 rounded">
                      💡 Add ₹{500 - subtotal} more for <span className="font-bold">FREE Delivery</span>!
                    </p>
                  )}
                </div>

                {/* Grand Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-slate-800">
                    <span className="text-base font-bold">Total Amount</span>
                    <span className="text-2xl font-extrabold text-teal-800">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger Action */}
                <Button className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3 font-semibold text-base shadow-sm hover:shadow transition-all duration-300">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
