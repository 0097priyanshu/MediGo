import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import SelectPharmacy from "./pages/SelectPharmacy";
import BrowseProducts from "./pages/BrowseProducts";
import Cart from "./pages/Cart";
import ProductDetail from "./pages/ProductDetail";
import NotFound from "./pages/NotFound";
import OrderTracking from "./pages/OrderTracking";
import Chatbot from "./pages/Chatbot";

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/search" element={<SearchResults />} />
    <Route path="/pharmacies" element={<SelectPharmacy />} />
    <Route path="/browse/:pharmacyId" element={<BrowseProducts />} />
    <Route path="/cart" element={<Cart />} />
      <Route path="/order-tracking/:id" element={<OrderTracking />} />
      <Route path="/help" element={<Chatbot />} />
    <Route path="/product/:productId" element={<ProductDetail />} />
    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </TooltipProvider>
      </QueryClientProvider>
    </CartProvider>
  </BrowserRouter>
);

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
