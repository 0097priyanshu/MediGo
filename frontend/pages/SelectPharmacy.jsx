import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const pharmacies = [
  { id: 1, name: "City Pharmacy", time: "30 min" },
  { id: 2, name: "Metro Health", time: "25 min" },
  { id: 3, name: "Prime Medicines", time: "35 min" },
  { id: 4, name: "Express Pharmacy", time: "20 min" },
];

const SelectPharmacy = () => {
  const navigate = useNavigate();
  const [selectedPharmacy, setSelectedPharmacy] = useState(null);

  const handleSelectPharmacy = (id) => {
    setSelectedPharmacy(id);
    navigate(`/browse/${id}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Select a Pharmacy</h1>
        <p className="text-muted-foreground mb-8">Choose from nearby pharmacies</p>

        <div className="grid gap-4 md:grid-cols-2">
          {pharmacies.map((pharmacy) => (
            <Card key={pharmacy.id} className="cursor-pointer hover:shadow-lg transition">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">{pharmacy.name}</h3>
                <p className="text-sm text-teal-600 mb-4">Delivery: {pharmacy.time}</p>
                <Button 
                  onClick={() => handleSelectPharmacy(pharmacy.id)}
                  className="w-full bg-teal-700"
                >
                  Select
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default SelectPharmacy;
