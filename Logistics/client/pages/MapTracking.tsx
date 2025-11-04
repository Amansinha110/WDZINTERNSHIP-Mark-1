import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Truck, Package, Search, Zap } from 'lucide-react';

interface Shipment {
  id: string;
  trackingNumber: string;
  latitude: number;
  longitude: number;
  currentLocation: string;
  destination: string;
  destinationLat: number;
  destinationLon: number;
  status: 'pending' | 'in-transit' | 'delivered';
  driver: string;
  vehicle: string;
  progress: number;
}

const mockShipmentsWithCoords: Shipment[] = [
  {
    id: '1',
    trackingNumber: 'SHP-2024-001',
    latitude: 40.7128,
    longitude: -74.0060,
    currentLocation: 'New York',
    destination: 'Boston, MA',
    destinationLat: 42.3601,
    destinationLon: -71.0589,
    status: 'in-transit',
    driver: 'John Smith',
    vehicle: 'TR-001',
    progress: 65,
  },
  {
    id: '2',
    trackingNumber: 'SHP-2024-002',
    latitude: 39.9526,
    longitude: -75.1652,
    currentLocation: 'Philadelphia',
    destination: 'Washington, DC',
    destinationLat: 38.9072,
    destinationLon: -77.0369,
    status: 'in-transit',
    driver: 'Sarah Johnson',
    vehicle: 'TR-023',
    progress: 45,
  },
  {
    id: '3',
    trackingNumber: 'SHP-2024-003',
    latitude: 34.0522,
    longitude: -118.2437,
    currentLocation: 'Los Angeles',
    destination: 'San Francisco, CA',
    destinationLat: 37.7749,
    destinationLon: -122.4194,
    status: 'delivered',
    driver: 'Mike Davis',
    vehicle: 'TR-045',
    progress: 100,
  },
  {
    id: '4',
    trackingNumber: 'SHP-2024-004',
    latitude: 41.8781,
    longitude: -87.6298,
    currentLocation: 'Chicago',
    destination: 'Detroit, MI',
    destinationLat: 42.3314,
    destinationLon: -83.0458,
    status: 'in-transit',
    driver: 'Lisa Brown',
    vehicle: 'TR-089',
    progress: 75,
  },
  {
    id: '5',
    trackingNumber: 'SHP-2024-005',
    latitude: 29.7604,
    longitude: -95.3698,
    currentLocation: 'Houston',
    destination: 'Dallas, TX',
    destinationLat: 32.7767,
    destinationLon: -96.7970,
    status: 'pending',
    driver: 'Unassigned',
    vehicle: 'Unassigned',
    progress: 0,
  },
];

