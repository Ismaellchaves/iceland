
import React, { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Skeleton } from "@/components/ui/skeleton";

// Fix Leaflet default icon issue with webpack/vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const MapComponent = ({ 
  reports = [],
  interactive = false,
  height = "400px", 
  onMapClick = () => {} 
}: { 
  reports?: any[],
  interactive?: boolean,
  height?: string,
  onMapClick?: (location: { lat: number, lng: number }) => void
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const mapInstanceExistsRef = useRef(false);
  
  // Crateús, Ceará coordinates
  const centerCoords = {
    lat: -5.1753,
    lng: -40.6669
  };

  // Helper function to check if map is valid
  const isMapValid = (map: L.Map | null): boolean => {
    return !!map && mapInstanceExistsRef.current && !!(map as any)._container;
  };

  // Initialize map
  useEffect(() => {
    // Guard clause for missing container ref
    if (!mapContainerRef.current) return;
    
    // Avoid creating multiple map instances
    if (mapRef.current) return;
    
    try {
      console.log("Initializing map...");
      
      // Create map instance
      const map = L.map(mapContainerRef.current, {
        center: [centerCoords.lat, centerCoords.lng],
        zoom: 13,
        zoomControl: true
      });
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
      
      // Create a layer group for markers
      const markersLayer = L.layerGroup().addTo(map);
      
      // Add click listener for interactive maps
      if (interactive) {
        map.on('click', (e: L.LeafletMouseEvent) => {
          onMapClick({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          });
        });
      }
      
      console.log("Map initialized successfully");
      mapRef.current = map;
      markerGroupRef.current = markersLayer;
      mapInstanceExistsRef.current = true;
      setMapReady(true);
      
      // Invalidate size after a short delay to handle container size issues
      setTimeout(() => {
        if (isMapValid(map)) {
          map.invalidateSize();
        }
      }, 300);
    } catch (error) {
      console.error("Error initializing map:", error);
      toast({
        title: "Erro ao carregar mapa",
        description: "Não foi possível inicializar o mapa. Tente novamente.",
        variant: "destructive"
      });
    }
    
    // Cleanup on unmount
    return () => {
      if (isMapValid(mapRef.current)) {
        console.log("Cleaning up map...");
        mapRef.current.remove();
        mapRef.current = null;
        markerGroupRef.current = null;
        mapInstanceExistsRef.current = false;
        setMapReady(false);
      }
    };
  }, []); // Empty dependency array to run once on mount

  // Add markers when map is ready and reports change
  useEffect(() => {
    const map = mapRef.current;
    const markerGroup = markerGroupRef.current;
    
    if (!isMapValid(map) || !markerGroup || !mapReady) return;
    
    console.log("Adding markers to map, reports:", reports.length);
    
    // Clear existing markers
    markerGroup.clearLayers();
    
    // Add new markers for each report
    reports.forEach(report => {
      // Determine position for the marker
      let position: L.LatLngExpression;
      
      if (report.latitude && report.longitude) {
        position = [report.latitude, report.longitude];
      } else {
        // For demo reports without real coordinates
        // Generate deterministic positions based on report id
        const id = parseInt(report.id) || 0;
        const offsetLng = (Math.sin(id * 0.7) * 0.01);
        const offsetLat = (Math.cos(id * 0.9) * 0.01);
        
        position = [
          centerCoords.lat + offsetLat,
          centerCoords.lng + offsetLng
        ];
      }
      
      // Set marker color based on status
      const pinColor = report.status === 'pendente' ? '#eab308' : 
                        report.status === 'analise' ? '#3b82f6' : 
                        report.status === 'finalizada' ? '#22c55e' : '#ef4444';
      
      // Create custom marker icon
      const markerHtmlStyles = `
        background-color: ${pinColor};
        width: 2rem;
        height: 2rem;
        display: block;
        left: -1rem;
        top: -1rem;
        position: relative;
        border-radius: 2rem 2rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF;
      `;

      const icon = L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [0, 24],
        popupAnchor: [0, -36],
        html: `<span style="${markerHtmlStyles}" />`
      });
      
      // Create marker
      const marker = L.marker(position, { icon }).addTo(markerGroup);
      
      // Add popup with report details
      const popupContent = `
        <div style="padding: 10px; max-width: 200px;">
          <div style="font-weight: bold; margin-bottom: 5px;">${report.title}</div>
          <div style="margin-bottom: 5px;">${report.category || ''}</div>
          ${report.imageUrl ? `<img src="${report.imageUrl}" alt="Report image" style="width: 100%; max-height: 120px; object-fit: cover; border-radius: 4px; margin-top: 8px;" />` : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent);
    });
    
    // Force map to redraw if it exists and isn't destroyed
    if (isMapValid(map)) {
      map.invalidateSize();
    }
    
  }, [reports, mapReady]);

  // Handle window resize to ensure map renders correctly
  useEffect(() => {
    const handleResize = () => {
      if (isMapValid(mapRef.current)) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="relative w-full" style={{ height }}>
      {!mapReady && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-urban-blue-50 dark:bg-urban-dark-800 rounded-lg">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-urban-blue-500 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-urban-dark-600 dark:text-urban-dark-300">Carregando mapa...</span>
        </div>
      )}
      
      <div 
        ref={mapContainerRef} 
        className="w-full h-full rounded-lg overflow-hidden"
        style={{ minHeight: height }}
      />
      
      {/* Legend for interactive maps */}
      {interactive && mapReady && (
        <div className="absolute left-2 bottom-2 bg-white dark:bg-urban-dark-900 rounded p-2 text-xs z-50">
          <div className="font-medium text-urban-dark-900 dark:text-white mb-1">Clique no mapa para selecionar a localização</div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
