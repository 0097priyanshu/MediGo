import React, { useState, useEffect, useMemo, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/CartItem";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, ShoppingBag, CreditCard, Loader2, AlertCircle, MapPin } from "lucide-react";

// React Leaflet imports for address coordinate selection mapping
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import * as L from "leaflet";

// Leaflet map re-centering helper
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

// Custom colored icon for the user's selected address marker (Red marker pin)
const addressPinIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Mini map interactive selector component
const LocationSelectorMap = ({ lat, lng, onChangeCoords }) => {
  const MapEvents = () => {
    useMapEvents({
      click(e) {
        onChangeCoords(e.latlng.lat, e.latlng.lng);
      },
    });
    return null;
  };

  const markerRef = useRef(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const latLng = marker.getLatLng();
          onChangeCoords(latLng.lat, latLng.lng);
        }
      },
    }),
    [onChangeCoords]
  );

  return (
    <div className="h-44 w-full rounded-xl overflow-hidden shadow-inner border mt-2 relative z-10">
      <MapContainer
        center={[lat, lng]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker
          draggable={true}
          eventHandlers={eventHandlers}
          position={[lat, lng]}
          ref={markerRef}
          icon={addressPinIcon}
        />
        <MapEvents />
        <MapUpdater center={[lat, lng]} />
      </MapContainer>
    </div>
  );
};

/**
 * Dynamically loads the Razorpay SDK script.
 */
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Premium shopping cart page displaying selected medicines, order totals,
 * delivery address inputs, and Razorpay checkout gates.
 * Now enriched with GPS location tracking and mapping address markers.
 */
