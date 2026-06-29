import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShoppingBag,
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Loader2,
  Calendar,
  AlertCircle
} from "lucide-react";

// Steps configuration for order tracking progress
const STEPS = [
  { name: "Placed", description: "Your order has been placed successfully.", icon: ShoppingBag },
  { name: "Confirmed", description: "Pharmacy has confirmed and accepted your order.", icon: CheckCircle },
  { name: "Packed", description: "Your medicines have been packed and are ready.", icon: Package },
  { name: "Out For Delivery", description: "A delivery agent is bringing your medicines.", icon: Truck },
  { name: "Delivered", description: "Medicines delivered to your destination.", icon: MapPin },
];

/**
 * Order Tracking component showing order details and stepper progress timeline.
 */
const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetches status of the specified order.
   * Attempts primary DB collection endpoint first; falls back to simulated endpoints if missing.
   */
  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 1. Try querying main order record
      let response = await fetch(`/api/orders/${orderId}`, { headers });
      if (response.status === 200) {
        const data = await response.json();
        setOrder(data);
        mapDBStatusToStep(data.orderStatus);
        setError(null);
        setLoading(false);
        return;
      }

      // 2. Try simulated fallback order status endpoint
      let fallbackResponse = await fetch(`/api/order-status/${orderId}`);
      if (fallbackResponse.status === 200) {
        const fallbackData = await fallbackResponse.json();
        setOrder(fallbackData);
        mapSimulatedStatusToStep(fallbackData.status);
        setError(null);
        setLoading(false);
        return;
      }

      throw new Error("Order not found or permission denied");
    } catch (err) {
      console.error("[TrackOrder] Fetch status error:", err);
      setError(err.message || "Failed to load order tracking info");
      setLoading(false);
    }
  };

  // Map Mongoose DB statuses to step index
  const mapDBStatusToStep = (status) => {
    const mappings = {
      "Placed": 0,
      "Confirmed": 1,
      "Packed": 2,
      "OutForDelivery": 3,
      "Delivered": 4,
    };
    setCurrentStep(mappings[status] ?? 0);
  };

  // Map simulated demo statuses to step index
  const mapSimulatedStatusToStep = (status) => {
    const mappings = {
      "created": 0,
      "paid": 1,
      "packed": 2, // fallback representation
      "out_for_delivery": 3,
      "delivered": 4,
    };
    setCurrentStep(mappings[status] ?? 0);
  };

  useEffect(() => {
    fetchStatus();

    // Auto-polling status refetch interval (5 seconds)
    const interval = setInterval(fetchStatus, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Loading skeleton screen
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-teal-700 animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Retrieving order tracking info...</p>
        </div>
      </Layout>
    );
  }

  // Error screen
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Unable to Track Order</h1>
          <p className="mt-3 text-slate-600">{error}</p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link to="/">
              <Button variant="outline" className="border-teal-700 text-teal-700 hover:bg-teal-50">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back Home
              </Button>
            </Link>
            <Button onClick={() => { setLoading(true); fetchStatus(); }} className="bg-teal-700 hover:bg-teal-800 text-white">
              Try Again
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  // Format creation timestamp
  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Link to="/" className="inline-flex items-center text-teal-700 hover:text-teal-900 text-sm font-medium mb-6 group">
          <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Header Summary info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Live Status
            </span>
            <h1 className="text-3xl font-extrabold text-slate-800 mt-2">Track Your Order</h1>
            <p className="text-slate-500 text-sm mt-1">ID: <span className="font-mono text-slate-600">{orderId}</span></p>
          </div>
          <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2.5 rounded-lg text-sm border">
            <Calendar className="h-4 w-4 text-teal-700" />
            <span>Ordered on {formattedDate}</span>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Progress Timeline Column */}
          <div className="md:col-span-2">
            <Card className="border-teal-50/50 shadow-md">
              <CardContent className="p-6">
                <h2 className="font-bold text-lg text-slate-800 mb-6">Delivery Timeline</h2>

                {/* Vertical Stepper layout */}
                <div className="relative pl-8 space-y-8 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-[2px] before:bg-slate-200">
                  {STEPS.map((step, idx) => {
                    const Icon = step.icon;
                    const isCompleted = idx < currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={idx} className="relative flex gap-4 items-start group">
                        {/* Stepper Circle Indicator */}
                        <div
                          className={`absolute -left-[33px] z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                            isCompleted
                              ? "bg-teal-700 border-teal-700 text-white shadow-sm shadow-teal-100"
                              : isCurrent
                              ? "bg-white border-teal-700 text-teal-700 scale-110 shadow-lg shadow-teal-50 animate-pulse"
                              : "bg-white border-slate-300 text-slate-400"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>

                        {/* Step Details text */}
                        <div className="pt-0.5">
                          <h3
                            className={`font-semibold text-base transition-colors duration-300 ${
                              isCompleted || isCurrent ? "text-slate-800" : "text-slate-400"
                            }`}
                          >
                            {step.name}
                          </h3>
                          <p
                            className={`text-sm mt-1 transition-colors duration-300 ${
                              isCurrent
                                ? "text-teal-800 font-medium"
                                : isCompleted
                                ? "text-slate-500"
                                : "text-slate-400"
                            }`}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Delivery and Summary Details Card */}
          <div>
            <Card className="border-teal-50/50 shadow-md">
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg border-b pb-3 mb-4">Delivery details</h3>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Destination Address</p>
                    <p className="text-sm text-slate-700 leading-relaxed font-semibold">
                      {order?.deliveryAddress || "Standard Home Address"}
                    </p>
                  </div>
                </div>

                {/* Items Summaries (only for DB Mongoose orders) */}
                {order?.items && Array.isArray(order.items) && (
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg border-b pb-3 mb-4">Items Summary</h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm gap-4">
                          <div className="truncate">
                            <p className="font-semibold text-slate-700 truncate">
                              {item.medicineId?.name || "Medicine Item"}
                            </p>
                            <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                          </div>
                          <span className="font-semibold text-slate-700">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Total breakdowns */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-slate-800">
                    <span className="text-sm font-semibold">Amount Paid</span>
                    <span className="text-xl font-black text-teal-800">
                      ₹{order?.totalAmount || order?.amount || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
