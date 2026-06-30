import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User as UserIcon, Mail, Shield, LogOut, Loader2, ArrowRight, ShoppingBag } from "lucide-react";

/**
 * Premium Profile Page component.
 * Displays details of the currently authenticated user.
 */
const Profile = () => {
  const { user, logout, getCurrentUser } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh user profile details upon loading page
    const refreshProfile = async () => {
      setProfileLoading(true);
      try {
        await getCurrentUser();
      } catch (err) {
        console.error("[Profile] Error refreshing profile data:", err);
      } finally {
        setProfileLoading(false);
      }
    };
    refreshProfile();
  }, []);

  const handleLogoutClick = () => {
    logout();
    navigate("/login");
  };

  if (profileLoading) {
    return (
      <Layout>
        <div className="flex min-h-[calc(100vh-140px)] items-center justify-center bg-teal-50/10">
          <Loader2 className="h-10 w-10 animate-spin text-teal-700" />
        </div>
      </Layout>
    );
  }

  if (!user) return null;

  return (
    <Layout>
      <div className="flex min-h-[calc(100vh-140px)] flex-col bg-teal-50/10 py-12 px-4">
        <div className="mx-auto w-full max-w-2xl space-y-6">
          <Card className="border-teal-100 shadow-xl overflow-hidden bg-white/80 backdrop-blur-md">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-teal-700 to-cyan-700 px-6 py-12 text-white flex flex-col items-center sm:flex-row sm:justify-between gap-4">
              <div className="flex flex-col items-center sm:flex-row gap-4 text-center sm:text-left">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/20 border-2 border-white text-3xl font-extrabold text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-cyan-100 text-sm capitalize">{user.role} Account</p>
                </div>
              </div>
              <Button
                onClick={handleLogoutClick}
                variant="outline"
                className="bg-white/10 hover:bg-white/25 text-white border-white/30 rounded-xl"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>

            {/* Profile Info Details */}
            <CardContent className="p-6 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                  <UserIcon className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</h4>
                    <p className="font-semibold text-slate-800">{user.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                  <Mail className="h-5 w-5 text-teal-650 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email Address</h4>
                    <p className="font-semibold text-slate-800 truncate">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                  <Shield className="h-5 w-5 text-teal-650 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User Role</h4>
                    <p className="font-semibold text-slate-800 capitalize">{user.role}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-xl border border-slate-100 p-4">
                  <ShoppingBag className="h-5 w-5 text-teal-650 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">User ID</h4>
                    <p className="text-xs font-semibold text-slate-500 font-mono truncate">{user.id || user._id}</p>
                  </div>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="border-t border-slate-100 pt-6 space-y-4">
                <h3 className="text-xs font-bold text-slate-650 uppercase tracking-wider">Quick Actions</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Link to="/pharmacies" className="block group">
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-teal-500 transition shadow-sm group-hover:shadow">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-850">Browse Pharmacies</span>
                        <span className="text-xs text-slate-500">Order from local health hubs</span>
                      </div>
                      <ArrowRight className="h-5 w-5 text-slate-400 group-hover:text-teal-600 transition group-hover:translate-x-1" />
                    </div>
                  </Link>

                  {user.role === "admin" && (
                    <Link to="/admin" className="block group">
                      <div className="flex items-center justify-between p-4 bg-teal-50/50 border border-teal-100 rounded-xl hover:border-teal-600 transition shadow-sm group-hover:shadow">
                        <div className="flex flex-col">
                          <span className="font-semibold text-teal-850">Admin Panel</span>
                          <span className="text-xs text-slate-500">Manage orders and catalog</span>
                        </div>
                        <ArrowRight className="h-5 w-5 text-teal-600 group-hover:text-teal-700 transition group-hover:translate-x-1" />
                      </div>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