const Cart = () => {
  const { items, clearCart, total } = useCart();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  // Location selector states
  const [detecting, setDetecting] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [mapCoords, setMapCoords] = useState({ lat: 28.6273, lng: 77.3725 }); // Noida default

  // Cost calculations
  const subtotal = total;
  const deliveryCharge = subtotal > 500 ? 0 : 50; // free delivery for orders above ₹500
  const discount = Math.floor(subtotal * 0.05); // 5% discount
  const finalTotal = subtotal + deliveryCharge - discount;

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
      );
      if (response.ok) {
        const data = await response.json();
        const displayName = data.display_name || `Latitude: ${latitude}, Longitude: ${longitude}`;
        setDeliveryAddress(displayName);
      } else {
        setDeliveryAddress(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }
    } catch (err) {
      setDeliveryAddress(`Latitude: ${latitude}, Longitude: ${longitude}`);
    }
  };

  const handleDetectLocation = () => {
    setDetecting(true);
    setCheckoutError("");

    if (!navigator.geolocation) {
      setCheckoutError("Geolocation is not supported by your browser.");
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setMapCoords({ lat: userLat, lng: userLon });
        setShowMiniMap(true);
        await reverseGeocode(userLat, userLon);
        setDetecting(false);
      },
      (error) => {
        console.warn("[Geolocation] Detect error:", error.message);
        setCheckoutError("Location access blocked. Please type manually or drag marker.");
        setDetecting(false);
        // Show fallback Noida map
        setShowMiniMap(true);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleMarkerMove = async (lat, lng) => {
    setMapCoords({ lat, lng });
    await reverseGeocode(lat, lng);
  };

  /**
   * Orchestrates the Checkout & Payment verification flow.
   */
  const handleCheckout = async () => {
    setCheckoutError("");

    if (!deliveryAddress.trim()) {
      setCheckoutError("Please enter your delivery address to proceed.");
      return;
    }

    setCheckingOut(true);

    try {
      // 1. Enforce authentication or auto-login test user in sandbox
      let token = localStorage.getItem("token");
      if (!token) {
        try {
          // Attempt Login
          const loginRes = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: "democart@example.com", password: "demopwd123" }),
          });
          const loginData = await loginRes.json();
          if (loginRes.ok) {
            token = loginData.token;
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(loginData.user));
          } else {
            // Attempt Register if not found
            const regRes = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: "Demo Customer",
                email: "democart@example.com",
                password: "demopwd123",
              }),
            });
            const regData = await regRes.json();
            if (regRes.ok) {
              token = regData.token;
              localStorage.setItem("token", token);
              localStorage.setItem("user", JSON.stringify(regData.user));
            } else {
              throw new Error(regData.error || "Authentication failed");
            }
          }
        } catch (err) {
          throw new Error("Unable to establish user session: " + err.message);
        }
      }

      // 2. Create the Mongoose Order in DB
      const orderItems = items.map((item) => ({
        medicineId: item.id,
        quantity: item.quantity,
      }));

      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          deliveryAddress,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok) {
        throw new Error(orderData.error || "Order creation in database failed");
      }

      const dbOrderId = orderData.order._id || orderData.order.id;

      // 3. Request Razorpay order generation from backend
      const payRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: dbOrderId }),
      });

      const payData = await payRes.json();
      if (!payRes.ok) {
        throw new Error(payData.error || "Payment session initialization failed");
      }

      // 4. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay payment SDK failed to load. Check your internet connection.");
      }

      // 5. Build checkout options
      const options = {
        key: payData.keyId || "rzp_test_mockkeys",
        amount: payData.rzpOrder.amount,
        currency: payData.rzpOrder.currency || "INR",
        name: "MediGo Medicines",
        description: "Payment for placed medicines order",
        order_id: payData.rzpOrder.id || payData.rzpOrder.rzpOrderId,
        handler: async (response) => {
          try {
            setCheckingOut(true);
            // Verify payment signature
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                orderId: dbOrderId,
                razorpay_order_id: response.razorpay_order_id || payData.rzpOrder.id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(verifyData.error || "Payment verification failed");
            }

            // Succeeded: clear cart and redirect to order tracking dashboard
            clearCart();
            window.location.href = `/track/${dbOrderId}`;
          } catch (err) {
            setCheckoutError("Payment verification failed: " + err.message);
            setCheckingOut(false);
          }
        },
        prefill: {
          name: "Demo Customer",
          email: "democart@example.com",
        },
        theme: {
          color: "#0f766e", // teal-700
        },
      };

      // If Razorpay keys are not configured, simulate immediate success for testing
      if (!payData.keyId) {
        alert("Demo Mode: Razorpay keys not active. Simulating successful checkout.");
        options.handler({
          razorpay_order_id: "mock_order_id",
          razorpay_payment_id: "mock_payment_id",
          razorpay_signature: "mock_signature",
        });
        return;
      }

      // Open Razorpay Checkout modal
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (response) => {
        setCheckoutError("Payment failed: " + response.error.description);
        setCheckingOut(false);
      });
      rzp.open();
    } catch (err) {
      setCheckoutError(err.message);
      setCheckingOut(false);
    }
  };

  // If the cart is empty, show empty state template
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header Actions */}
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
            className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200 font-semibold"
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

                {checkoutError && (
                  <div className="bg-red-50 text-red-600 border border-red-100 p-3 rounded-lg text-xs flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{checkoutError}</span>
                  </div>
                )}

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

                {/* Delivery Address input section with Detect location pin */}
                <div className="space-y-3 pt-2 border-t">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-500 uppercase">Delivery Address *</label>
                    <button
                      type="button"
                      onClick={handleDetectLocation}
                      disabled={detecting}
                      className="text-xs font-bold text-teal-700 hover:text-teal-900 flex items-center gap-1 bg-teal-50 px-2.5 py-1.5 rounded-lg transition hover:bg-teal-100"
                    >
                      {detecting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <MapPin className="h-3.5 w-3.5" />
                      )}
                      Detect My Location
                    </button>
                  </div>
                  
                  <textarea
                    rows="2"
                    required
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Enter your complete home/office address"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-teal-700 outline-none resize-none"
                  />

                  {/* Interactive Leaflet Mini Map Pin Marker Selector */}
                  {showMiniMap && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-medium block">
                        📍 Drag marker or click map to refine address location
                      </span>
                      <LocationSelectorMap
                        lat={mapCoords.lat}
                        lng={mapCoords.lng}
                        onChangeCoords={handleMarkerMove}
                      />
                    </div>
                  )}
                </div>

                {/* Grand Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-slate-800">
                    <span className="text-sm font-bold">Total Amount</span>
                    <span className="text-2xl font-black text-teal-800">₹{finalTotal}</span>
                  </div>
                </div>

                {/* Checkout Trigger Action */}
                <Button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white py-3.5 font-bold text-base shadow-sm hover:shadow transition-all duration-300"
                >
                  {checkingOut ? (
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  ) : (
                    <>
                      <CreditCard className="mr-2 h-5 w-5" />
                      Pay with Razorpay
                    </>
                  )}
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
export { Cart };
