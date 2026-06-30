import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import {
  Plus,
  Minus,
  Search,
  ShoppingCart,
  Clock,
  MapPin,
  Star,
  Loader2,
  ChevronRight,
  AlertCircle
} from "lucide-react";

/**
 * Premium Blinkit-style Medicine Catalog page.
 * Loads live database products and features quick category pills,
 * search filters, stock warning badges, and interactive cart controllers.
 */
const BrowseProducts = () => {
  const { pharmacyId } = useParams();
  const navigate = useNavigate();
  const { items, addItem, increaseQuantity, decreaseQuantity } = useCart();

  // State
  const [pharmacy, setPharmacy] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPharmacyAndProducts();
  }, [pharmacyId]);

  const fetchPharmacyAndProducts = async () => {
    setLoading(true);
    setError("");
    try {
      // 1. Fetch pharmacy info
      const phRes = await fetch(`/api/pharmacies/${pharmacyId}`);
      if (!phRes.ok) throw new Error("Pharmacy not found");
      const phData = await phRes.json();
      setPharmacy(phData);

      // 2. Fetch medicines for this pharmacy
      const medRes = await fetch(`/api/medicines?pharmacyId=${pharmacyId}`);
      if (!medRes.ok) throw new Error("Failed to load catalog products");
      const medData = await medRes.json();
      setMedicines(medData);
    } catch (err) {
      console.error("[BrowseProducts] Error loading data:", err);
      setError(err.message || "Failed to load catalog medicines");
    } finally {
      setLoading(false);
    }
  };

  // Find helper to get quantity in cart
  const getItemQuantityInCart = (medId) => {
    const matched = items.find((item) => item.id === medId || item._id === medId);
    return matched ? matched.quantity : 0;
  };

  // Get unique categories list
  const categories = ["All", ...new Set(medicines.map((m) => m.category))];

  // Filtering logic
  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (med.description && med.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || med.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Helper to get simulated store estimates
  const getSimulatedEstimate = (idStr) => {
    if (!idStr) return { distanceKm: "0.8", timeMins: "10" };
    const sum = idStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const distanceKm = ((sum % 15) / 10 + 0.5).toFixed(1);
    const timeMins = Math.round(distanceKm * 6 + 4);
    return { distanceKm, timeMins };
  };

  const { distanceKm, timeMins } = getSimulatedEstimate(pharmacyId);

  // Cart summary stats
  const totalCartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartValue = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Layout>
      <div className="bg-slate-50 min-h-[calc(100vh-140px)] pb-24">
        {/* Loader */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="h-10 w-10 animate-spin text-teal-700" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="container mx-auto px-4 py-12 text-center">
            <div className="max-w-md mx-auto bg-red-50 border border-red-100 rounded-2xl p-6 text-red-800">
              <AlertCircle className="h-10 w-10 mx-auto text-red-650 mb-3" />
              <h2 className="text-lg font-bold">Catalog Load Error</h2>
              <p className="text-sm mt-1">{error}</p>
              <Button onClick={() => navigate("/pharmacies")} className="mt-4 bg-red-650 text-white hover:bg-red-750">
                Go back to pharmacies
              </Button>
            </div>
          </div>
        )}

        {!loading && !error && pharmacy && (
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Pharmacy Banner Summary Card */}
            <div className="bg-white border border-slate-150 rounded-2xl p-6 shadow-sm mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{pharmacy.name}</h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {pharmacy.address}
                </p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-lg text-xs font-bold uppercase tracking-wider">
                    <Clock className="h-3.5 w-3.5" />
                    Delivery: {timeMins} mins
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {distanceKm} km away
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-lg">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {pharmacy.rating || "4.8"} Rating
                  </span>
                </div>
              </div>

              {/* Instant Search in Catalog */}
              <div className="relative w-full md:max-w-xs shrink-0">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in store catalog..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs outline-none transition-all focus:bg-white focus:border-teal-650"
                />
              </div>
            </div>

            {/* Horizontal Categories Pills */}
            <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === cat
                      ? "bg-teal-700 text-white shadow-sm"
                      : "bg-white text-slate-650 border border-slate-200 hover:border-slate-350"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredMedicines.length === 0 ? (
              <div className="text-center py-20 text-slate-500 border border-dashed rounded-2xl bg-white/50">
                No items available in this category.
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredMedicines.map((med) => {
                  const qty = getItemQuantityInCart(med._id);
                  const medId = med._id;

                  return (
                    <Card key={medId} className="border-slate-150 bg-white hover:shadow-md transition shadow-sm overflow-hidden flex flex-col justify-between">
                      <div className="p-4 space-y-3">
                        {/* Medicine Image */}
                        {med.imageUrl ? (
                          <img
                            src={med.imageUrl}
                            alt={med.name}
                            className="h-36 w-full object-cover rounded-xl border border-slate-50 bg-slate-50"
                          />
                        ) : (
                          <div className="h-36 w-full bg-teal-50 border border-teal-100 rounded-xl flex items-center justify-center text-teal-850 font-bold text-lg uppercase">
                            {med.name.charAt(0)}
                          </div>
                        )}

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">
                            {med.category}
                          </span>
                          <h3 className="font-bold text-slate-800 text-base mt-0.5 line-clamp-1" title={med.name}>
                            {med.name}
                          </h3>
                          {med.description && (
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 h-8 leading-relaxed">
                              {med.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Add Action & Price Footer */}
                      <div className="px-4 pb-4 pt-2 border-t border-slate-50 flex items-center justify-between gap-2 bg-slate-50/50">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 block">PRICE</span>
                          <span className="font-extrabold text-slate-800 text-base block">₹{med.price.toFixed(2)}</span>
                        </div>

                        {qty > 0 ? (
                          /* Interactive Counter Qty */
                          <div className="flex items-center bg-teal-700 text-white rounded-xl overflow-hidden h-9 shadow-sm">
                            <button
                              onClick={() => decreaseQuantity(medId)}
                              className="px-2.5 hover:bg-teal-800 h-full transition flex items-center"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 text-xs font-bold min-w-[20px] text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => increaseQuantity(medId)}
                              className="px-2.5 hover:bg-teal-800 h-full transition flex items-center"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          /* Standard Add Button */
                          <Button
                            onClick={() => addItem(med)}
                            className="bg-white border border-teal-700 text-teal-700 hover:bg-teal-50 h-9 font-bold px-4 rounded-xl shadow-sm hover:shadow"
                          >
                            ADD
                          </Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Blinkit-style Summary Cart Drawer */}
        {totalCartCount > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-4 py-4 shadow-xl animate-slide-up">
            <div className="container mx-auto max-w-4xl flex justify-between items-center bg-teal-700 text-white p-4 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-6 w-6" />
                <div>
                  <span className="font-bold block text-sm">
                    {totalCartCount} Item{totalCartCount > 1 ? "s" : ""} Added
                  </span>
                  <span className="text-xs text-teal-100">
                    Subtotal: ₹{totalCartValue.toFixed(2)}
                  </span>
                </div>
              </div>

              <Link to="/cart">
                <Button className="bg-white text-teal-850 hover:bg-teal-50 font-extrabold text-sm rounded-xl py-3 px-6 shadow-md flex items-center gap-1.5">
                  View Cart
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default BrowseProducts;
export { BrowseProducts };
