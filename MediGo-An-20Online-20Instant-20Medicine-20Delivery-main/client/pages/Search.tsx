import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Clock,
  Star,
  Search as SearchIcon,
  ShoppingCart,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  distance: number;
  rating: number;
  reviews: number;
  avgPrepTime: number;
  address: string;
  medicines: Array<{
    name: string;
    strength: string;
    price: number;
    inStock: boolean;
  }>;
  isVerified: boolean;
}

// Mock data - in production, this would come from the API
const mockPharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "HealthCare Plus Pharmacy",
    distance: 1.2,
    rating: 4.8,
    reviews: 324,
    avgPrepTime: 15,
    address: "123 Main St, Downtown",
    isVerified: true,
    medicines: [
      { name: "Aspirin 500mg", strength: "500mg", price: 45, inStock: true },
      {
        name: "Paracetamol 650mg",
        strength: "650mg",
        price: 35,
        inStock: true,
      },
    ],
  },
  {
    id: "2",
    name: "MediCare Pharmacy Network",
    distance: 2.1,
    rating: 4.6,
    reviews: 198,
    avgPrepTime: 20,
    address: "456 Oak Ave, Midtown",
    isVerified: true,
    medicines: [
      { name: "Aspirin 500mg", strength: "500mg", price: 42, inStock: true },
      { name: "Ibuprofen 400mg", strength: "400mg", price: 55, inStock: false },
    ],
  },
  {
    id: "3",
    name: "City Pharmacy",
    distance: 3.5,
    rating: 4.3,
    reviews: 156,
    avgPrepTime: 25,
    address: "789 Pine Rd, Uptown",
    isVerified: true,
    medicines: [
      { name: "Aspirin 500mg", strength: "500mg", price: 40, inStock: true },
      { name: "Cough Syrup", strength: "100ml", price: 65, inStock: true },
    ],
  },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [filteredPharmacies, setFilteredPharmacies] = useState<Pharmacy[]>([]);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [sortBy, setSortBy] = useState<"distance" | "rating" | "prep-time">(
    "distance",
  );

  useEffect(() => {
    // In production, this would call the API with /search?query=&lat=&lng=&radius=
    setPharmacies(mockPharmacies);
    filterPharmacies(mockPharmacies);
  }, [searchQuery, location, sortBy]);

  const filterPharmacies = (allPharmacies: Pharmacy[]) => {
    let filtered = allPharmacies;

    // Filter by search query (medicine name)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pharmacy) =>
          pharmacy.medicines.some((med) =>
            med.name.toLowerCase().includes(query),
          ) || pharmacy.name.toLowerCase().includes(query),
      );
    }

    // Filter by location
    if (location.trim()) {
      // In production, this would use geospatial queries
      filtered = filtered.filter((pharmacy) =>
        pharmacy.address.toLowerCase().includes(location.toLowerCase()),
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return b.rating - a.rating;
        case "prep-time":
          return a.avgPrepTime - b.avgPrepTime;
        case "distance":
        default:
          return a.distance - b.distance;
      }
    });

    setFilteredPharmacies(sorted);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    filterPharmacies(pharmacies);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-6 text-foreground">
            Search Results
          </h1>

          {/* Search & Filter */}
          <form onSubmit={handleSearch} className="mb-8">
            <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg mb-6">
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
                className="bg-primary hover:bg-primary/90 rounded-xl"
              >
                Search
              </Button>
            </div>

            {/* Sort Options */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center">
                Sort by:
              </span>
              <Button
                type="button"
                variant={sortBy === "distance" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("distance")}
                className="rounded-full"
              >
                Distance
              </Button>
              <Button
                type="button"
                variant={sortBy === "rating" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("rating")}
                className="rounded-full"
              >
                Rating
              </Button>
              <Button
                type="button"
                variant={sortBy === "prep-time" ? "default" : "outline"}
                size="sm"
                onClick={() => setSortBy("prep-time")}
                className="rounded-full"
              >
                Prep Time
              </Button>
            </div>
          </form>

          {/* Results Count */}
          <p className="text-sm text-muted-foreground mb-6">
            Found {filteredPharmacies.length} pharmacies
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {filteredPharmacies.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No pharmacies found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search or location
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredPharmacies.map((pharmacy) => (
              <Card
                key={pharmacy.id}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-xl">
                          {pharmacy.name}
                        </CardTitle>
                        {pharmacy.isVerified && (
                          <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {pharmacy.address} • {pharmacy.distance} km away
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{pharmacy.rating}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {pharmacy.reviews} reviews
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Pharmacy Info */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Clock className="w-5 h-5 text-primary flex-shrink-0" />
                        <span className="text-muted-foreground">
                          Avg prep time:{" "}
                          <span className="font-semibold text-foreground">
                            {pharmacy.avgPrepTime} min
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Medicines */}
                    <div>
                      <h4 className="text-sm font-semibold mb-3 text-foreground">
                        Available Medicines:
                      </h4>
                      <div className="space-y-2">
                        {pharmacy.medicines.map((medicine, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-2 bg-muted/50 rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {medicine.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {medicine.strength}
                              </p>
                            </div>
                            <div className="text-right">
                              {medicine.inStock ? (
                                <div>
                                  <p className="text-sm font-semibold text-foreground">
                                    ₹{medicine.price}
                                  </p>
                                  <p className="text-xs text-primary">
                                    In Stock
                                  </p>
                                </div>
                              ) : (
                                <p className="text-xs text-destructive">
                                  Out of Stock
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex gap-3">
                    <Button className="flex-1 bg-primary hover:bg-primary/90 rounded-xl">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      View & Order
                    </Button>
                    <Button variant="outline" className="rounded-xl">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