export default function MapTracking() {
  const [shipments] = useState<Shipment[]>(mockShipmentsWithCoords);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch =
      shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.currentLocation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || shipment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return '';
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const getMarkerPosition = (lat: number, lon: number) => {
    // Normalize to map visualization area (0-100%)
    const mapX = ((lon + 130) / 60) * 100;
    const mapY = ((50 - lat) / 40) * 100;
    return { x: mapX, y: mapY };
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <MapPin className="w-6 h-6 text-blue-600" />
              Interactive Map Tracking
            </h1>
            <div className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">Live</span>
            </div>
          </div>
          <p className="text-muted-foreground">Real-time shipment tracking with interactive map visualization</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-3">
            <Card className="elevated-panel p-6">
              {/* Interactive Map Visualization */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-lg p-4 relative overflow-hidden" style={{ height: '500px' }}>
                {/* Grid Background */}
                <svg className="absolute inset-0 w-full h-full opacity-10" width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>

                {/* Map Title */}
                <div className="relative z-10 mb-4">
                  <p className="text-center text-sm text-muted-foreground font-semibold">
                    🗺️ USA Shipment Distribution Map
                  </p>
                </div>

                {/* Shipment Markers */}
                <div className="relative w-full h-80 pointer-events-auto">
                  {filteredShipments.map(shipment => {
                    const pos = getMarkerPosition(shipment.latitude, shipment.longitude);
                    const statusColors: Record<string, string> = {
                      'pending': 'bg-yellow-500 border-yellow-600',
                      'in-transit': 'bg-blue-500 border-blue-600',
                      'delivered': 'bg-green-500 border-green-600',
                    };

                    return (
                      <div key={shipment.id}>
                        {/* Route Line */}
                        <svg
                          className="absolute inset-0 w-full h-full"
                          style={{ pointerEvents: 'none', zIndex: 0 }}
                        >
                          {(() => {
                            const startPos = getMarkerPosition(shipment.latitude, shipment.longitude);
                            const endPos = getMarkerPosition(shipment.destinationLat, shipment.destinationLon);
                            const x1 = (startPos.x / 100) * window.innerWidth * 0.6;
                            const y1 = (startPos.y / 100) * 320;
                            const x2 = (endPos.x / 100) * window.innerWidth * 0.6;
                            const y2 = (endPos.y / 100) * 320;
                            const strokeColor = shipment.status === 'delivered' ? '#22C55E' : shipment.status === 'in-transit' ? '#0084FF' : '#EAB308';
                            const dashArray = shipment.status === 'pending' ? '5,5' : 'none';
                            return (
                              <line
                                x1={x1}
                                y1={y1}
                                x2={x2}
                                y2={y2}
                                stroke={strokeColor}
                                strokeWidth="2"
                                opacity="0.6"
                                strokeDasharray={dashArray}
                              />
                            );
                          })()}
                        </svg>

                        {/* Current Location Marker */}
                        <button
                          onClick={() => setSelectedShipment(shipment)}
                          className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-20 transition-all hover:scale-125"
                          style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white ${
                              statusColors[shipment.status] || 'bg-gray-500'
                            }`}
                          >
                            <Truck className="w-5 h-5" />
                          </div>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-foreground text-background px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                            {shipment.trackingNumber}
                            <div className="text-background/80">{shipment.currentLocation}</div>
                          </div>
                        </button>

                        {/* Destination Marker */}
                        {(() => {
                          const destPos = getMarkerPosition(shipment.destinationLat, shipment.destinationLon);
                          return (
                            <div
                              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                              style={{ left: `${destPos.x}%`, top: `${destPos.y}%` }}
                            >
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg border-2 border-white bg-orange-500">
                                📍
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="relative z-10 mt-4 flex justify-center gap-6 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 border border-yellow-600"></div>
                    <span className="text-muted-foreground">Pending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600"></div>
                    <span className="text-muted-foreground">In Transit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"></div>
                    <span className="text-muted-foreground">Delivered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                    <span className="text-muted-foreground">Destination</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search & Filter */}
            <Card className="elevated-panel p-4">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tracking..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 text-sm"
                  />
                </div>
                <select
                  value={filterStatus || ''}
                  onChange={(e) => setFilterStatus(e.target.value || null)}
                  className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </Card>

            {/* Shipments List */}
            <Card className="elevated-panel p-4">
              <h3 className="font-semibold text-foreground mb-4 text-sm">Shipments ({filteredShipments.length})</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredShipments.map(shipment => (
                  <button
                    key={shipment.id}
                    onClick={() => setSelectedShipment(shipment)}
                    className={`w-full p-3 rounded-lg border text-left transition-all ${
                      selectedShipment?.id === shipment.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-border hover:border-blue-400 hover:bg-accent/5'
                    }`}
                  >
                    <p className="font-mono text-xs font-semibold text-foreground">{shipment.trackingNumber}</p>
                    <p className="text-xs text-muted-foreground mt-1">{shipment.currentLocation}</p>
                    <div className="mt-2 w-full bg-border rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                    <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shipment.status)}`}>
                      {shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}
                    </span>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Details Panel */}
        {selectedShipment && (
          <Card className="elevated-panel p-6 mt-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedShipment.trackingNumber}</h3>
                <p className="text-sm text-muted-foreground">Shipment Details</p>
              </div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedShipment.status)}`}>
                {selectedShipment.status.charAt(0).toUpperCase() + selectedShipment.status.slice(1)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-2">Current Location</p>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  {selectedShipment.currentLocation}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Destination</p>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4 text-orange-600" />
                  {selectedShipment.destination}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Distance Remaining</p>
                <p className="font-semibold text-foreground">
                  {calculateDistance(selectedShipment.latitude, selectedShipment.longitude, selectedShipment.destinationLat, selectedShipment.destinationLon)} miles
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-border rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all"
                      style={{ width: `${selectedShipment.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground">{selectedShipment.progress}%</span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Driver</p>
                <p className="font-semibold text-foreground">{selectedShipment.driver}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Vehicle</p>
                <p className="font-semibold text-foreground flex items-center gap-2">
                  <Truck className="w-4 h-4" />
                  {selectedShipment.vehicle}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Coordinates</p>
                <p className="font-mono text-xs text-foreground">{selectedShipment.latitude.toFixed(4)}, {selectedShipment.longitude.toFixed(4)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Destination Coords</p>
                <p className="font-mono text-xs text-foreground">{selectedShipment.destinationLat.toFixed(4)}, {selectedShipment.destinationLon.toFixed(4)}</p>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
