import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCart } from "@/context/CartContext";
import {
  ArrowLeft,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  Check,
} from "lucide-react";
import { useState } from "react";

interface ProductInfo {
  id: string;
  name: string;
  price: number;
  image: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  description: string;
  dosage: string;
  manufacturer: string;
  ingredients: string[];
  usage: string;
  sideEffects: string[];
}

const productDatabase: { [key: string]: ProductInfo } = {
  "1": {
    id: "1",
    name: "Crocin 500mg",
    price: 45,
    image: "💊",
    rating: 4.5,
    reviews: 324,
    inStock: true,
    description:
      "Effective pain reliever and fever reducer. Trusted by millions.",
    dosage: "500mg tablets",
    manufacturer: "GSK India",
    ingredients: ["Paracetamol 500mg"],
    usage:
      "Take 1-2 tablets every 4-6 hours as needed. Not to exceed 8 tablets in 24 hours.",
    sideEffects: ["Rare allergic reactions", "Liver damage with overdose"],
  },
  "2": {
    id: "2",
    name: "Ibuprofen 400mg",
    price: 55,
    image: "💊",
    rating: 4.3,
    reviews: 198,
    inStock: true,
    description:
      "Anti-inflammatory pain reliever for headaches and body aches.",
    dosage: "400mg tablets",
    manufacturer: "Cipla Limited",
    ingredients: ["Ibuprofen 400mg"],
    usage:
      "Take 1-2 tablets every 6-8 hours as needed. Not to exceed 6 tablets in 24 hours.",
    sideEffects: ["Stomach upset", "Dizziness", "Allergic reactions"],
  },
};

export default function ProductDetail() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addItem, items, updateQuantity } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = productDatabase[productId || ""] || {
    id: productId,
    name: "Aspirin 500mg",
    price: 40,
    image: "💊",
    rating: 4.6,
    reviews: 256,
    inStock: true,
    description: "Commonly used painkiller and anti-inflammatory medication.",
    dosage: "500mg tablets",
    manufacturer: "Bayer India",
    ingredients: ["Acetylsalicylic Acid 500mg"],
    usage:
      "Take 1-2 tablets every 4-6 hours as needed. Consult doctor before use.",
    sideEffects: ["Stomach bleeding", "Allergic reactions", "Heartburn"],
  };

  const cartItem = items.find((i) => i.medicineId === product.id);

  const handleAddToCart = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + quantity);
    } else {
      addItem({
        medicineId: product.id,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }
    setQuantity(1);
  };

  return (
    <Layout>
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="hover:bg-muted p-2 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Product Details</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {/* Product Image & Basic Info */}
          <Card className="md:col-span-1">
            <CardContent className="p-6">
              <div className="bg-muted rounded-lg p-12 text-center mb-6">
                <div className="text-8xl">{product.image}</div>
              </div>
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="font-semibold">{product.rating}</span>
                <span className="text-muted-foreground">
                  ({product.reviews} reviews)
                </span>
              </div>

              <div className="mb-6">
                <p className="text-3xl font-bold text-primary">
                  ₹{product.price}
                </p>
              </div>

              {product.inStock ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6">
                  <div className="flex items-center gap-2 text-green-700 font-semibold">
                    <Check className="w-5 h-5" />
                    In Stock
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-6">
                  <p className="text-red-700 font-semibold">Out of Stock</p>
                </div>
              )}

              {product.inStock && (
                <>
                  <div className="flex items-center gap-3 mb-6 bg-muted rounded-lg p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-white rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="flex-1 text-center font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-white rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    className="w-full bg-primary hover:bg-primary/90 h-12 text-base mb-3"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add to Cart
                  </Button>
                </>
              )}

              <Button variant="outline" className="w-full">
                Save for Later
              </Button>
            </CardContent>
          </Card>

          {/* Product Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">About this product</h3>
                <p className="text-muted-foreground mb-4">
                  {product.description}
                </p>
                <dl className="space-y-3">
                  <div className="flex justify-between">
                    <dt className="font-semibold">Dosage:</dt>
                    <dd className="text-muted-foreground">{product.dosage}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="font-semibold">Manufacturer:</dt>
                    <dd className="text-muted-foreground">
                      {product.manufacturer}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Active Ingredients</h3>
                <ul className="space-y-2">
                  {product.ingredients.map((ingredient, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">
                        {ingredient}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">How to Use</h3>
                <p className="text-muted-foreground">{product.usage}</p>
              </CardContent>
            </Card>

            {/* Side Effects */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">
                  Possible Side Effects
                </h3>
                <ul className="space-y-2">
                  {product.sideEffects.map((effect, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-muted-foreground"
                    >
                      <span className="text-primary font-bold">•</span>
                      {effect}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  *Consult your doctor if you experience any side effects.
                </p>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Customer Reviews</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-4 h-4 fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                      <span className="font-semibold">John D.</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Great product! Fast delivery and authentic.
                    </p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">Sarah M.</span>
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Good quality. Recommended!
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
