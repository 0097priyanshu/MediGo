import { Link } from "react-router-dom";
import { ShoppingCart, MapPin, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export function Header() {
  const { itemCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(
    "Home, Koramangala, Bangalore",
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-border shadow-sm">
        <div className="container mx-auto px-4">
          {/* Top bar with delivery address */}
          <div className="h-12 flex items-center justify-between border-b border-border text-sm">
            <div
              className="flex items-center gap-2 cursor-pointer hover:text-primary"
              onClick={() => setShowAddressModal(true)}
            >
              <MapPin className="w-4 h-4" />
              <span className="font-medium truncate max-w-xs">
                {selectedAddress}
              </span>
              <ChevronDown className="w-4 h-4" />
            </div>
            <span className="text-muted-foreground">12-20 mins</span>
          </div>

          {/* Main header */}
          <div className="h-16 flex items-center justify-between">
            {/* Logo and search */}
            <div className="flex items-center gap-6 flex-1">
              <Link
                to="/"
                className="font-bold text-2xl text-primary flex-shrink-0"
              >
                MediGo
              </Link>

              {/* Desktop search - hidden on mobile */}
              <div className="hidden md:flex flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full px-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              {/* Desktop auth buttons */}
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </div>

              {/* Cart button */}
              <Link to="/cart" className="relative">
                <Button variant="outline" size="icon" className="relative">
                  <ShoppingCart className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </Button>
              </Link>

              {/* Mobile menu */}
              <button
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="container mx-auto px-4 py-4 space-y-3">
              <input
                type="text"
                placeholder="Search for products..."
                className="w-full px-4 py-2 bg-muted rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                size="sm"
              >
                Sign In
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Address modal */}
      {showAddressModal && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center"
          onClick={() => setShowAddressModal(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-4">Select Delivery Address</h2>
            <div className="space-y-3 mb-6">
              {[
                "Home, Koramangala, Bangalore",
                "Work, MG Road, Bangalore",
                "Parents Place, Indiranagar",
              ].map((addr) => (
                <button
                  key={addr}
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddressModal(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-colors ${
                    selectedAddress === addr
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary"
                  }`}
                >
                  <div className="font-medium">{addr.split(",")[0]}</div>
                  <div className="text-sm text-muted-foreground">{addr}</div>
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddressModal(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-muted/40 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-sm">
            <div>
              <h4 className="font-bold mb-4">Categories</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Prescription Medicines
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Over-the-Counter (OTC)
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Personal Care & Wellness
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">About</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Help</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="/help" className="hover:text-primary">
                    Support
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    FAQs
                  </a>
                </li>
                <li>
                  <a href="/help" className="hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-primary">
                    Terms
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-primary">
                    Cookies
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MediGo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
