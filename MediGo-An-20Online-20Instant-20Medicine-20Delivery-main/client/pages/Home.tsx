import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  slug: string;
}

const categories: Category[] = [
  {
    id: "1",
    name: "Medicines",
    icon: "💊",
    color: "bg-red-50",
    slug: "medicines",
  },
  {
    id: "2",
    name: "Vitamins",
    icon: "🥤",
    color: "bg-blue-50",
    slug: "vitamins",
  },
  {
    id: "3",
    name: "First Aid",
    icon: "🩹",
    color: "bg-green-50",
    slug: "first-aid",
  },
  { id: "4", name: "Beauty", icon: "💄", color: "bg-pink-50", slug: "beauty" },
  {
    id: "5",
    name: "Wellness",
    icon: "🧘",
    color: "bg-purple-50",
    slug: "wellness",
  },
  {
    id: "6",
    name: "Baby Care",
    icon: "👶",
    color: "bg-yellow-50",
    slug: "baby-care",
  },
  {
    id: "7",
    name: "Personal Care",
    icon: "🧴",
    color: "bg-orange-50",
    slug: "personal-care",
  },
  {
    id: "8",
    name: "Ayurveda",
    icon: "🌿",
    color: "bg-green-100",
    slug: "ayurveda",
  },
];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  return (
    <Layout>
      {/* Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">Order Medicines & More</h1>
          <p className="text-sm opacity-90 mb-4">
            Get medicines delivered in 10 minutes
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/search?category=${category.slug}`}
                className="group"
              >
                <Card
                  className={`${category.color} border-0 hover:shadow-lg transition-shadow cursor-pointer h-full`}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{category.icon}</div>
                    <p className="text-sm font-medium text-foreground group-hover:text-primary">
                      {category.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended</h2>
            <Link
              to="/category/medicines"
              className="text-primary font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Featured Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { id: 1, name: "Crocin 500mg", price: 45, image: "💊" },
              { id: 2, name: "Ibuprofen 400mg", price: 55, image: "💊" },
              { id: 3, name: "Aspirin 500mg", price: 40, image: "💊" },
              { id: 4, name: "Vitamin D3 Drops", price: 120, image: "🥤" },
              { id: 5, name: "Cetirizine 10mg", price: 35, image: "💊" },
              { id: 6, name: "Paracetamol 650mg", price: 38, image: "💊" },
            ].map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group"
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="bg-muted rounded-lg p-8 text-center mb-3 group-hover:bg-primary/5 transition-colors">
                      <div className="text-4xl">{product.image}</div>
                    </div>
                    <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-2 group-hover:text-primary">
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-lg">
                        ₹{product.price}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
