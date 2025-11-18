import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const { items, removeItem, updateQuantity, total } = useCart();
  const deliveryCharge = items.length > 0 ? 40 : 0;
  const discount = Math.floor(total * 0.05);
  const finalTotal = total + deliveryCharge - discount;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Shopping Cart</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-12">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6">
              Add some medicines to get started
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground">{items.length} items</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 text-3xl">
                      {item.image}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        ₹{item.price} each
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                          <button
                            onClick={() =>
                              updateQuantity(item.medicineId, item.quantity - 1)
                            }
                            className="p-1 hover:bg-white rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.medicineId, item.quantity + 1)
                            }
                            className="p-1 hover:bg-white rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.medicineId)}
                          className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-right flex-shrink-0">
                      <div className="font-bold text-lg">
                        ₹{item.price * item.quantity}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 border-b border-border pb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{total}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount (5%)</span>
                      <span>-₹{discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Delivery</span>
                    <span className="font-semibold">₹{deliveryCharge}</span>
                  </div>
                </div>

                <div className="flex justify-between text-lg font-bold mb-6">
                  <span>Total</span>
                  <span className="text-primary">₹{finalTotal}</span>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 h-12 text-base"
                  onClick={async () => {
                    setLoading(true);
                    try {
                      // create order on server (amount in paise)
                      const resp = await fetch("/api/payments/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ amount: finalTotal * 100 }),
                      });
                      const data = await resp.json();
                      const { orderId, rzpOrder, keyId } = data as any;

                      // ensure Razorpay checkout script loaded
                      await new Promise<void>((resolve) => {
                        if ((window as any).Razorpay) return resolve();
                        const s = document.createElement("script");
                        s.src = "https://checkout.razorpay.com/v1/checkout.js";
                        s.onload = () => resolve();
                        document.body.appendChild(s);
                      });

                      if (!keyId) {
                        // demo mode: directly mark paid on server and navigate
                        await fetch("/api/payments/verify", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ orderId }),
                        });
                        navigate(`/order-tracking/${orderId}`);
                      } else {
                        const options: any = {
                          key: keyId,
                          amount: rzpOrder.amount,
                          currency: rzpOrder.currency || "INR",
                          order_id: rzpOrder.id,
                          name: "MediGo",
                          description: "Medicine Purchase",
                          handler: async function (response: any) {
                            // verify payment on server
                            await fetch("/api/payments/verify", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                orderId,
                              }),
                            });
                            navigate(`/order-tracking/${orderId}`);
                          },
                          prefill: {},
                        };

                        const rzp = new (window as any).Razorpay(options);
                        rzp.open();
                      }
                    } catch (err) {
                      // eslint-disable-next-line no-console
                      console.error(err);
                      alert("Payment failed. Please try again.");
                    } finally {
                      setLoading(false);
                    }
                  }}
                >
                  {loading ? "Processing..." : "Proceed to Checkout"}
                </Button>

                <Link to="/">
                  <Button variant="outline" className="w-full mt-3">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>

                <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
                  <p className="font-semibold text-green-900 mb-1">
                    ✓ Safe & Secure
                  </p>
                  <p className="text-green-800 text-xs">
                    All transactions are secure and encrypted
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
