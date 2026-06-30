import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Plus,
  Edit2,
  Trash2,
  RefreshCw,
  X,
  Loader2,
  AlertCircle,
  Truck
} from "lucide-react";

/**
 * Premium Store Owner Dashboard.
 * Provides analytical overviews, stock management, and status updates for orders.
 */
const StoreDashboard = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard state
  const [medicines, setMedicines] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Tabs: "inventory" or "orders"
  const [activeTab, setActiveTab] = useState("inventory");

  // Modal states for CRUD medicines
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null); // null for Add, med object for Edit
  const [medForm, setMedForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
    description: "",
  });
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "store") {
      navigate("/");
      return;
    }
    if (!user.isApproved) {
      navigate("/store-registration");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch medicines
      const medRes = await fetch("/api/medicines");
      if (!medRes.ok) throw new Error("Failed to fetch medicines inventory");
      const medData = await medRes.ok ? await medRes.json() : [];
      
      // Filter for this store's pharmacy
      const pharmacyId = user.pharmacyId;
      const filteredMeds = medData.filter(
        (m) => m.pharmacyId === pharmacyId || m.pharmacyId?._id === pharmacyId
      );
      setMedicines(filteredMeds);

      // 2. Fetch orders
      const orderRes = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!orderRes.ok) throw new Error("Failed to fetch orders");
      const orderData = await orderRes.json();
      setOrders(orderData);
    } catch (err) {
      console.error("[StoreDashboard] Fetch error:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingMed(null);
    setMedForm({
      name: "",
      category: "",
      price: "",
      stock: "",
      imageUrl: "",
      description: "",
    });
    setModalError("");
    setShowModal(true);
  };

  const handleOpenEditModal = (med) => {
    setEditingMed(med);
    setMedForm({
      name: med.name,
      category: med.category,
      price: med.price,
      stock: med.stock,
      imageUrl: med.imageUrl || "",
      description: med.description || "",
    });
    setModalError("");
    setShowModal(true);
  };

  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    const priceNum = parseFloat(medForm.price);
    const stockNum = parseInt(medForm.stock);

    if (isNaN(priceNum) || priceNum < 0) {
      setModalError("Price must be a positive number");
      setModalLoading(false);
      return;
    }
    if (isNaN(stockNum) || stockNum < 0) {
      setModalError("Stock level must be a positive integer");
      setModalLoading(false);
      return;
    }

    const payload = {
      ...medForm,
      price: priceNum,
      stock: stockNum,
      pharmacyId: user.pharmacyId, // Auto-bind owner's pharmacy
    };

    const url = editingMed ? `/api/medicines/${editingMed._id}` : "/api/medicines";
    const method = editingMed ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Save operation failed");
      }

      setShowModal(false);
      fetchData(); // reload
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteMedicine = async (id) => {
    if (!window.confirm("Are you sure you want to delete this medicine? This action is permanent.")) return;

    try {
      const res = await fetch(`/api/medicines/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Delete operation failed");
      }
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update order status");
      }

      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  // Calculate quick stats
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid")
    .reduce((sum, o) => {
      // Sum the items belonging to this store's pharmacy
      const storeAmt = o.items.reduce((s, item) => {
        const med = medicines.find((m) => m._id === item.medicineId?._id || m._id === item.medicineId);
        return s + (med ? item.price * item.quantity : 0);
      }, 0);
      return sum + storeAmt;
    }, 0);

  const pendingOrders = orders.filter(
    (o) => ["Placed", "Confirmed", "Packed"].includes(o.orderStatus)
  ).length;

  const lowStockCount = medicines.filter((m) => m.stock < 10).length;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {user.shopName || "Pharmacy Dashboard"}
            </h1>
            <p className="text-sm text-slate-500 mt-1 capitalize">
              Welcome back, {user.name} • Approved Store Owner Account
            </p>
          </div>
          <Button
            onClick={fetchData}
            variant="outline"
            className="border-teal-100 text-teal-700 hover:bg-teal-50"
            disabled={loading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-155 rounded-2xl p-4 text-sm text-red-800 mb-8">
            <AlertCircle className="h-5 w-5 shrink-0 text-red-650" />
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="border-teal-100/50 shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Sales Revenue</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">₹{totalRevenue.toFixed(2)}</h3>
              </div>
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100/50 shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Orders</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">{pendingOrders}</h3>
              </div>
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-teal-100/50 shadow-md">
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Low Stock Warnings</p>
                <h3 className="text-3xl font-black text-slate-800 mt-2">{lowStockCount}</h3>
              </div>
              <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Tabs */}
        <div className="flex gap-4 border-b border-slate-200 mb-6">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all duration-300 ${
              activeTab === "inventory"
                ? "border-teal-750 text-teal-750"
                : "border-transparent text-slate-500 hover:text-slate-850"
            }`}
          >
            Medicine Inventory ({medicines.length})
          </button>
          <button
            onClick={() => setActiveTab("orders")}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all duration-300 ${
              activeTab === "orders"
                ? "border-teal-750 text-teal-750"
                : "border-transparent text-slate-500 hover:text-slate-850"
            }`}
          >
            Incoming Customer Orders ({orders.length})
          </button>
        </div>

        {/* Loader Screen */}
        {loading && medicines.length === 0 && orders.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-teal-700" />
          </div>
        ) : (
          <>
            {/* TAB 1: MEDICINE INVENTORY */}
            {activeTab === "inventory" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-800">Shop Catalog</h2>
                  <Button onClick={handleOpenAddModal} className="bg-teal-700 text-white hover:bg-teal-800">
                    <Plus className="mr-2 h-4 w-4" /> Add Medicine
                  </Button>
                </div>

                {medicines.length === 0 ? (
                  <Card className="border-slate-100">
                    <CardContent className="p-12 text-center text-slate-500 text-sm">
                      Your store has no listed medicines. Click "Add Medicine" to begin cataloging products.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 text-slate-400 font-semibold text-xs border-b">
                            <th className="p-4 uppercase">Medicine Image & Name</th>
                            <th className="p-4 uppercase">Category</th>
                            <th className="p-4 uppercase">Price</th>
                            <th className="p-4 uppercase">Stock Level</th>
                            <th className="p-4 uppercase text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y text-sm">
                          {medicines.map((med) => (
                            <tr key={med._id} className="hover:bg-slate-50/50">
                              <td className="p-4 flex items-center gap-3">
                                {med.imageUrl ? (
                                  <img
                                    src={med.imageUrl}
                                    alt={med.name}
                                    className="h-10 w-10 object-cover rounded-lg border border-slate-100 bg-slate-50"
                                  />
                                ) : (
                                  <div className="h-10 w-10 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center text-teal-850 font-bold">
                                    {med.name.charAt(0)}
                                  </div>
                                )}
                                <div>
                                  <span className="font-bold text-slate-850 block">{med.name}</span>
                                  {med.description && (
                                    <span className="text-xs text-slate-500 block truncate max-w-xs">
                                      {med.description}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-4 capitalize text-slate-650">{med.category}</td>
                              <td className="p-4 font-semibold text-slate-800">₹{med.price.toFixed(2)}</td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-lg ${
                                    med.stock === 0
                                      ? "bg-red-50 text-red-700"
                                      : med.stock < 10
                                      ? "bg-yellow-50 text-yellow-700"
                                      : "bg-green-50 text-green-700"
                                  }`}
                                >
                                  {med.stock} left
                                </span>
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleOpenEditModal(med)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-teal-700 hover:bg-slate-50 transition"
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteMedicine(med._id)}
                                    className="p-2 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 transition"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
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

            {/* TAB 2: INCOMING ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold text-slate-800">Assigned Orders Queue</h2>

                {orders.length === 0 ? (
                  <Card className="border-slate-100">
                    <CardContent className="p-12 text-center text-slate-500 text-sm">
                      No incoming customer orders contain your listed medicines.
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => {
                      // Filter items in this order that belong to this pharmacy
                      const orderMeds = order.items.filter((item) => {
                        const med = medicines.find(
                          (m) => m._id === item.medicineId?._id || m._id === item.medicineId
                        );
                        return med !== undefined;
                      });

                      const orderSubtotal = orderMeds.reduce(
                        (sum, item) => sum + item.price * item.quantity,
                        0
                      );

                      return (
                        <Card key={order._id} className="border-slate-150 shadow-sm overflow-hidden bg-white hover:shadow transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row justify-between border-b pb-4 border-slate-100 gap-4">
                              <div>
                                <span className="text-xs font-bold text-slate-450 uppercase tracking-wider block">
                                  Order ID
                                </span>
                                <span className="font-mono text-slate-700 text-xs mt-1 block">
                                  {order._id}
                                </span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-455 uppercase tracking-wider block">
                                  Customer Info
                                </span>
                                <span className="font-semibold text-slate-800 text-sm mt-1 block">
                                  {order.userId?.name} ({order.userId?.email})
                                </span>
                              </div>
                              <div>
                                <span className="text-xs font-bold text-slate-455 uppercase tracking-wider block">
                                  Total Revenue
                                </span>
                                <span className="font-bold text-teal-800 text-base mt-1 block">
                                  ₹{orderSubtotal.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex flex-col sm:flex-row md:items-center gap-2">
                                <span className="text-xs font-bold text-slate-455 uppercase tracking-wider block md:hidden">
                                  Change Status
                                </span>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                    order.orderStatus === "Placed"
                                      ? "bg-blue-50 text-blue-750"
                                      : order.orderStatus === "Confirmed"
                                      ? "bg-indigo-50 text-indigo-750"
                                      : order.orderStatus === "Packed"
                                      ? "bg-yellow-50 text-yellow-750"
                                      : order.orderStatus === "Delivered"
                                      ? "bg-green-50 text-green-750"
                                      : "bg-purple-50 text-purple-750"
                                  }`}
                                >
                                  {order.orderStatus}
                                </span>

                                {/* Status control actions dropdown */}
                                <select
                                  value={order.orderStatus}
                                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                  className="rounded-xl border border-slate-200 bg-white text-xs font-semibold py-1.5 px-3 outline-none text-slate-800 focus:border-teal-500"
                                >
                                  <option value="Placed">Placed</option>
                                  <option value="Confirmed">Confirm & Pay</option>
                                  <option value="Packed">Pack Order</option>
                                  <option value="OutForDelivery">Out For Delivery</option>
                                  <option value="Delivered">Delivered</option>
                                </select>
                              </div>
                            </div>

                            <div className="pt-4 space-y-3">
                              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Order Items (Your Catalog)
                              </h4>
                              <div className="divide-y">
                                {orderMeds.map((item) => (
                                  <div
                                    key={item._id}
                                    className="flex justify-between py-2.5 text-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-slate-800">
                                        {item.medicineId?.name || "Deleted Medicine"}
                                      </span>
                                      <span className="text-slate-400">x{item.quantity}</span>
                                    </div>
                                    <span className="font-semibold text-slate-650">
                                      ₹{(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500">
                              <Truck className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                              <p>
                                <strong>Delivery Address: </strong>
                                {order.deliveryAddress}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* MODAL FOR ADDING/EDITING MEDICINE */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <Card className="w-full max-w-lg border-teal-100 shadow-2xl bg-white animate-scale-in">
            <CardHeader className="flex flex-row justify-between items-center border-b pb-4 border-slate-100">
              <div>
                <CardTitle className="text-xl font-bold text-slate-800">
                  {editingMed ? "Edit Medicine Product" : "Add New Medicine"}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500">
                  Fill in drug specifications and stock variables.
                </CardDescription>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {modalError && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-xs text-red-800 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-650" />
                  <p>{modalError}</p>
                </div>
              )}

              <form onSubmit={handleSaveMedicine} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="name">
                    Medicine Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="e.g. Paracetamol 650mg"
                    value={medForm.name}
                    onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-600"
                    disabled={modalLoading}
                    required
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="category">
                      Category
                    </label>
                    <input
                      id="category"
                      type="text"
                      placeholder="e.g. Analgesic, Antibiotic"
                      value={medForm.category}
                      onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-600"
                      disabled={modalLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="price">
                      Unit Price (₹)
                    </label>
                    <input
                      id="price"
                      type="number"
                      step="0.01"
                      placeholder="15.00"
                      value={medForm.price}
                      onChange={(e) => setMedForm({ ...medForm, price: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-600"
                      disabled={modalLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="stock">
                      Initial Stock Level
                    </label>
                    <input
                      id="stock"
                      type="number"
                      placeholder="100"
                      value={medForm.stock}
                      onChange={(e) => setMedForm({ ...medForm, stock: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-600"
                      disabled={modalLoading}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="image">
                      Image URL (Optional)
                    </label>
                    <input
                      id="image"
                      type="url"
                      placeholder="https://example.com/med.jpg"
                      value={medForm.imageUrl}
                      onChange={(e) => setMedForm({ ...medForm, imageUrl: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-600"
                      disabled={modalLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-655 uppercase tracking-wider" htmlFor="description">
                    Description / Usage
                  </label>
                  <textarea
                    id="description"
                    rows={2}
                    placeholder="Enter medicine dosage usage indicators"
                    value={medForm.description}
                    onChange={(e) => setMedForm({ ...medForm, description: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-white py-2.5 px-3 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-650 resize-none"
                    disabled={modalLoading}
                  />
                </div>

                <div className="flex gap-4 pt-4 border-t border-slate-100">
                  <Button
                    type="submit"
                    className="flex-1 bg-teal-700 text-white hover:bg-teal-800 py-5 font-semibold rounded-xl flex justify-center items-center"
                    disabled={modalLoading}
                  >
                    {modalLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Medicine Product"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="border-slate-200 text-slate-650 hover:bg-slate-50 py-5 font-semibold rounded-xl"
                    disabled={modalLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
};

export default StoreDashboard;
export { StoreDashboard };
