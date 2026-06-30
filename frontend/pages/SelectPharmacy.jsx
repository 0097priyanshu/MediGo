import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Star, Clock, Sparkles, Loader2, ArrowRight } from "lucide-react";

/**
 * Premium SelectPharmacy page.
 * Loads live pharmacies from the database with Blinkit-style delivery estimates and tags.
 */
const SelectPharmacy = () => {
  const navigate = useNavigate();
  const [pharmacies, setPharmacies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/pharmacies");
      if (!res.ok) throw new Error("Failed to load pharmacy partners");
      const data = await res.json();
      setPharmacies(data);
    } catch (err) {
      console.error("[SelectPharmacy] Load error:", err);
      setError(err.message || "Failed to load pharmacies");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPharmacy = (id) => {
    navigate(`/browse/${id}`);
  };

  // Filter pharmacies based on search query
  const filteredPharmacies = pharmacies.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper to generate a consistent simulated distance and time based on ID
  const getSimulatedEstimate = (idStr) => {
    const sum = idStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const distanceKm = ((sum % 15) / 10 + 0.5).toFixed(1); // e.g. 0.5 to 1.9 km
    const timeMins = Math.round(distanceKm * 6 + 4); // e.g. 7 to 15 mins
    return { distanceKm, timeMins };
  };

  return (
    <Layout>
      <div className="bg-teal-50/20 py-8 min-h-[calc(100vh-140px)]">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Headline banner */}
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-teal-50 text-teal-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              10-Minute Health Commerce
            </div>
            <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">
              Select Pharmacy Store
            </h1>
            <p className="text-sm text-slate-500">
              Get medicines, vitamins, and healthcare essentials delivered to your doorstep in minutes.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-8">
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search nearest pharmacies or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100/50 shadow-sm"
            />
          </div>

          {/* Loader */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-teal-700" />
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="text-center py-12 text-red-650 bg-red-50 border border-red-100 rounded-2xl max-w-md mx-auto">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {/* Pharmacies Grid */}
          {!loading && !error && (
            <>
              {filteredPharmacies.length === 0 ? (
                <div className="text-center py-16 text-slate-500 border border-dashed rounded-2xl max-w-lg mx-auto bg-white/50">
                  <p>No pharmacies found matching your search.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {filteredPharmacies.map((pharmacy) => {
                    const { distanceKm, timeMins } = getSimulatedEstimate(pharmacy._id);
                    return (
                      <Card
                        key={pharmacy._id}
                        onClick={() => handleSelectPharmacy(pharmacy._id)}
                        className="cursor-pointer border-slate-150 shadow-sm bg-white overflow-hidden hover:shadow-lg hover:border-teal-300 transition-all duration-300 group flex flex-col justify-between"
                      >
                        <CardContent className="p-6 space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-slate-800 group-hover:text-teal-700 transition">
                                {pharmacy.name}
                              </h3>
                              <div className="flex items-center gap-1 text-xs text-slate-450 mt-1">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate max-w-[240px]">{pharmacy.address}</span>
                              </div>
                            </div>

                            {/* Rating badge */}
                            <div className="flex items-center gap-1 bg-green-50 border border-green-100 text-green-700 px-2 py-0.5 rounded-lg text-xs font-bold shrink-0">
                              <Star className="h-3.5 w-3.5 fill-current" />
                              {pharmacy.rating || "4.5"}
                            </div>
                          </div>

                          {/* Blinkit estimated delivery info badges */}
                          <div className="flex flex-wrap items-center gap-2 pt-2">
                            <span className="inline-flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 px-2.5 py-1 rounded-xl text-xs font-black uppercase tracking-wider animate-pulse">
                              <Clock className="h-3.5 w-3.5" />
                              {timeMins} Mins
                            </span>
                            <span className="bg-slate-100 text-slate-650 px-2.5 py-1 rounded-xl text-xs font-bold">
                              {distanceKm} km away
                            </span>
                            {pharmacy.isOpen ? (
                              <span className="bg-green-50 text-green-700 border border-green-100 px-2.5 py-1 rounded-xl text-xs font-bold">
                                Open Now
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-xl text-xs font-bold">
                                Closed
                              </span>
                            )}
                          </div>
                        </CardContent>
                        
                        {/* Selector card footer */}
                        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center group-hover:bg-teal-50/50 transition">
                          <span className="text-xs font-bold text-teal-700 tracking-wide uppercase">
                            Enter Pharmacy Catalog
                          </span>
                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-teal-700 group-hover:translate-x-1 transition-all" />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SelectPharmacy;
export { SelectPharmacy };
