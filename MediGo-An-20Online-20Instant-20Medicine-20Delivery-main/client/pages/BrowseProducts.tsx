import { useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  image: string;
  inStock: boolean;
  rating: number;
}

const categories = [
  { id: "all", name: "All" },
  { id: "medicines", name: "Medicines" },
  { id: "vitamins", name: "Vitamins" },
  { id: "first-aid", name: "First Aid" },
  { id: "supplements", name: "Supplements" },
];

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
];

export default function BrowseProducts() {
  const { pharmacyId } = useParams<{ pharmacyId: string }>();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { items, addItem, updateQuantity } = useCart();

  const filteredProducts =
    selectedCategory === "all"
      ? allProducts
      : allProducts.filter((p) => p.category === selectedCategory);

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
        pharmacy: `Pharmacy ${pharmacyId}`,
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
          <h1 className="text-3xl font-bold mb-2">Browse Medicines</h1>
          <p className="text-muted-foreground">
            Pharmacy #{pharmacyId} • Delivery in 10-15 mins
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-border p-4 sticky top-24 h-fit">
              <h3 className="font-bold text-lg mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat.id
                        ? "bg-primary text-white font-semibold"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Products Grid */}
          <div className="lg:col-span-4">
            <div className="mb-6">
              <p className="text-muted-foreground text-sm">
                Showing {filteredProducts.length} products
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                          <span className="flex-1 text-center font-semibold">
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
                          className="w-full bg-primary hover:bg-primary/90 text-white"
                          size="sm"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
