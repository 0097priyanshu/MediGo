import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Zap,
  MapPin,
  Clock,
  Shield,
  TrendingUp,
  Heart,
  Package,
  Users,
  CheckCircle2,
  ArrowRight,
  Search as SearchIcon,
} from "lucide-react";

export default function Index() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() || location.trim()) {
      const params = new URLSearchParams({
        ...(searchQuery && { q: searchQuery }),
        ...(location && { location }),
      });
      window.location.href = `/search?${params.toString()}`;
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 pb-32">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative container mx-auto px-4 text-center">
          <div className="mb-8">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              ⚡ Fast & Reliable Medicine Delivery
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6 text-foreground">
            Medicine Delivery
            <span className="block bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              in Minutes
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Order medicines from verified pharmacies near you. Get prescriptions
            verified by licensed professionals and delivered to your door in
            under 30 minutes.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
            <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-xl">
              <div className="flex-1 flex items-center gap-3 px-4">
                <SearchIcon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Search medicine or symptom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 focus-visible:ring-0 px-0"
                />
              </div>
              <div className="flex-1 flex items-center gap-3 px-4 border-t md:border-t-0 md:border-l border-border pt-3 md:pt-0">
                <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <Input
                  type="text"
                  placeholder="Your location..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="border-0 focus-visible:ring-0 px-0"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl"
              >
                Search
              </Button>
            </div>
          </form>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-border">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                30 min
              </div>
              <p className="text-sm text-muted-foreground">Average delivery</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-border">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                500+
              </div>
              <p className="text-sm text-muted-foreground">
                Partner pharmacies
              </p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-border">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                24/7
              </div>
              <p className="text-sm text-muted-foreground">Round the clock</p>
            </div>
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-xl p-4 border border-border">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-2">
                4.9★
              </div>
              <p className="text-sm text-muted-foreground">User rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              Why Choose MediFlow?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience healthcare delivery reimagined for the digital age
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-shadow">
                <Zap className="w-8 h-8 text-primary mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Lightning Fast
              </h3>
              <p className="text-muted-foreground">
                Get medicines delivered in 20-30 minutes from the nearest
                pharmacy. Real-time tracking included.
              </p>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-shadow">
                <Shield className="w-8 h-8 text-primary mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Verified & Safe
              </h3>
              <p className="text-muted-foreground">
                All pharmacies are verified. Prescriptions verified by licensed
                professionals. Secure payments.
              </p>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-shadow">
                <Heart className="w-8 h-8 text-primary mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Wide Selection
              </h3>
              <p className="text-muted-foreground">
                Access 10,000+ medicines from multiple pharmacies. Find
                alternatives and best prices instantly.
              </p>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-shadow">
                <Clock className="w-8 h-8 text-primary mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Available 24/7
              </h3>
              <p className="text-muted-foreground">
                Emergency medicines available round the clock. Never worry about
                urgent health needs.
              </p>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-shadow">
                <TrendingUp className="w-8 h-8 text-primary mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Smart Recommendations
              </h3>
              <p className="text-muted-foreground">
                AI-powered suggestions for medicine alternatives and preventive
                health insights.
              </p>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl p-6 mb-4 group-hover:shadow-lg transition-shadow">
                <Package className="w-8 h-8 text-primary mb-4" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">
                Real-time Tracking
              </h3>
              <p className="text-muted-foreground">
                Track your order in real-time. Get notified at every step of the
                delivery process.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 border-b border-border bg-muted/20"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get your medicines in 4 simple steps
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="relative">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                  1
                </div>
                <h3 className="font-semibold text-center mb-2 text-foreground">
                  Search
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Search for medicines or symptoms in your area
                </p>
                <div className="hidden md:block absolute top-16 -right-4 w-8 border-t-2 border-primary/30"></div>
              </div>

              <div className="relative">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                  2
                </div>
                <h3 className="font-semibold text-center mb-2 text-foreground">
                  Select
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Choose from verified pharmacies with best prices
                </p>
                <div className="hidden md:block absolute top-16 -right-4 w-8 border-t-2 border-primary/30"></div>
              </div>

              <div className="relative">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                  3
                </div>
                <h3 className="font-semibold text-center mb-2 text-foreground">
                  Verify
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Upload prescription & get verified by pharmacist
                </p>
              </div>

              <div>
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mb-4 mx-auto">
                  4
                </div>
                <h3 className="font-semibold text-center mb-2 text-foreground">
                  Deliver
                </h3>
                <p className="text-sm text-muted-foreground text-center">
                  Get your medicines delivered in 20-30 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Highlights */}
      <section className="py-20 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
            <div className="text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">100K+</h3>
              <p className="text-muted-foreground">Happy customers</p>
            </div>
            <div className="text-center">
              <CheckCircle2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">500+</h3>
              <p className="text-muted-foreground">Verified pharmacies</p>
            </div>
            <div className="text-center">
              <Package className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-foreground">50K+</h3>
              <p className="text-muted-foreground">Orders delivered</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
            Ready to Experience Faster Healthcare?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of customers getting their medicines delivered safely
            and quickly
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-white rounded-xl h-12 px-8"
            >
              Order Now <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-xl h-12 px-8"
            >
              Become a Partner
            </Button>
          </div>
        </div>
      </section>

      {/* Download Apps */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8 text-foreground">
            Download MediFlow App
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get the app for faster checkout, saved preferences, and exclusive
            mobile-only deals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="rounded-xl h-12 px-8 border-2">
              <span className="mr-2">📱</span> App Store
            </Button>
            <Button variant="outline" className="rounded-xl h-12 px-8 border-2">
              <span className="mr-2">🤖</span> Google Play
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
