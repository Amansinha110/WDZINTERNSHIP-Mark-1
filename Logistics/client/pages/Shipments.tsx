import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Package,
  Search,
  Plus,
  MapPin,
  Calendar,
  Truck,
  TrendingUp,
  Filter,
  Activity,
  AlertCircle,
} from "lucide-react";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Shipment {
  id: string;
  trackingNumber: string;
  origin: string;
  destination: string;
  status: "pending" | "in-transit" | "delivered" | "cancelled";
  createdDate: string;
  estimatedDelivery: string;
  assignedVehicle: string;
  weight: number;
  items: number;
  progress: number;
}

const mockShipments: Shipment[] = [
  {
    id: "1",
    trackingNumber: "SHP-2024-001",
    origin: "New York Warehouse",
    destination: "Boston, MA",
    status: "in-transit",
    createdDate: "2024-01-15",
    estimatedDelivery: "2024-01-18",
    assignedVehicle: "TR-001",
    weight: 150.5,
    items: 24,
    progress: 65,
  },
  {
    id: "2",
    trackingNumber: "SHP-2024-002",
    origin: "New York Warehouse",
    destination: "Philadelphia, PA",
    status: "pending",
    createdDate: "2024-01-16",
    estimatedDelivery: "2024-01-20",
    assignedVehicle: "Unassigned",
    weight: 200.0,
    items: 35,
    progress: 0,
  },
  {
    id: "3",
    trackingNumber: "SHP-2024-003",
    origin: "Los Angeles Warehouse",
    destination: "San Francisco, CA",
    status: "delivered",
    createdDate: "2024-01-10",
    estimatedDelivery: "2024-01-16",
    assignedVehicle: "TR-045",
    weight: 120.0,
    items: 18,
    progress: 100,
  },
  {
    id: "4",
    trackingNumber: "SHP-2024-004",
    origin: "Chicago Warehouse",
    destination: "Detroit, MI",
    status: "in-transit",
    createdDate: "2024-01-14",
    estimatedDelivery: "2024-01-19",
    assignedVehicle: "TR-023",
    weight: 180.0,
    items: 28,
    progress: 45,
  },
];

const STATUSES = [
  {
    value: "pending",
    label: "Pending",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  },
  {
    value: "in-transit",
    label: "In Transit",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    value: "delivered",
    label: "Delivered",
    color:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  },
];

