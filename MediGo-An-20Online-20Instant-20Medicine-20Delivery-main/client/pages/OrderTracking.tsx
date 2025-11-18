import { Layout } from "@/components/Layout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function OrderTracking() {
  const { id } = useParams();
  const [status, setStatus] = useState<string>("loading");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [amount, setAmount] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    const fetchStatus = async () => {
      try {
        const res = await fetch(`/api/order-status/${id}`);
        const d = await res.json();
        if (!mounted) return;
        setStatus(d.status ?? "unknown");
        setLocation(d.delivery ?? null);
        setAmount(d.amount ? Number(d.amount) / 100 : null);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    };

    fetchStatus();
    const iv = setInterval(fetchStatus, 3000);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [id]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold mb-4">Order Tracking</h1>
        <p className="text-sm text-muted-foreground mb-4">Order ID: {id}</p>

        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-1">Status</div>
          <div className="font-semibold text-lg">{status}</div>
        </div>

        <div className="mb-6">
          <div className="text-sm text-muted-foreground mb-1">Order Amount</div>
          <div className="font-semibold">{amount ? `₹${amount}` : "—"}</div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-1">Delivery Location</div>
          {location ? (
            <div className="p-4 border rounded">Lat: {location.lat}, Lng: {location.lng}</div>
          ) : (
            <div className="p-4 border rounded text-muted-foreground">Not available yet</div>
          )}
        </div>
      </div>
    </Layout>
  );
}
