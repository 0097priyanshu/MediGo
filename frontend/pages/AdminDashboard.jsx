import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  TrendingUp,
  Package,
  Home as HomeIcon,
  Plus,
  Edit2,
  Trash2,
  Lock,
  LogOut,
  RefreshCw,
  X,
  Loader2,
  AlertCircle
} from "lucide-react";

/**
 * Premium Admin Dashboard providing Analytics Stats, recent orders status management,
 * and Medicine inventory CRUD controls. Includes automatic login gate overlay if not authorized.
 */
const AdminDashboard = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Stats states
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Medicine states
  const [medicines, setMedicines] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);
  const [medsLoading, setMedsLoading] = useState(true);

  // Medicine Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingMed, setEditingMed] = useState(null); // Null for Add, Med Object for Edit
  const [medForm, setMedForm] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    imageUrl: "",
    pharmacyId: "",
  });
  const [modalError, setModalError] = useState("");
  const [modalLoading, setModalLoading] = useState(false);

  // Tab State: "overview" or "medicines"
  const [activeTab, setActiveTab] = useState("overview");

  // Validate admin token presence
  const checkAuth = () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === "admin") {
          setIsAdmin(true);
          return true;
        }
      } catch (err) {
        console.error("Auth check parse error", err);
      }
    }
    setIsAdmin(false);
    return false;
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.user.role !== "admin") {
        throw new Error("Access denied: only administrators are allowed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setIsAdmin(true);
      setLoginPassword("");
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAdmin(false);
    setStats(null);
  };

  // Fetch dashboard stats
  const fetchStats = async () => {
    setStatsError(null);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch stats");
      }
      setStats(data);
    } catch (err) {
      setStatsError(err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  // Fetch medicines and pharmacies for inventory select
  const fetchInventoryData = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Fetch Medicines
      const medRes = await fetch("/api/medicines");
      const medData = await medRes.json();
      if (medRes.ok) setMedicines(medData);

      // Fetch Pharmacies
      const pharmRes = await fetch("/api/pharmacies");
      const pharmData = await pharmRes.json();
      if (pharmRes.ok) setPharmacies(pharmData);
    } catch (err) {
      console.error("Fetch inventory error", err);
    } finally {
      setMedsLoading(false);
    }
  };

  // Update order status trigger
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      });

      if (res.ok) {
        fetchStats(); // reload recent list and total revenue calculations
      } else {
        const errorData = await res.json();
        alert(`Failed to update status: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Order status update error", err);
    }
  };

  // Save medicine (Add or Update)
  const handleSaveMedicine = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalLoading(true);

    const token = localStorage.getItem("token");
    if (!token) return;

    const { name, category, price, stock, imageUrl, pharmacyId } = medForm;

    // Validation
    if (!name || !category || price === "" || stock === "" || !pharmacyId) {
      setModalError("Please populate all mandatory fields.");
      setModalLoading(false);
      return;
    }

    if (Number(price) < 0 || Number(stock) < 0) {
      setModalError("Price and stock levels must be greater than or equal to 0.");
      setModalLoading(false);
      return;
    }

    try {
      const method = editingMed ? "PUT" : "POST";
      const url = editingMed ? `/api/medicines/${editingMed._id}` : "/api/medicines";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          category,
          price: Number(price),
          stock: Math.floor(Number(stock)),
          imageUrl,
          pharmacyId,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save medicine");
      }

      // Close modal and refresh listings
      setShowModal(false);
      fetchInventoryData();
      fetchStats();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  // Delete medicine trigger
  const handleDeleteMedicine = async (medId) => {
    if (!window.confirm("Are you sure you want to delete this medicine?")) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`/api/medicines/${medId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        fetchInventoryData();
        fetchStats();
      } else {
        const errorData = await res.json();
        alert(`Failed to delete medicine: ${errorData.error}`);
      }
    } catch (err) {
      console.error("Delete medicine error", err);
    }
  };

  // Open modal helper
  const openModal = (med = null) => {
    setModalError("");
    if (med) {
      setEditingMed(med);
      setMedForm({
        name: med.name,
        category: med.category,
        price: med.price,
        stock: med.stock,
        imageUrl: med.imageUrl || "",
        pharmacyId: med.pharmacyId?._id || med.pharmacyId || "",
      });
    } else {
      setEditingMed(null);
      setMedForm({
        name: "",
        category: "",
        price: "",
        stock: "",
        imageUrl: "",
        pharmacyId: pharmacies[0]?._id || "",
      });
    }
    setShowModal(true);
  };

  useEffect(() => {
    const authenticated = checkAuth();
    if (authenticated) {
      fetchStats();
      fetchInventoryData();
    }
  }, [isAdmin]);

  // RENDER: Admin Login overlay
  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 flex justify-center items-center">
          <Card className="w-full max-w-md border-teal-50 shadow-xl">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8" />
                </div>
                <h1 className="text-2xl font-black text-slate-800">Admin Authentication</h1>
                <p className="text-slate-500 text-sm mt-1">Please enter your admin credentials to access the panel.</p>
              </div>

              {loginError && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="admin@medigo.com"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-teal-700 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:border-teal-700 outline-none"
                  />
                </div>

                <Button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white mt-6 py-2.5 font-semibold">
                  {loginLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Authenticate"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header Actions row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Admin Control Center</h1>
            <p className="text-slate-500 text-sm mt-1">Manage medicines catalog, inventory stock levels, and customer orders.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={fetchStats} variant="outline" className="border-teal-100 text-teal-700 hover:bg-teal-50">
              <RefreshCw className="mr-2 h-4 w-4" />
              Sync Stats
            </Button>
            <Button onClick={handleLogout} className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 font-semibold">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Analytics Grid */}
        {statsLoading && !stats ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-teal-700 animate-spin mr-2" />
            <span className="text-slate-500 font-semibold">Loading stats...</span>
          </div>
        ) : statsError ? (
          <div className="bg-red-50 text-red-600 border border-red-100 p-4 rounded-lg flex items-center gap-2 mb-8">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{statsError}</span>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="border-teal-50/50 shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Orders</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">{stats.totalOrders}</h3>
                </div>
                <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-50/50 shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Revenue</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">₹{stats.totalRevenue}</h3>
                </div>
                <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-50/50 shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Medicines Count</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">{stats.medicinesCount}</h3>
                </div>
                <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-teal-50/50 shadow-md">
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Pharmacies Count</p>
                  <h3 className="text-3xl font-black text-slate-800 mt-2">{stats.pharmaciesCount}</h3>
                </div>
                <div className="w-12 h-12 bg-teal-50 text-teal-700 rounded-full flex items-center justify-center">
                  <HomeIcon className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Control Tabs Header */}
        <div className="flex gap-4 border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all duration-300 ${
              activeTab === "overview"
                ? "border-teal-700 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Orders Overview
          </button>
          <button
            onClick={() => setActiveTab("medicines")}
            className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all duration-300 ${
              activeTab === "medicines"
                ? "border-teal-700 text-teal-700"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            Medicines Inventory ({medicines.length})
          </button>
        </div>

        {/* Tab 1: Orders Overview */}
        {activeTab === "overview" && (
          <Card className="border-teal-50/50 shadow-md">
            <CardContent className="p-6">
              <h2 className="font-bold text-slate-800 text-lg mb-6">Recent Customer Orders</h2>
              {stats && stats.recentOrders?.length === 0 ? (
                <p className="text-slate-500 text-center py-6">No customer orders found in database.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                      <tr className="border-b border-slate-100 text-xs font-bold text-slate-400 uppercase">
                        <th className="pb-3">Order ID</th>
                        <th className="pb-3">Customer</th>
                        <th className="pb-3">Items details</th>
                        <th className="pb-3">Total</th>
                        <th className="pb-3">Payment</th>
                        <th className="pb-3">Order Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 text-sm text-slate-700">
                      {stats?.recentOrders?.map((order) => (
                        <tr key={order._id} className="hover:bg-slate-50/30">
                          <td className="py-4 font-mono text-xs font-semibold text-slate-600">{order._id}</td>
                          <td className="py-4">
                            <p className="font-semibold text-slate-800">{order.userId?.name || "Deleted User"}</p>
                            <p className="text-xs text-slate-400">{order.userId?.email || ""}</p>
                          </td>
                          <td className="py-4 max-w-xs truncate">
                            {order.items.map((item, index) => (
                              <div key={index} className="text-xs truncate">
                                • {item.medicineId?.name || "Deleted Medicine"} x{item.quantity}
                              </div>
                            ))}
                          </td>
                          <td className="py-4 font-bold text-slate-800">₹{order.totalAmount}</td>
                          <td className="py-4">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                order.paymentStatus === "paid"
                                  ? "bg-green-50 text-green-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-4">
                            <select
                              value={order.orderStatus}
                              onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                              className="border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs bg-white outline-none focus:border-teal-700 font-semibold"
                            >
                              <option value="Placed">Placed</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Packed">Packed</option>
                              <option value="OutForDelivery">Out For Delivery</option>
                              <option value="Delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Tab 2: Medicines Inventory */}
        {activeTab === "medicines" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-slate-800 text-lg">Medicines Catalog</h2>
              <Button onClick={() => openModal()} className="bg-teal-700 hover:bg-teal-800 text-white font-semibold">
                <Plus className="mr-2 h-4 w-4" />
                Add Medicine
              </Button>
            </div>

            {medsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 text-teal-700 animate-spin mr-2" />
                <span className="text-slate-500 font-semibold">Loading catalog...</span>
              </div>
            ) : medicines.length === 0 ? (
              <p className="text-slate-500 text-center py-6 bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                No medicines found. Click Add Medicine to register one.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {medicines.map((med) => (
                  <Card key={med._id} className="border-teal-50/50 shadow-md hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-5 flex flex-col justify-between h-full min-h-[160px] gap-4">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-slate-800 text-lg truncate w-40">{med.name}</h3>
                          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium uppercase">
                            {med.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate mt-1">
                          Pharmacy: {med.pharmacyId?.name || "Deleted Pharmacy"}
                        </p>

                        <div className="flex items-center gap-6 mt-4">
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Price</p>
                            <p className="text-base font-bold text-teal-700">₹{med.price}</p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-400 font-medium">Available Stock</p>
                            <p className={`text-base font-bold ${med.stock === 0 ? "text-red-500" : "text-slate-700"}`}>
                              {med.stock} units
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Medicine Action buttons */}
                      <div className="flex gap-3 border-t pt-4">
                        <Button
                          onClick={() => openModal(med)}
                          variant="outline"
                          className="flex-1 text-teal-700 border-teal-100 hover:bg-teal-50 font-semibold"
                        >
                          <Edit2 className="mr-2 h-4.5 w-4.5" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteMedicine(med._id)}
                          variant="ghost"
                          className="flex-1 text-red-500 hover:text-red-700 hover:bg-red-50 font-semibold"
                        >
                          <Trash2 className="mr-2 h-4.5 w-4.5" />
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Add/Edit Medicine */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <Card className="w-full max-w-lg shadow-2xl bg-white border border-slate-100">
            <CardContent className="p-6">
              <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h3 className="font-extrabold text-slate-800 text-xl">
                  {editingMed ? "Edit Medicine Catalog" : "Add Medicine to Catalog"}
                </h3>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="h-6 w-6" />
                </button>
              </div>

              {modalError && (
                <div className="mb-4 bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-100">
                  <AlertCircle className="h-4 w-4" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleSaveMedicine} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Medicine Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Paracetamol"
                      value={medForm.name}
                      onChange={(e) => setMedForm({ ...medForm, name: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Category *</label>
                    <input
                      type="text"
                      required
                      placeholder="Painkiller"
                      value={medForm.category}
                      onChange={(e) => setMedForm({ ...medForm, category: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-teal-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="40"
                      value={medForm.price}
                      onChange={(e) => setMedForm({ ...medForm, price: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-teal-700"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Stock *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="100"
                      value={medForm.stock}
                      onChange={(e) => setMedForm({ ...medForm, stock: e.target.value })}
                      className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-teal-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Pharmacy *</label>
                  <select
                    required
                    value={medForm.pharmacyId}
                    onChange={(e) => setMedForm({ ...medForm, pharmacyId: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-teal-700 bg-white font-semibold"
                  >
                    {pharmacies.map((pharm) => (
                      <option key={pharm._id} value={pharm._id}>
                        {pharm.name} ({pharm.address})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-1">Image URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://example.com/medicine.jpg"
                    value={medForm.imageUrl}
                    onChange={(e) => setMedForm({ ...medForm, imageUrl: e.target.value })}
                    className="w-full border border-slate-200 rounded-lg p-2 text-sm outline-none focus:border-teal-700"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t pt-4 mt-6">
                  <Button
                    type="button"
                    onClick={() => setShowModal(false)}
                    variant="outline"
                    className="border-slate-200 hover:bg-slate-50 font-semibold"
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6">
                    {modalLoading ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Save Changes"}
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

export default AdminDashboard;
