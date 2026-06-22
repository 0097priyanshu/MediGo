import { Link } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pill, Leaf, Sparkles, Heart, Headphones, ShoppingCart } from "lucide-react";

const Home = () => {
  return (
    <Layout>
      <div className="overflow-hidden bg-teal-800 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="rounded-3xl bg-gradient-to-br from-teal-700 via-teal-800 to-cyan-700 px-6 py-8 shadow-xl">
            <p className="text-sm uppercase tracking-wider text-cyan-200">Fast Delivery</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight">Order medicines instantly</h1>
            <p className="mt-4 text-cyan-100">Get your medicines delivered in 30 minutes</p>
            <Link to="/pharmacies">
              <Button className="mt-6 bg-white text-teal-800 hover:bg-cyan-50">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Get Started
              </Button>
            </Link>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <Pill className="mb-4 h-8 w-8 text-teal-600" />
                <h3 className="text-lg font-semibold">Wide Selection</h3>
                <p className="text-sm text-muted-foreground">Thousands of medicines</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Heart className="mb-4 h-8 w-8 text-teal-600" />
                <h3 className="text-lg font-semibold">Quality Assured</h3>
                <p className="text-sm text-muted-foreground">100% authentic products</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <Headphones className="mb-4 h-8 w-8 text-teal-600" />
                <h3 className="text-lg font-semibold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Always here to help</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
