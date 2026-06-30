import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Store, FileText, CheckCircle, ShieldAlert, Phone, MapPin, Loader2, LogOut, Clock } from "lucide-react";

/**
 * Premium Store Registration Page.
 * Collects pharmacy details for new store owners and displays approval pending states.
 */
const StoreRegistration = () => {
  const { user, submitStoreDetails, logout, getCurrentUser } = useAuth();
  const [shopName, setShopName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Redirect if they aren't a store user
  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "store") {
      navigate("/");
      return;
    }
    if (user.isApproved) {
      navigate("/store-dashboard");
    }
  }, [user, navigate]);

  // Periodically check approval status (poll profile every 10 seconds while on this page)
  useEffect(() => {
    if (user && user.role === "store" && user.shopName && !user.isApproved) {
      const interval = setInterval(async () => {
        try {
          const updatedUser = await getCurrentUser();
          if (updatedUser && updatedUser.isApproved) {
            navigate("/store-dashboard");
          }
        } catch (err) {
          console.error("Polled profile refresh error:", err);
        }
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [user, getCurrentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!shopName || !licenseNumber || !gstNumber || !phone || !address) {
      setError("Please fill in all shop details.");
      return;
    }

    setFormLoading(true);
    try {
      await submitStoreDetails({
        shopName,
        licenseNumber,
        gstNumber,
        phone,
        address,
      });
    } catch (err) {
      setError(err.message || "Failed to submit store registration.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleSignOut = () => {
    logout();
    navigate("/login");
  };

  if (!user || user.role !== "store") return null;

  // Render pending approval view if details are already submitted
  if (user.shopName) {
    return (
      <Layout>
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-blue-50/10 px-4 py-12">
          <Card className="w-full max-w-lg border-blue-100 shadow-xl bg-white/90 backdrop-blur-md">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-700 mb-4 animate-pulse">
                <Clock className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-bold text-blue-900">Application Under Review</CardTitle>
              <CardDescription className="text-sm text-slate-500 max-w-[320px] mx-auto">
                Thanks for applying! Our administrator team is verifying your registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 space-y-3 text-sm">
                <div className="flex justify-between border-b pb-2 border-slate-100">
                  <span className="font-semibold text-slate-500">Shop Name</span>
                  <span className="font-bold text-slate-800">{user.shopName}</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-slate-100">
                  <span className="font-semibold text-slate-500">License ID</span>
                  <span className="font-mono text-slate-800">{user.licenseNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-slate-100">
                  <span className="font-semibold text-slate-500">GST Registration</span>
                  <span className="font-mono text-slate-800">{user.gstNumber}</span>
                </div>
                <div className="flex justify-between border-b pb-2 border-slate-100">
                  <span className="font-semibold text-slate-500">Contact Phone</span>
                  <span className="text-slate-800">{user.phone}</span>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <span className="font-semibold text-slate-500">Store Address</span>
                  <span className="text-slate-800 text-xs">{user.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 rounded-xl bg-teal-50 border border-teal-150 p-4 text-xs text-teal-850">
                <ShieldAlert className="h-5 w-5 shrink-0 text-teal-700 mt-0.5" />
                <p className="leading-relaxed">
                  Your store dashboard and drug inventory management tools will become unlocked as soon as approval is granted by the system administrator.
                </p>
              </div>

              <div className="flex gap-4">
                <Button 
                  onClick={async () => {
                    setFormLoading(true);
                    await getCurrentUser();
                    setFormLoading(false);
                  }}
                  className="flex-1 bg-blue-700 text-white hover:bg-blue-800 py-5 font-semibold rounded-xl flex items-center justify-center"
                  disabled={formLoading}
                >
                  {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh Status"}
                </Button>
                <Button 
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-slate-200 text-slate-650 hover:bg-slate-50 py-5 font-semibold rounded-xl"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Render details collection form
  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-blue-50/10 px-4 py-12">
        <Card className="w-full max-w-xl border-blue-100 shadow-xl bg-white/90 backdrop-blur-md">
          <CardHeader className="space-y-2 text-center pb-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700 mb-2">
              <Store className="h-7 w-7" />
            </div>
            <CardTitle className="text-2xl font-extrabold text-blue-900 tracking-tight">Register Pharmacy Details</CardTitle>
            <CardDescription className="text-sm text-slate-500 max-w-[340px] mx-auto">
              Please enter your business drug licenses to request store owner activation.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 border border-red-100">
                <ShieldAlert className="h-5 w-5 shrink-0 text-red-650" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="shopName">
                    Shop / Pharmacy Name
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Store className="h-4 w-4" />
                    </span>
                    <input
                      id="shopName"
                      type="text"
                      placeholder="e.g. Wellness Medicos"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
                      disabled={formLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="license">
                    Drug License Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <FileText className="h-4 w-4" />
                    </span>
                    <input
                      id="license"
                      type="text"
                      placeholder="DL-12345-67"
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
                      disabled={formLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="gst">
                    GSTIN Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <FileText className="h-4 w-4" />
                    </span>
                    <input
                      id="gst"
                      type="text"
                      placeholder="07AAAAA1111A1Z1"
                      value={gstNumber}
                      onChange={(e) => setGstNumber(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
                      disabled={formLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="phone">
                    Contact Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </span>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 99999 88888"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50"
                      disabled={formLoading}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-slate-650 uppercase tracking-wider" htmlFor="address">
                    Physical Pharmacy Address
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-start pl-3 pt-3 text-slate-400">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <textarea
                      id="address"
                      rows={3}
                      placeholder="Enter the complete shop address for order pickups"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 resize-none"
                      disabled={formLoading}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-blue-700 text-white hover:bg-blue-800 py-6 font-semibold rounded-xl flex justify-center items-center shadow-md disabled:bg-blue-350"
                  disabled={formLoading}
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={handleSignOut}
                  variant="outline"
                  className="border-slate-200 text-slate-650 hover:bg-slate-50 py-6 font-semibold rounded-xl"
                  disabled={formLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default StoreRegistration;
export { StoreRegistration };
