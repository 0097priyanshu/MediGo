import { useState, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, ShoppingCart, ArrowLeft } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
}

const allProducts: Product[] = [
  {
    id: "1",
    name: "Crocin 500mg",
    price: 45,
    category: "medicines",
    image: "💊",
    inStock: true,
    rating: 4.5,
  },
  {
    id: "2",
    name: "Ibuprofen 400mg",
    price: 55,
    category: "medicines",
    image: "💊",
    inStock: true,
    rating: 4.3,
  },
  {
    id: "3",
    name: "Aspirin 500mg",
    price: 40,
    category: "medicines",
    image: "💊",
    inStock: true,
    rating: 4.6,
  },
  {
    id: "4",
    name: "Vitamin D3 Drops",
    price: 120,
    category: "vitamins",
    image: "🥤",
    inStock: true,
    rating: 4.7,
  },
  {
    id: "5",
    name: "Vitamin C 500mg",
    price: 80,
    category: "vitamins",
    image: "💊",
    inStock: true,
    rating: 4.4,
  },
  {
    id: "6",
    name: "Multivitamin Capsules",
    price: 150,
    category: "vitamins",
    image: "💊",
    inStock: false,
    rating: 4.5,
  },
  {
    id: "7",
    name: "Cetirizine 10mg",
    price: 35,
    category: "medicines",
    image: "💊",
    inStock: true,
    rating: 4.2,
  },
  {
    id: "8",
    name: "Paracetamol 650mg",
    price: 38,
    category: "medicines",
    image: "💊",
    inStock: true,
    rating: 4.4,
  },
  {
    id: "9",
    name: "Omeprazole 20mg",
    price: 65,
    category: "medicines",
    image: "💊",
    inStock: true,
    rating: 4.5,
  },
  {
    id: "10",
    name: "Bandages Pack",
    price: 25,
    category: "first-aid",
    image: "🩹",
    inStock: true,
    rating: 4.3,
  },
  {
    id: "11",
    name: "Antiseptic Liquid",
    price: 45,
    category: "first-aid",
    image: "🧴",
    inStock: true,
    rating: 4.6,
  },
  {
    id: "12",
    name: "Calcium & Magnesium",
    price: 180,
    category: "supplements",
    image: "💊",
    inStock: true,
    rating: 4.4,
  },
  {
    id: "13",
    name: "Face Cream SPF 30",
    price: 299,
    category: "beauty",
    image: "💄",
    inStock: true,
    rating: 4.5,
  },
  {
    id: "14",
    name: "Yoga Mat",
    price: 599,
    category: "wellness",
    image: "🧘",
    inStock: true,
    rating: 4.6,
  },
  {
    id: "15",
    name: "Baby Wipes Pack",
    price: 120,
    category: "baby-care",
    image: "👶",
    inStock: true,
    rating: 4.7,
  },
  {
    id: "16",
    name: "Shampoo 200ml",
    price: 150,
    category: "personal-care",
    image: "🧴",
    inStock: true,
    rating: 4.4,
  },
  {
    id: "17",
    name: "Ashwagandha Powder",
    price: 299,
    category: "ayurveda",
    image: "🌿",
    inStock: true,
    rating: 4.5,
  },
];

const categoryNames: { [key: string]: string } = {
  medicines: "Medicines",
  vitamins: "Vitamins",
  "first-aid": "First Aid",
  beauty: "Beauty",
  wellness: "Wellness",
  "baby-care": "Baby Care",
  "personal-care": "Personal Care",
  ayurveda: "Ayurveda",
};

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items, addItem, updateQuantity } = useCart();

  const searchQuery = searchParams.get("q") || "";
  const categoryFilter = searchParams.get("category") || "";

  const filteredProducts = useMemo(() => {
    let results = allProducts;

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter((product) =>
        product.name.toLowerCase().includes(query),
      );
    }

    // Filter by category
    if (categoryFilter) {
      results = results.filter(
        (product) => product.category === categoryFilter,
      );
    }

    return results;
  }, [searchQuery, categoryFilter]);

  const getCartItem = (productId: string) => {
    return items.find((item) => item.medicineId === productId);
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = getCartItem(product.id);
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      addItem({
        medicineId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image,
      });
    }
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => navigate("/")}
              className="hover:bg-muted p-2 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Search Results</h1>
              {searchQuery && (
                <p className="text-muted-foreground">
                  Results for "<strong>{searchQuery}</strong>"
                </p>
              )}
              {categoryFilter && (
                <p className="text-muted-foreground">
                  Category:{" "}
                  <strong>
                    {categoryNames[categoryFilter] || categoryFilter}
                  </strong>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold mb-2">No products found</h2>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? `No medicines matching "${searchQuery}" found`
                : "No products in this category"}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-primary hover:bg-primary/90"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground text-sm mb-6">
              Found {filteredProducts.length} product
              {filteredProducts.length !== 1 ? "s" : ""}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {filteredProducts.map((product) => {
                const cartItem = getCartItem(product.id);
                return (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
                  >
                    <CardContent className="p-4 flex flex-col h-full">
                      {/* Product Image */}
                      <div className="bg-muted rounded-lg p-6 text-center mb-3 flex-shrink-0">
                        <div className="text-4xl">{product.image}</div>
                      </div>

                      {/* Product Info */}
                      <h3 className="text-sm font-medium text-foreground mb-2 line-clamp-2 flex-grow">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="font-bold text-lg">
                          ₹{product.price}
                        </span>
                        {product.rating && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            ★ {product.rating}
                          </span>
                        )}
                      </div>

                      {!product.inStock && (
                        <span className="text-xs text-destructive font-semibold mb-3">
                          Out of Stock
                        </span>
                      )}

                      {/* Add to Cart / Quantity Selector */}
                      {cartItem ? (
                        <div className="flex items-center gap-2 bg-primary text-white rounded-lg p-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                cartItem.quantity - 1,
                              )
                            }
                            className="flex-shrink-0 p-1 hover:bg-primary/80 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="flex-1 text-center font-semibold text-sm">
                            {cartItem.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.id,
                                cartItem.quantity + 1,
                              )
                            }
                            className="flex-shrink-0 p-1 hover:bg-primary/80 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="w-full bg-primary hover:bg-primary/90 text-white text-sm"
                          size="sm"
                        >
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Add
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
