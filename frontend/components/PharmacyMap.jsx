import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Resolve default leaflet marker icon bundling issues in Vite
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Configured default icon options
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom colored icon for the user's current location pin (Red marker)
const userLocationIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

/**
 * Helper component to automatically re-center the map view when center coordinates change.
 */
const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
};

/**
 * Reusable PharmacyMap component using OpenStreetMap tiles.
 * Displays user position and pharmacy indicators.
 */
const PharmacyMap = ({ userCoords, pharmacies, onSelectPharmacy }) => {
  const mapCenter = userCoords ? [userCoords.latitude, userCoords.longitude] : [28.6273, 77.3725]; // Noida Sector 62 fallback

  return (
    <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md border relative z-10">
      <MapContainer
        center={mapCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location indicator pin */}
        {userCoords && (
          <Marker position={[userCoords.latitude, userCoords.longitude]} icon={userLocationIcon}>
            <Popup>
              <div className="text-center font-bold text-slate-800 text-xs">
                📍 You are here
              </div>
            </Popup>
          </Marker>
        )}

        {/* Pharmacy partner location pins */}
        {pharmacies.map((pharmacy) => {
          const phLat = pharmacy.latitude !== undefined ? pharmacy.latitude : 28.6273;
          const phLon = pharmacy.longitude !== undefined ? pharmacy.longitude : 77.3725;

          return (
            <Marker key={pharmacy._id} position={[phLat, phLon]}>
              <Popup>
                <div className="p-1 space-y-1">
                  <h4 className="font-bold text-slate-800 text-sm leading-tight">
                    {pharmacy.name}
                  </h4>
                  <p className="text-[10px] text-slate-500">{pharmacy.address}</p>
                  
                  <div className="flex gap-2 items-center pt-1 text-xs">
                    <span className="font-bold text-teal-800">
                      ⭐ {pharmacy.rating || "4.5"}
                    </span>
                    <span className="text-slate-400">|</span>
                    <span className="font-black text-amber-700 uppercase tracking-wide">
                      {pharmacy.distanceKm !== undefined ? `${pharmacy.distanceKm} km` : "Nearby"}
                    </span>
                  </div>

                  <div className="pt-2 flex justify-between items-center">
                    <span className={`text-[10px] font-bold uppercase ${pharmacy.isOpen ? "text-green-600" : "text-red-500"}`}>
                      {pharmacy.isOpen ? "Open Now" : "Closed"}
                    </span>
                    
                    <button
                      onClick={() => onSelectPharmacy(pharmacy._id)}
                      className="bg-teal-700 hover:bg-teal-800 text-white text-[10px] font-bold px-2 py-1 rounded transition"
                    >
                      Browse Meds
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* View re-centering trigger */}
        <MapUpdater center={mapCenter} />
      </MapContainer>
    </div>
  );
};

export default PharmacyMap;
export { PharmacyMap };
