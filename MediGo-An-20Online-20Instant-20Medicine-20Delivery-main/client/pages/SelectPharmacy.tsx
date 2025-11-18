import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Star, Clock, CheckCircle2 } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  distance: number;
  rating: number;
  reviews: number;
  prepTime: number;
  address: string;
  isOpen: boolean;
}

const pharmacies: Pharmacy[] = [
  {
    id: "1",
    name: "HealthCare Plus",
    distance: 1.2,
    rating: 4.8,
    reviews: 324,
    prepTime: 10,
    address: "123 Main St, Downtown",
    isOpen: true,
  },
  {
    id: "2",
    name: "MediCare Pharmacy",
    distance: 2.1,
    rating: 4.6,
    reviews: 198,
    prepTime: 12,
    address: "456 Oak Ave, Midtown",
    isOpen: true,
  },
  {
    id: "3",
    name: "City Pharmacy",
    distance: 3.5,
    rating: 4.3,
    reviews: 156,
    prepTime: 15,
    address: "789 Pine Rd, Uptown",
    isOpen: true,
  },
  {
    id: "4",
    name: "Express Chemist",
    distance: 0.8,
    rating: 4.9,
    reviews: 502,
    prepTime: 8,
    address: "321 High St, City Center",
    isOpen: true,
  },
];

export default function SelectPharmacy() {
  const navigate = useNavigate();
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

  const handleSelectPharmacy = (pharmacyId: string) => {
    setSelectedPharmacy(pharmacyId);
    navigate(`/browse/${pharmacyId}`);
  };

  return (
    <Layout>
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Select a Pharmacy</h1>
          <p className="text-muted-foreground">
            Choose from nearby pharmacies to get started
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pharmacies.map((pharmacy) => (
            <Card
              key={pharmacy.id}
              className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary"
              onClick={() => handleSelectPharmacy(pharmacy.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1">
                      {pharmacy.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {pharmacy.distance} km • {pharmacy.address}
                    </CardDescription>
                  </div>
                  {pharmacy.isOpen && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                      Open
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{pharmacy.rating}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {pharmacy.reviews} reviews
                    </p>
                  </div>
                  <div className="text-center border-l border-r border-border">
                    <div className="font-bold mb-1">
                      {pharmacy.prepTime} mins
                    </div>
                    <p className="text-xs text-muted-foreground">Avg time</p>
                  </div>
                  <div className="text-center">
                    <div className="font-bold mb-1">✓</div>
                    <p className="text-xs text-muted-foreground">Verified</p>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPharmacy(pharmacy.id);
                  }}
                >
                  Browse Medicines
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
