import React, { useEffect, useState } from "react";
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
  AlertCircle,
  Phone,
  MessageSquare,
  Navigation,
  Clock,
  Sparkles
} from "lucide-react";

// Instantly tracked logical milestones
const STEPS = [
  { name: "Placed", description: "Order received. Processing payment details.", icon: ShoppingBag },
  { name: "Confirmed", description: "Pharmacy has accepted and is preparing order.", icon: CheckCircle },
  { name: "Packed", description: "Medicines packed. Handing over to partner.", icon: Package },
  { name: "Out For Delivery", description: "Driver has picked up. Navigating to you.", icon: Truck },
  { name: "Delivered", description: "Medicines successfully delivered.", icon: MapPin },
];

/**
 * High-fidelity Blinkit-style Live Delivery Tracking portal.
 * Animates a rider icon along a simulated route and shows claimed delivery partner profiles.
 */
const TrackOrder = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulated GPS coordinate tracker states (0 to 100 percentage)
  const [riderProgress, setRiderProgress] = useState(0);

  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`/api/orders/${orderId}`, { headers });
      if (!res.ok) {
        throw new Error("Order not found or permission denied");
      }
      const data = await res.json();
      setOrder(data);
      mapDBStatusToStep(data.orderStatus);
      setError(null);
    } catch (err) {
      console.error("[TrackOrder] Polling error:", err);
      setError(err.message || "Failed to load order tracker");
    } finally {
      setLoading(false);
    }
  };

  const mapDBStatusToStep = (status) => {
    const mappings = {
      "Placed": 0,
      "Confirmed": 1,
      "Packed": 2,
      "OutForDelivery": 3,
      "Out For Delivery": 3,
      "Picked Up": 3,
      "Assigned": 3,
      "Delivered": 4,
    };
    setCurrentStep(mappings[status] ?? 0);
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 4000);
    return () => clearInterval(interval);
  }, [orderId]);

  // Live GPS progress animation interval
  useEffect(() => {
    if (currentStep === 3) {
      // Rider is active on the road! Increment coordinates progress
      const progressTimer = setInterval(() => {
        setRiderProgress((prev) => {
          if (prev >= 100) return 100;
          return prev + 2; // Increments to simulate driving speed
        });
      }, 800);
      return () => clearInterval(progressTimer);
    } else if (currentStep === 4) {
      setRiderProgress(100);
    } else {
      setRiderProgress(0);
    }
  }, [currentStep]);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
          <Loader2 className="h-12 w-12 text-teal-700 animate-spin mb-4" />
          <p className="text-slate-500 font-medium animate-pulse">Initializing Live Tracking GPS...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Cannot Locate Dispatch</h1>
          <p className="mt-3 text-slate-600">{error}</p>
          <Link to="/">
            <Button className="mt-6 bg-teal-700 hover:bg-teal-800 text-white rounded-xl">
              Go Back Home
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const formattedDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : new Date().toLocaleString();

  // Simulated countdown based on step
  const getEtaMessage = () => {
    if (currentStep === 0) return "Awaiting confirmation...";
    if (currentStep === 1) return "Packing in 3 mins...";
    if (currentStep === 2) return "Handing to partner...";
    if (currentStep === 3) {
      const remainingTime = Math.max(1, Math.round((100 - riderProgress) / 10));
      return `Arriving in ${remainingTime} mins`;
    }
    return "Delivered successfully";
  };

  return (
    <Layout>
      <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-8">
        <div className="container mx-auto px-4 max-w-5xl">
          <Link to="/profile" className="inline-flex items-center text-teal-700 hover:text-teal-900 text-sm font-medium mb-6 group">
            <ArrowLeft className="mr-1 h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Orders
          </Link>

          {/* Heading Live ETA Status Header */}
          <div className="bg-white border rounded-2xl p-6 shadow-sm mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                <Clock className="h-3.5 w-3.5" />
                {getEtaMessage()}
              </div>
              <h1 className="text-3xl font-extrabold text-slate-800 mt-1 tracking-tight">
                {currentStep < 4 ? "Insta Delivery in Progress" : "Order Delivered"}
              </h1>
              <p className="text-slate-500 text-xs font-mono">Order ID: {orderId}</p>
            </div>

            <div className="flex gap-2 text-slate-650 bg-slate-50 border p-3.5 rounded-xl text-xs">
              <Calendar className="h-4 w-4 text-teal-700" />
              <span>Placed: {formattedDate}</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Left side: Timeline and Live Map */}
            <div className="md:col-span-2 space-y-6">
              {/* LIVE MAP SIMULATION PANEL */}
              <Card className="border-slate-150 shadow-sm overflow-hidden bg-white">
                <CardContent className="p-0 relative">
                  {/* Styled Map Background */}
                  <div className="h-64 w-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                    {/* SVG Dotted Road Connection */}
                    <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
                      {/* Grid background */}
                      <defs>
                        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                      
                      {/* Route curve */}
                      <path
                        id="delivery-route"
                        d="M 50 180 C 150 100, 250 80, 350 150 C 450 220, 500 120, 580 80"
                        fill="none"
                        stroke="#e2e8f0"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                      {/* Highlighted active route line */}
                      <path
                        d="M 50 180 C 150 100, 250 80, 350 150 C 450 220, 500 120, 580 80"
                        fill="none"
                        stroke="#0f766e"
                        strokeWidth="6"
                        strokeDasharray="600"
                        strokeDashoffset={600 - (600 * riderProgress) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    {/* Store Pin (Left side) */}
                    <div className="absolute left-[30px] bottom-[40px] flex flex-col items-center">
                      <div className="w-10 h-10 bg-teal-50 border border-teal-200 rounded-full flex items-center justify-center shadow-md">
                        <ShoppingBag className="h-5 w-5 text-teal-700" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-650 bg-white border px-1.5 py-0.5 rounded shadow mt-1">
                        Pharmacy
                      </span>
                    </div>

                    {/* Customer Pin (Right side) */}
                    <div className="absolute right-[30px] top-[40px] flex flex-col items-center">
                      <div className="w-10 h-10 bg-amber-50 border border-amber-200 rounded-full flex items-center justify-center shadow-md animate-bounce">
                        <MapPin className="h-5 w-5 text-amber-700" />
                      </div>
                      <span className="text-[9px] font-bold text-slate-650 bg-white border px-1.5 py-0.5 rounded shadow mt-1">
                        Your Home
                      </span>
                    </div>

                    {/* Simulated Delivery Agent Icon (sliding along the path) */}
                    {currentStep >= 3 && (
                      <div
                        style={{
                          left: `calc(40px + ${riderProgress * 0.8}%)`,
                          top: `calc(180px - ${riderProgress * 1.3}px)`,
                        }}
                        className="absolute w-12 h-12 bg-teal-750 text-white rounded-full flex items-center justify-center shadow-xl border-2 border-white transition-all duration-700 ease-out"
                      >
                        <Truck className="h-6 w-6 animate-pulse" />
                      </div>
                    )}

                    {currentStep < 3 && (
                      <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center p-4 text-center">
                        <div className="space-y-1 max-w-xs">
                          <p className="text-xs font-bold text-slate-700">Rider waiting at store</p>
                          <p className="text-[10px] text-slate-450">
                            Location updates start once the pharmacy packs and hands over your medicines.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* TIMELINE STEPPER */}
              <Card className="border-slate-150 shadow-sm bg-white">
                <CardContent className="p-6">
                  <h2 className="font-bold text-slate-800 text-lg mb-6">Delivery Milestones</h2>
                  <div className="relative pl-8 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[15px] before:w-[2px] before:bg-slate-200">
                    {STEPS.map((step, idx) => {
                      const Icon = step.icon;
                      const isCompleted = idx < currentStep;
                      const isCurrent = idx === currentStep;

                      return (
                        <div key={idx} className="relative flex gap-4 items-start">
                          <div
                            className={`absolute -left-[33px] z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                              isCompleted
                                ? "bg-teal-700 border-teal-700 text-white"
                                : isCurrent
                                ? "bg-white border-teal-700 text-teal-700 scale-105 shadow-md shadow-teal-50"
                                : "bg-white border-slate-300 text-slate-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="pt-0.5">
                            <h3 className={`font-semibold text-sm ${isCompleted || isCurrent ? "text-slate-800" : "text-slate-400"}`}>
                              {step.name}
                            </h3>
                            <p className={`text-xs mt-0.5 ${isCurrent ? "text-teal-700 font-bold" : "text-slate-400"}`}>
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

            {/* Right side: Driver card, orders item details */}
            <div className="space-y-6">
              {/* RIDER ASSIGNMENT CARD */}
              <Card className="border-slate-150 shadow-sm bg-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-slate-800 text-sm border-b pb-3 mb-4 uppercase tracking-wider">
                    Delivery Agent
                  </h3>

                  {order?.deliveryPartnerId ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        {order.deliveryPartnerId.profileImage ? (
                          <img
                            src={order.deliveryPartnerId.profileImage}
                            alt={order.deliveryPartnerId.name}
                            className="h-12 w-12 rounded-full border object-cover bg-slate-50"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center font-bold text-lg">
                            {order.deliveryPartnerId.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <span className="font-bold text-slate-800 block">{order.deliveryPartnerId.name}</span>
                          <span className="text-[10px] text-slate-450 uppercase font-semibold">
                            Field Agent Assigned
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <a href={`tel:${order.deliveryPartnerId.phone || "999999999"}`} className="flex-1">
                          <Button variant="outline" className="w-full border-teal-100 text-teal-800 hover:bg-teal-50 text-xs py-2 px-1 rounded-xl">
                            <Phone className="h-4 w-4 mr-1.5" /> Call Agent
                          </Button>
                        </a>
                        <Button variant="outline" className="flex-1 border-slate-200 text-slate-650 hover:bg-slate-50 text-xs py-2 px-1 rounded-xl">
                          <MessageSquare className="h-4 w-4 mr-1.5" /> Chat
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 space-y-2">
                      <Loader2 className="h-6 w-6 text-teal-700 animate-spin mx-auto" />
                      <p className="text-xs text-slate-500 font-semibold">
                        Finding nearest delivery partner...
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* RECEIPT SUMMARY */}
              <Card className="border-slate-150 shadow-sm bg-white">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-bold text-slate-800 text-sm border-b pb-3 mb-2 uppercase tracking-wider">
                    Receipt Breakdown
                  </h3>

                  <div className="space-y-2.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Item Subtotal</span>
                      <span className="font-semibold text-slate-800">₹{order.totalAmount - 15 - 29}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Packaging & Handling Fee</span>
                      <span className="font-semibold text-slate-800">₹15.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Service Charge</span>
                      <span className="font-bold text-green-700">FREE</span>
                    </div>
                  </div>

                  <div className="border-t pt-3 flex justify-between items-center text-slate-800">
                    <span className="text-xs font-bold uppercase">Total Bill Paid</span>
                    <span className="text-lg font-black text-teal-800">₹{order.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="pt-2 border-t text-[10px] text-slate-450 leading-relaxed">
                    <p>
                      <strong>Delivery To: </strong>
                      {order.deliveryAddress}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TrackOrder;
export { TrackOrder };
