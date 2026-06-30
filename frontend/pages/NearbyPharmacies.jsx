import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import PharmacyMap from "@/components/PharmacyMap";
import { MapPin, Star, Clock, Sparkles, Loader2, AlertCircle, ShoppingBag, Eye, HelpCircle, X } from "lucide-react";

// Inline Error Boundary to debug and print any React-Leaflet runtime failures
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 bg-red-50 border border-red-200 rounded-xl text-red-800 m-4 max-w-2xl mx-auto">
          <h2 className="text-lg font-bold">Map Page Render Crash Catch:</h2>
          <p className="text-xs text-red-650 mt-1">
            The mapping component encountered an error. The stack details are listed below:
          </p>
          <pre className="text-xs mt-3 overflow-auto max-h-60 p-3 bg-red-100 rounded border border-red-200 font-mono whitespace-pre-wrap">
            {this.state.error ? this.state.error.stack || this.state.error.message : "Unknown error"}
          </pre>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 bg-red-700 hover:bg-red-800 text-white text-xs px-3 py-1.5 rounded font-bold transition"
          >
            Reset Component state
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * NearbyPharmacies page.
 * Requests geolocation coordinate parameters, fetches nearest sorted pharmacies,
 * maps pins on OpenStreetMap, and retrieves instant medicines lists.
 */
