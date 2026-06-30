import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Truck,
  TrendingUp,
  MapPin,
  RefreshCw,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BookmarkCheck,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Premium Delivery Partner Dashboard page.
 * Allows claiming deliveries, updating status, and viewing logs.
 */
const DeliveryDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // State managers
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [historyDeliveries, setHistoryDeliveries] = useState([]);
  const [unassignedDeliveries, setUnassignedDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Tabs: "active", "pool", "history"
  const [activeTab, setActiveTab] = useState("active");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "delivery") {
      navigate("/");
      return;
    }
    fetchDeliveries();
  }, [user, navigate]);

  const fetchDeliveries = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/delivery/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to load deliveries");
      }
      const data = await res.json();
      setActiveDeliveries(data.active || []);
      setHistoryDeliveries(data.history || []);
      setUnassignedDeliveries(data.unassigned || []);
    } catch (err) {
      console.error("[DeliveryDashboard] Load error:", err);
      setError(err.message || "Failed to query delivery dispatches");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimOrder = async (orderId) => {
    setError(null);
    setActionLoading(true);
    try {
      const res = await fetch(`/api/delivery/orders/${orderId}/claim`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Claim shipment failed");
      }
      // Re-fetch list
      await fetchDeliveries();
      setActiveTab("active"); // switch to active list
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, nextStatus) => {
    setError(null);
    setActionLoading(true);
    try {
      const res = await fetch(`/api/delivery/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Status update failed");
      }

      await fetchDeliveries();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Helper to get next logical state transition
  const getNextStatusAction = (currentStatus) => {
    switch (currentStatus) {
      case "Assigned":
        return { label: "Pick Up Package", nextState: "Picked Up" };
      case "Picked Up":
        return { label: "Depart for Delivery", nextState: "Out For Delivery" };
      case "Out For Delivery":
      case "OutForDelivery":
        return { label: "Confirm Delivered", nextState: "Delivered" };
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              Delivery Partner Portal
            </h1>
            <p className="text-sm text-slate-500 mt-1 capitalize">
              Welcome back, {user.name} • Active Field Agent
            </p>
          </div>
          <Button
            onClick={fetchDeliveries}
            variant="outline"
            className="border-purple-100 text-purple-700 hover:bg-purple-50"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Board
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-155 rounded-2xl p-4 text-sm text-red-800 mb-8">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-650" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Analytics Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-purple-50/50 shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Shipments</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">{activeDeliveries.length}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-50/50 shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available in Pool</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">{unassignedDeliveries.length}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-50/50 shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completed Deliveries</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">{historyDeliveries.length}</h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 text-purple-700 rounded-full flex items-center justify-center">
                <BookmarkCheck className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all duration-300 ${
              activeTab === "active"
                ? "border-purple-700 text-purple-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            My Shipments ({activeDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab("pool")}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all duration-300 ${
              activeTab === "pool"
                ? "border-purple-700 text-purple-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Open Dispatch Pool ({unassignedDeliveries.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all duration-300 ${
              activeTab === "history"
                ? "border-purple-700 text-purple-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Delivery Log ({historyDeliveries.length})
          </button>
        </div>

        {/* Loader Screen */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-purple-700" />
          </div>
        )}

        {!loading && (
          <>
            {/* TAB 1: ACTIVE SHIPMENTS */}
            {activeTab === "active" && (
              <div className="space-y-4">
                {activeDeliveries.length === 0 ? (
                  <Card className="border-slate-100 p-8 text-center text-slate-500 text-sm">
                    No active packages are assigned to you. Choose "Open Dispatch Pool" to claim a delivery.
                  </Card>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {activeDeliveries.map((delivery) => {
                      const nextAction = getNextStatusAction(delivery.orderStatus);

                      return (
                        <Card key={delivery._id} className="border-purple-100 bg-white/90 hover:shadow-md transition shadow-sm overflow-hidden">
                          <CardContent className="p-6 flex flex-col justify-between h-full">
                            <div className="space-y-4">
                              <div className="flex justify-between items-start border-b pb-3 border-slate-100">
                                <div>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Shipment ID</span>
                                  <span className="font-mono text-slate-700 text-xs truncate block max-w-[180px]">
                                    {delivery._id}
                                  </span>
                                </div>
                                <span
                                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    delivery.orderStatus === "Assigned"
                                      ? "bg-blue-50 text-blue-700"
                                      : delivery.orderStatus === "Picked Up"
                                      ? "bg-yellow-50 text-yellow-700"
                                      : "bg-purple-50 text-purple-700"
                                  }`}
                                >
                                  {delivery.orderStatus === "OutForDelivery" ? "Out For Delivery" : delivery.orderStatus}
                                </span>
                              </div>

                              <div className="space-y-2 text-sm">
                                <div>
                                  <strong>Customer Name:</strong> {delivery.userId?.name}
                                </div>
                                <div className="flex items-start gap-1.5 text-xs text-slate-650">
                                  <MapPin className="h-4 w-4 text-purple-650 shrink-0 mt-0.5" />
                                  <p>
                                    <strong>Address:</strong> {delivery.deliveryAddress}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
                              {nextAction ? (
                                <Button
                                  onClick={() => handleUpdateStatus(delivery._id, nextAction.nextState)}
                                  className="flex-1 bg-purple-750 text-white hover:bg-purple-800 text-xs font-semibold py-3 rounded-xl flex justify-center items-center"
                                  disabled={actionLoading}
                                >
                                  {actionLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                                  {nextAction.label}
                                </Button>
                              ) : (
                                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                  Ready to Close
                                </span>
                              )}
                              <Link to={`/track/${delivery._id}`}>
                                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs py-3 px-3 rounded-xl">
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: OPEN DISPATCH POOL */}
            {activeTab === "pool" && (
              <div className="space-y-4">
                {unassignedDeliveries.length === 0 ? (
                  <Card className="border-slate-100 p-8 text-center text-slate-500 text-sm">
                    No unassigned medicine dispatches are currently pending in the pool.
                  </Card>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2">
                    {unassignedDeliveries.map((delivery) => (
                      <Card key={delivery._id} className="border-slate-150 hover:border-purple-300 hover:shadow-md transition shadow-sm bg-white">
                        <CardContent className="p-6 flex flex-col justify-between h-full">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start border-b pb-3 border-slate-100">
                              <div>
                                <span className="text-[10px] font-bold text-slate-400 uppercase block">Shipment ID</span>
                                <span className="font-mono text-slate-700 text-xs block">
                                  {delivery._id}
                                </span>
                              </div>
                              <span className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-[10px] font-bold rounded text-slate-500 uppercase">
                                Unassigned
                              </span>
                            </div>

                            <div className="space-y-2 text-sm">
                              <div>
                                <strong>Customer:</strong> {delivery.userId?.name}
                              </div>
                              <div className="flex items-start gap-1 text-xs text-slate-500">
                                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                <p>{delivery.deliveryAddress}</p>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t border-slate-100">
                            <Button
                              onClick={() => handleClaimOrder(delivery._id)}
                              className="w-full bg-purple-750 text-white hover:bg-purple-800 text-xs font-semibold py-3 rounded-xl flex justify-center items-center shadow"
                              disabled={actionLoading}
                            >
                              {actionLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                              Claim Delivery Task
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: DELIVERY HISTORY LOG */}
            {activeTab === "history" && (
              <div className="space-y-4">
                {historyDeliveries.length === 0 ? (
                  <Card className="border-slate-100 p-8 text-center text-slate-500 text-sm">
                    You have not completed any deliveries yet.
                  </Card>
                ) : (
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 font-semibold text-xs border-b">
                            <th className="p-4 uppercase">Order ID</th>
                            <th className="p-4 uppercase">Recipient</th>
                            <th className="p-4 uppercase">Delivery Address</th>
                            <th className="p-4 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                          {historyDeliveries.map((delivery) => (
                            <tr key={delivery._id} className="hover:bg-slate-50/50">
                              <td className="p-4 font-mono text-slate-700 text-xs">{delivery._id}</td>
                              <td className="p-4">
                                <span className="font-bold text-slate-800">{delivery.userId?.name}</span>
                                <span className="text-slate-450 block text-xs">{delivery.userId?.email}</span>
                              </td>
                              <td className="p-4 text-xs text-slate-650 max-w-xs truncate" title={delivery.deliveryAddress}>
                                {delivery.deliveryAddress}
                              </td>
                              <td className="p-4">
                                <span className="px-2.5 py-1 bg-green-50 text-green-750 font-bold rounded-lg text-xs flex items-center gap-1 w-fit">
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Delivered
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default DeliveryDashboard;
export { DeliveryDashboard };
