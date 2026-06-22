import { useState } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { Plus, ShoppingCart } from "lucide-react";

const mockProducts = [
  { id: 1, name: "Aspirin 500mg", price: 45, category: "pain-relief", inStock: true },
  { id: 2, name: "Paracetamol 650mg", price: 35, category: "fever", inStock: true },
  { id: 3, name: "Amoxicillin 500mg", price: 125, category: "antibiotics", inStock: true },
  { id: 4, name: "Vitamin C Tablet", price: 30, category: "vitamins", inStock: true },
  { id: 5, name: "Cough Syrup", price: 80, category: "cough", inStock: true },
  { id: 6, name: "Antihistamine", price: 40, category: "allergy", inStock: true },
];

const BrowseProducts = () => {
  const { pharmacyId } = useParams();
  const { addItem } = useCart();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Pharmacy {pharmacyId}</h1>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">₹{product.price}</p>
                <Button 
                  onClick={() => addItem(product)}
                  className="w-full bg-teal-700"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default BrowseProducts;
