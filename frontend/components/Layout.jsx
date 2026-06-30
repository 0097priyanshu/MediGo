import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User as UserIcon, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const Layout = ({ children }) => {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-teal-700 hover:text-teal-850 transition">
            MediGo
          </Link>
          
          <div className="flex items-center gap-4">
            {/* User Session UI */}
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold text-slate-700 hover:bg-teal-50 hover:text-teal-800 transition"
                >
                  <UserIcon className="h-4 w-4 text-teal-600" />
                  <span className="hidden sm:inline">{user.name}</span>
                </Link>
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="hidden md:inline-block text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1.5 rounded-lg border border-teal-100 hover:bg-teal-100 transition"
                  >
                    Admin
                  </Link>
                )}
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
                <Link to="/register">
                  <Button className="bg-teal-700 hover:bg-teal-800 font-semibold px-4 py-2 text-white shadow-sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

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