const NearbyPharmacies = () => {
  const navigate = useNavigate();

  // Location and shops state
  const [coords, setCoords] = useState(null);
  const [coordsLoading, setCoordsLoading] = useState(true);
  const [coordsError, setCoordsError] = useState("");

  const [pharmacies, setPharmacies] = useState([]);
  const [pharmaciesLoading, setPharmaciesLoading] = useState(false);
  const [fetchError, setFetchError] = useState("");

  // Selected pharmacy medicines viewer
  const [selectedPh, setSelectedPh] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [medsLoading, setMedsLoading] = useState(false);
  const [medsError, setMedsError] = useState("");

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setCoordsLoading(true);
    setCoordsError("");
    setFetchError("");

    if (!navigator.geolocation) {
      setCoordsError("Geolocation is not supported by your browser.");
      setCoordsLoading(false);
      // Fallback: fetch general default pharmacies
      fetchNearbyShops(28.6273, 77.3725);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;
        setCoords({ latitude: userLat, longitude: userLon });
        setCoordsLoading(false);
        fetchNearbyShops(userLat, userLon);
      },
      (error) => {
        console.warn("[Geolocation] Permission denied or position unavailable:", error.message);
        let errorMsg = "Unable to retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location access was denied. Showing default Noida Sector 62 partners.";
        }
        setCoordsError(errorMsg);
        setCoordsLoading(false);
        // Fallback Noida center
        fetchNearbyShops(28.6273, 77.3725);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const fetchNearbyShops = async (lat, lon) => {
    setPharmaciesLoading(true);
    setFetchError("");
    try {
      const res = await fetch(`/api/pharmacies/nearby?latitude=${lat}&longitude=${lon}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to fetch nearby shops");
      }
      const data = await res.json();
      setPharmacies(data);
    } catch (err) {
      console.error("[NearbyPharmacies] Load error:", err);
      setFetchError(err.message || "Unable to parse nearby pharmacies");
    } finally {
      setPharmaciesLoading(false);
    }
  };

  const handleSelectPharmacy = (phId) => {
    navigate(`/browse/${phId}`);
  };

  const handleViewMedicines = async (ph) => {
    setSelectedPh(ph);
    setMedsLoading(true);
    setMedsError("");
    setMedicines([]);
    try {
      const res = await fetch(`/api/pharmacies/${ph._id}/medicines`);
      if (!res.ok) throw new Error("Failed to retrieve pharmacy catalog");
      const data = await res.json();
      setMedicines(data);
    } catch (err) {
      console.error("[NearbyMeds] Error:", err);
      setMedsError(err.message || "Failed to load medicines list");
    } finally {
      setMedsLoading(false);
    }
  };

  return (
    <Layout>
      <ErrorBoundary>
        <div className="bg-slate-50 min-h-[calc(100vh-140px)] py-8 px-4">
          <div className="container mx-auto max-w-6xl space-y-8">
            
            {/* Header titles */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                  <MapPin className="h-7 w-7 text-teal-700" />
                  Find Nearby Pharmacies
                </h1>
                <p className="text-sm text-slate-500 mt-1">
                  Discover medical stores close to your coordinate coordinates on OpenStreetMap.
                </p>
              </div>
              <Button
                onClick={getUserLocation}
                variant="outline"
                className="border-teal-100 text-teal-800 hover:bg-teal-50"
                disabled={coordsLoading || pharmaciesLoading}
              >
                {(coordsLoading || pharmaciesLoading) ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Recalculate Distance
              </Button>
            </div>

            {/* Warning geolocation permission alert banner */}
            {coordsError && (
              <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-sm">
                <AlertCircle className="h-5 w-5 shrink-0 text-amber-650" />
                <div>
                  <span className="font-bold">Location Update Notice: </span>
                  {coordsError}
                </div>
              </div>
            )}

            {/* Layout Grid Map & List */}
            <div className="grid gap-6 md:grid-cols-5">
              {/* Map wrapper - Left column */}
              <div className="md:col-span-3 space-y-4">
                <Card className="border-slate-150 overflow-hidden shadow-sm">
                  <CardContent className="p-0">
                    <PharmacyMap
                      userCoords={coords}
                      pharmacies={pharmacies}
                      onSelectPharmacy={handleSelectPharmacy}
                    />
                  </CardContent>
                </Card>
              </div>

              {/* List wrapper - Right column */}
              <div className="md:col-span-2 space-y-4">
                <Card className="border-slate-150 shadow-sm h-[400px] flex flex-col justify-between bg-white">
                  <CardHeader className="border-b pb-3.5">
                    <CardTitle className="text-base font-bold text-slate-800">Nearest Partners</CardTitle>
                    <CardDescription className="text-xs">Sorted by distance from your coordinates</CardDescription>
                  </CardHeader>
                  
                  {/* Scrollable shops listing */}
                  <div className="flex-1 overflow-y-auto divide-y">
                    {pharmaciesLoading && (
                      <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
                      </div>
                    )}

                    {!pharmaciesLoading && fetchError && (
                      <div className="p-6 text-center text-red-650 text-xs flex items-center justify-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        <span>{fetchError}</span>
                      </div>
                    )}

                    {!pharmaciesLoading && !fetchError && pharmacies.length === 0 && (
                      <p className="p-6 text-center text-slate-500 text-xs">
                        No matching pharmacy hubs registered near you.
                      </p>
                    )}

                    {!pharmaciesLoading && !fetchError && pharmacies.map((pharmacy) => (
                      <div
                        key={pharmacy._id}
                        className="p-4 flex justify-between items-start gap-2 hover:bg-slate-50/50 transition cursor-pointer"
                        onClick={() => handleViewMedicines(pharmacy)}
                      >
                        <div>
                          <span className="font-bold text-slate-800 text-sm block">
                            {pharmacy.name}
                          </span>
                          <span className="text-[10px] text-slate-450 mt-0.5 block truncate max-w-[200px]">
                            {pharmacy.address}
                          </span>
                          
                          <div className="flex gap-2 items-center text-[10px] mt-1 font-semibold">
                            <span className="text-teal-700">⭐ {pharmacy.rating || "4.5"}</span>
                            <span className="text-slate-300">|</span>
                            <span className={pharmacy.isOpen ? "text-green-600" : "text-red-500"}>
                              {pharmacy.isOpen ? "Open" : "Closed"}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="bg-teal-50 border border-teal-100 text-teal-850 px-2 py-0.5 rounded-lg text-xs font-black block w-fit ml-auto">
                            {pharmacy.distanceKm !== undefined ? `${pharmacy.distanceKm} km` : "0.5 km"}
                          </span>
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPharmacy(pharmacy._id);
                            }}
                            className="bg-teal-700 text-white hover:bg-teal-800 text-[10px] h-7 px-2.5 rounded-lg mt-2 font-bold shadow-sm"
                          >
                            Select Store
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </div>

            {/* MEDICINES INVENTORY PREVIEW DRAWER */}
            {selectedPh && (
              <Card className="border-slate-150 shadow-md bg-white">
                <CardHeader className="border-b pb-3 flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-base font-bold text-slate-850 flex items-center gap-1.5">
                      <ShoppingBag className="h-4.5 w-4.5 text-teal-750" />
                      Medicines Catalog Preview: {selectedPh.name}
                    </CardTitle>
                    <CardDescription className="text-xs">Available stock indices inside this store</CardDescription>
                  </div>
                  <button
                    onClick={() => setSelectedPh(null)}
                    className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </CardHeader>
                <CardContent className="p-6">
                  {medsLoading && (
                    <div className="flex justify-center items-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-teal-700" />
                    </div>
                  )}

                  {medsError && (
                    <div className="text-center text-xs text-red-650 py-6 flex items-center justify-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>{medsError}</span>
                    </div>
                  )}

                  {!medsLoading && !medsError && medicines.length === 0 && (
                    <p className="text-slate-500 text-center py-6 text-xs">
                      This pharmacy hasn't listed any medicine products yet.
                    </p>
                  )}

                  {!medsLoading && !medsError && medicines.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {medicines.map((med, idx) => (
                        <div
                          key={idx}
                          className="p-3 border rounded-xl bg-slate-50/50 flex flex-col justify-between text-xs"
                        >
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400">
                              {med.category}
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm mt-0.5 truncate">{med.name}</h4>
                          </div>
                          
                          <div className="flex justify-between items-center mt-3 border-t pt-2 border-slate-100">
                            <span className="font-extrabold text-teal-800 text-sm">₹{med.price}</span>
                            <span className={`px-2 py-0.5 rounded font-semibold text-[10px] ${med.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                              {med.stock > 0 ? `${med.stock} left` : "Out of stock"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

          </div>
        </div>
      </ErrorBoundary>
    </Layout>
  );
};

export default NearbyPharmacies;
export { NearbyPharmacies };