export default function Shipments() {
  const [shipments, setShipments] = useState<Shipment[]>(mockShipments);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(
    null,
  );
  const [newShipment, setNewShipment] = useState({
    origin: "",
    destination: "",
    weight: "",
    items: "",
  });

  // Real-time updates
  const trackingNumbers = useMemo(() => mockShipments.map((s) => s.trackingNumber), []);
  const { updates, shipmentStatuses } = useRealtimeUpdates(trackingNumbers);
  const recentUpdates = useMemo(() => updates.slice(0, 3), [updates]);

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.trackingNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      shipment.destination.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !filterStatus || shipment.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const statusObj = STATUSES.find((s) => s.value === status);
    return statusObj?.color || "";
  };

  const handleCreateShipment = () => {
    if (
      newShipment.origin &&
      newShipment.destination &&
      newShipment.weight &&
      newShipment.items
    ) {
      const shipment: Shipment = {
        id: String(shipments.length + 1),
        trackingNumber: `SHP-2024-${String(shipments.length + 1).padStart(3, "0")}`,
        origin: newShipment.origin,
        destination: newShipment.destination,
        status: "pending",
        createdDate: new Date().toISOString().split("T")[0],
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        assignedVehicle: "Unassigned",
        weight: parseFloat(newShipment.weight),
        items: parseInt(newShipment.items),
        progress: 0,
      };
      setShipments([...shipments, shipment]);
      setNewShipment({ origin: "", destination: "", weight: "", items: "" });
    }
  };

  const updateShipmentStatus = (id: string, newStatus: string) => {
    setShipments(
      shipments.map((s) =>
        s.id === id
          ? {
              ...s,
              status: newStatus as any,
              progress: newStatus === "delivered" ? 100 : s.progress,
            }
          : s,
      ),
    );
    if (selectedShipment?.id === id) {
      setSelectedShipment({ ...selectedShipment, status: newStatus as any });
    }
  };

  const StatCard = ({ icon: Icon, title, value }: any) => (
    <Card className="elevated-panel p-6 card-3d card-lift hover-glow group stagger-item">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-bounce-in" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground group-hover:gradient-text transition-all duration-300 animate-bounce-in">{value}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur glass-effect">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between animate-fade-in-down">
          <h1 className="text-2xl font-bold text-foreground gradient-text">
            Shipment Tracking
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Plus className="w-4 h-4 animate-bounce-in" />
                New Shipment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Shipment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Origin Warehouse</Label>
                  <Input
                    placeholder="e.g., New York Warehouse"
                    value={newShipment.origin}
                    onChange={(e) =>
                      setNewShipment({ ...newShipment, origin: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label>Destination</Label>
                  <Input
                    placeholder="e.g., Boston, MA"
                    value={newShipment.destination}
                    onChange={(e) =>
                      setNewShipment({
                        ...newShipment,
                        destination: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Weight (lbs)</Label>
                    <Input
                      type="number"
                      placeholder="150.5"
                      value={newShipment.weight}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          weight: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Items</Label>
                    <Input
                      type="number"
                      placeholder="24"
                      value={newShipment.items}
                      onChange={(e) =>
                        setNewShipment({
                          ...newShipment,
                          items: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={handleCreateShipment}
                  className="w-full bg-blue-500 hover:bg-blue-600"
                >
                  Create Shipment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-slide-in-left">
          <StatCard
            icon={Package}
            title="Total Shipments"
            value={shipments.length}
          />
          <StatCard
            icon={Truck}
            title="In Transit"
            value={shipments.filter((s) => s.status === "in-transit").length}
          />
          <StatCard
            icon={TrendingUp}
            title="Delivered"
            value={shipments.filter((s) => s.status === "delivered").length}
          />
        </div>

        {/* Live Updates Alert */}
        {recentUpdates.length > 0 && (
          <Card className="elevated-panel p-6 mb-6 border-l-4 border-l-blue-500 bg-blue-50/30 dark:bg-blue-950/10 card-lift hover-glow animate-slide-in-left stagger-item">
            <div className="flex items-start gap-4">
              <div className="mt-1">
                <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-smooth-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 gradient-text">
                  <span>Live Updates</span>
                  <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded-full animate-pulse-wave">
                    {updates.length}
                  </span>
                </h3>
                <div className="space-y-2">
                  {recentUpdates.map((update, index) => (
                    <div
                      key={update.id}
                      className="text-sm text-foreground stagger-item"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <p className="font-medium">
                        {update.title} - {update.shipmentId}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {update.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="elevated-panel p-6 mb-6 card-lift hover-glow animate-slide-in-right stagger-item" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground animate-bounce-in" />
              <Input
                placeholder="Search by tracking number or destination..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 focus-glow transition-all duration-300"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus(null)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift ${
                  !filterStatus
                    ? "bg-blue-500 text-white shadow-lg animate-bounce-in"
                    : "bg-accent/10 text-foreground hover:bg-accent/20"
                }`}
              >
                All
              </button>
              {STATUSES.map((status, index) => (
                <button
                  key={status.value}
                  onClick={() => setFilterStatus(status.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift stagger-item ${
                    filterStatus === status.value
                      ? "bg-blue-500 text-white shadow-lg"
                      : "bg-accent/10 text-foreground hover:bg-accent/20"
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {status.label}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Shipments List */}
        <div className="space-y-4">
          {filteredShipments.length > 0 ? (
            filteredShipments.map((shipment, index) => (
              <Card
                key={shipment.id}
                className="elevated-panel p-6 cursor-pointer hover:shadow-lg transition-all card-lift hover-glow group stagger-item"
                onClick={() => setSelectedShipment(shipment)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Tracking Number */}
                  <div className="group-hover:translate-x-1 transition-transform duration-300">
                    <p className="text-xs text-muted-foreground mb-1">
                      Tracking
                    </p>
                    <p className="font-mono font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {shipment.trackingNumber}
                    </p>
                  </div>

                  {/* Route */}
                  <div className="group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: '0.05s' }}>
                    <p className="text-xs text-muted-foreground mb-1">Route</p>
                    <p className="text-sm text-foreground font-medium group-hover:font-semibold transition-all">
                      {shipment.destination}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {shipment.weight} lbs
                    </p>
                  </div>

                  {/* Status */}
                  <div className="group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: '0.1s' }}>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusColor(shipment.status)}`}
                    >
                      {shipment.status.charAt(0).toUpperCase() +
                        shipment.status.slice(1).replace("-", " ")}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: '0.15s' }}>
                    <p className="text-xs text-muted-foreground mb-2">
                      Progress
                    </p>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden shadow-inner">
                      <div
                        className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500 animate-fill-progress animate-gradient-shift"
                        style={{ width: `${shipment.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
                      {shipment.progress}%
                    </p>
                  </div>

                  {/* ETA */}
                  <div className="text-right group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: '0.2s' }}>
                    <p className="text-xs text-muted-foreground mb-1">ETA</p>
                    <p className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {shipment.estimatedDelivery}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {shipment.assignedVehicle}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="elevated-panel p-12 text-center animate-fade-in-up card-lift">
              <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50 animate-smooth-pulse" />
              <p className="text-muted-foreground font-medium">No shipments found</p>
              <p className="text-xs text-muted-foreground mt-2">Try adjusting your filters or search terms</p>
            </Card>
          )}
        </div>

        {/* Shipment Details Modal */}
        {selectedShipment && (
          <div
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4 animate-fade-in-up"
            onClick={() => setSelectedShipment(null)}
          >
            <Card
              className="elevated-panel w-full max-w-2xl p-8 card-lift animate-bounce-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-1 gradient-text animate-fade-in-up">
                    {selectedShipment.trackingNumber}
                  </h3>
                  <p className="text-muted-foreground animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    {selectedShipment.destination}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedShipment(null)}
                  className="p-2 hover:bg-accent/10 rounded-lg hover-rotate transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                {[
                  { label: 'Origin', value: selectedShipment.origin },
                  { label: 'Destination', value: selectedShipment.destination },
                  { label: 'Weight', value: `${selectedShipment.weight} lbs` },
                  { label: 'Items', value: selectedShipment.items },
                ].map((item, index) => (
                  <div key={index} className="stagger-item" style={{ animationDelay: `${index * 0.1}s` }}>
                    <p className="text-xs text-muted-foreground mb-2">{item.label}</p>
                    <p className="font-medium text-foreground group-hover:text-blue-600 transition-colors">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Status Update */}
              <div className="mb-6">
                <p className="text-xs text-muted-foreground mb-3 gradient-text">
                  Update Status
                </p>
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map((status, index) => (
                    <button
                      key={status.value}
                      onClick={() =>
                        updateShipmentStatus(selectedShipment.id, status.value)
                      }
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 hover-lift stagger-item ${
                        selectedShipment.status === status.value
                          ? "bg-blue-500 text-white shadow-lg animate-bounce-in"
                          : "bg-accent/10 text-foreground hover:bg-accent/20"
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={() => setSelectedShipment(null)}
                className="w-full bg-blue-500 hover:bg-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up"
              >
                Close
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
