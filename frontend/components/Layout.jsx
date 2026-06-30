import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User as UserIcon, LogOut, LayoutDashboard, Truck, ClipboardList, Package, Home } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

/**
 * Premium Layout wrapper.
 * Dynamically displays navigation tabs and controls depending on the authenticated role.
 */
const Layout = ({ children }) => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // Define role-based navigation links
  const getNavLinks = () => {
    if (!user) {
      return [
        { path: "/", label: "Home", icon: Home },
        { path: "/pharmacies", label: "Medicines", icon: Package },
      ];
    }

    switch (user.role) {
      case "customer":
        return [
          { path: "/home", label: "Home", icon: Home },
          { path: "/pharmacies", label: "Medicines", icon: Package },
          { path: "/profile", label: "My Orders", icon: ClipboardList },
        ];
      case "store":
        return [
          { path: "/store-dashboard", label: "Dashboard", icon: LayoutDashboard },
          { path: "/store-dashboard", label: "Medicines", icon: Package },
          { path: "/store-dashboard", label: "Orders", icon: ClipboardList },
        ];
      case "delivery":
        return [
          { path: "/delivery-dashboard", label: "Dashboard", icon: LayoutDashboard },
          { path: "/delivery-dashboard", label: "Deliveries", icon: Truck },
          { path: "/delivery-dashboard", label: "History", icon: ClipboardList },
        ];
      case "admin":
        return [
          { path: "/", label: "Home", icon: Home },
          { path: "/admin", label: "Admin Panel", icon: LayoutDashboard },
        ];
      default:
        return [];
    }
  };

  const navLinks = getNavLinks();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center justify-between w-full sm:w-auto">
            <Link to={user?.role === "customer" ? "/home" : "/"} className="text-2xl font-bold text-teal-700 hover:text-teal-850 transition">
              MediGo
            </Link>
          </div>
          
          {/* Dynamic Navigation Tabs */}
          <nav className="flex items-center gap-1 overflow-x-auto max-w-full">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.label}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    isActive
                      ? "bg-teal-50 text-teal-800"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-4">
            {/* User Profile avatar actions */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.name}
                      className="h-6 w-6 rounded-full border object-cover"
                    />
                  ) : (
                    <UserIcon className="h-4 w-4 text-teal-600" />
                  )}
                  <span className="hidden sm:inline font-bold">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-650 hover:bg-red-50 transition"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" className="text-teal-750 hover:text-teal-800 hover:bg-teal-50/50 font-semibold px-4 py-2">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}

            {/* Shopping Cart (only displayed for Customer / Guest users) */}
            {(!user || user.role === "customer") && (
              <Link to="/cart">
                <Button className="relative bg-teal-700 hover:bg-teal-800 transition">
                  <ShoppingCart className="h-5 w-5 text-white" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border border-white">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-slate-100 border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} MediGo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
export { Layout };
