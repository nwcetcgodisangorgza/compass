import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/lib/icons';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { divIcon } from 'leaflet';
import { useQuery } from '@tanstack/react-query';

// Fix for the marker icons in Leaflet with React
// This is needed because the default icons have relative paths that don't work with bundlers
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// South Africa's center coordinates (approximate)
const SouthAfricaCenter: [number, number] = [-30.5595, 22.9375];
const initialZoom = 6;

// Sample center data (we'd replace this with real data from the API)
const sampleCenters = [
  {
    id: 1,
    name: "North West Campus - Mafikeng",
    latitude: "-25.8539",
    longitude: "25.6447",
    type: "Main Campus"
  },
  {
    id: 2,
    name: "North West Campus - Mahikeng",
    latitude: "-25.8312",
    longitude: "25.5444",
    type: "Branch Campus"
  },
  {
    id: 3,
    name: "North West Training Center - Rustenburg",
    latitude: "-25.6546",
    longitude: "27.2400",
    type: "Training Center"
  },
];

export default function GISMapping() {
  const [mapInitialized, setMapInitialized] = useState(true);
  const [centers, setCenters] = useState(sampleCenters);

  // Fetch centers data - commented out for now, will be enabled when the API is ready
  /*
  const { data: centersData, isLoading } = useQuery({
    queryKey: ['/api/centers'],
    enabled: true,
  });

  useEffect(() => {
    if (centersData) {
      setCenters(centersData);
    }
  }, [centersData]);
  */

  const handleInitializeMap = () => {
    setMapInitialized(true);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-neutral-800 mb-1">GIS Mapping</h1>
        <p className="text-neutral-600">Geographic visualization of centers and resources</p>
      </div>

      <Card className="shadow-sm border-0">
        <CardHeader className="p-4 flex flex-row justify-between items-center space-y-0">
          <CardTitle className="text-base font-medium">Geographic Information System</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Icon name="filter_list" className="mr-1 h-4 w-4" />
              Filter Map
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8">
              <Icon name="get_app" className="mr-1 h-4 w-4" />
              Export Map
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative" style={{ height: "600px" }}>
            {mapInitialized ? (
              <MapContainer 
                center={SouthAfricaCenter} 
                zoom={initialZoom} 
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {centers.map(center => (
                  <Marker 
                    key={center.id}
                    position={[parseFloat(center.latitude), parseFloat(center.longitude)] as [number, number]}
                  >
                    <Popup>
                      <div>
                        <h3 className="font-medium">{center.name}</h3>
                        <p className="text-sm text-neutral-600">{center.type}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="absolute inset-0 p-4">
                <div className="w-full h-full bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100">
                  <div className="text-center">
                    <Icon name="map" className="text-primary h-16 w-16 mb-4" />
                    <h3 className="text-lg font-medium text-neutral-700 mb-2">Interactive GIS Map</h3>
                    <p className="text-neutral-500 max-w-md mb-6">
                      This module will provide an interactive geographic mapping system 
                      to visualize centers, resources, and educational coverage across the region.
                    </p>
                    <Button className="bg-primary" onClick={handleInitializeMap}>
                      <Icon name="map" className="mr-2 h-4 w-4" />
                      Initialize GIS Module
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
