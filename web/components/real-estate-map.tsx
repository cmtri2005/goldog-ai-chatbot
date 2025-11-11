"use client";

import { MapPin, DollarSign, Ruler } from "lucide-react";
import { useEffect, useRef } from "react";
import type { RealEstateProperty } from "@/lib/ai/tools/get-real-estate";
import Image from "next/image";

export interface RealEstateMapProps {
  properties: RealEstateProperty[];
  onPropertySelect?: (property: RealEstateProperty) => void;
}

const getMarkerColor = (type: string): string => {
  const colors: Record<string, string> = {
    apartment: "#0084FF",
    house: "#22AA22",
    land: "#FFAA00",
    commercial: "#FF0000",
  };
  return colors[type] || "#FF0000";
};

const createCustomMarker = (color: string, L: any) => {
  return L.divIcon({
    html: `<div style="
      background-color: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      cursor: pointer;
    ">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export function RealEstateMap({
  properties,
  onPropertySelect,
}: RealEstateMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any | null>(null);
  const leafletRef = useRef<any>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !properties.length) return;

    // Dynamic import of Leaflet to avoid SSR issues
    import("leaflet").then((L) => {
      leafletRef.current = L;

      // Clean up old map if it exists
      if (mapInstance.current) {
        try {
          mapInstance.current.remove();
        } catch (e) {
          console.log("Error removing old map");
        }
        mapInstance.current = null;
      }

      // Calculate center and bounds
      const calculateBounds = () => {
        if (properties.length === 0) {
          return {
            center: { lat: 10.776, lng: 106.696 },
            zoom: 11,
          };
        }

        const lats = properties.map((p) => p.lat);
        const lngs = properties.map((p) => p.lng);
        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLng = Math.min(...lngs);
        const maxLng = Math.max(...lngs);

        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        return {
          center: { lat: centerLat, lng: centerLng },
          zoom: 13,
        };
      };

      const bounds = calculateBounds();

      // Create map
      const map = L.map(mapContainer.current!, {
        center: [bounds.center.lat, bounds.center.lng],
        zoom: bounds.zoom,
        zoomControl: true,
        dragging: true,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
        minZoom: 1,
      }).addTo(map);

      // Add markers
      properties.forEach((property) => {
        const color = getMarkerColor(property.type);
        const marker = L.marker([property.lat, property.lng], {
          icon: createCustomMarker(color, L),
          title: property.name,
        }).addTo(map);

        const popupContent = `
          <div class="p-3 max-w-xs" style="min-width: 250px;">
            <img src="${property.imageUrl}" alt="${property.name}" style="width: 100%; height: 160px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
            <h3 style="font-weight: bold; font-size: 14px; margin: 0;">${property.name}</h3>
            <p style="font-size: 12px; color: #666; margin: 4px 0;">${property.location}</p>
            <div style="margin: 8px 0; font-size: 12px;">
              <div style="font-weight: bold;">$${property.price}M</div>
              <div style="color: #666;">${property.area} m²</div>
              <div style="color: #666; margin-top: 4px;">${property.description}</div>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, {
          maxWidth: 300,
          className: "property-popup",
        });

        marker.on("click", () => {
          onPropertySelect?.(property);
        });
      });

      mapInstance.current = map;

      // Invalidate size to ensure proper rendering
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    });

    return () => {
      // Cleanup is handled in the next render cycle
    };
  }, [properties, onPropertySelect]);

  return (
    <div className="flex flex-col gap-4">
      <div
        ref={mapContainer}
        className="w-full h-[400px] rounded-lg border border-gray-200 bg-gray-100"
        style={{ zIndex: 1 }}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => onPropertySelect?.(property)}
          />
        ))}
      </div>
    </div>
  );
}

function PropertyCard({
  property,
  onClick,
}: {
  property: RealEstateProperty;
  onClick: () => void;
}) {
  return (
    <div
      className="border border-gray-200 rounded-lg p-3 cursor-pointer hover:shadow-md transition-shadow bg-white"
      onClick={onClick}
    >
      <Image
        src={property.imageUrl}
        alt={property.name}
        className="w-full h-32 object-cover rounded mb-2"
        width={400}
        height={200}
      />
      <h3 className="font-bold text-sm line-clamp-2">{property.name}</h3>
      <p className="text-xs text-gray-600 mb-2">{property.location}</p>
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />
          <span className="font-bold">{property.price}M</span>
        </div>
        <div className="flex items-center gap-1">
          <Ruler className="w-3 h-3" />
          <span>{property.area} m²</span>
        </div>
        <div className="flex items-start gap-1">
          <MapPin className="w-3 h-3 mt-0.5 flex-shrink-0" />
          <span className="text-gray-600 line-clamp-1">
            {property.typeDisplay}
          </span>
        </div>
      </div>
    </div>
  );
}
