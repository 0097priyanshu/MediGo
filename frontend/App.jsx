import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext";
import Home from "./pages/Home";
import SelectPharmacy from "./pages/SelectPharmacy";
import BrowseProducts from "./pages/BrowseProducts";
import Cart from "./pages/Cart";
import TrackOrder from "./pages/TrackOrder";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/pharmacies" element={<SelectPharmacy />} />
    <Route path="/browse/:pharmacyId" element={<BrowseProducts />} />
    <Route path="/cart" element={<Cart />} />
    <Route path="/track/:orderId" element={<TrackOrder />} />
    <Route path="/admin" element={<AdminDashboard />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <BrowserRouter>
    <CartProvider>
      <AppRoutes />
    </CartProvider>
  </BrowserRouter>
);

const root = createRoot(document.getElementById("root"));
root.render(<App />);
