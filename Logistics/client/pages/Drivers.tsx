import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Truck,
  User,
  Plus,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  assignedVehicle: string;
  status: "available" | "on-duty" | "off-duty";
  totalDeliveries: number;
  rating: number;
}

interface Vehicle {
  id: string;
  registrationNumber: string;
  model: string;
  capacity: number;
  assignedDriver: string;
  status: "available" | "in-use" | "maintenance";
  lastMaintenance: string;
  mileage: number;
}

const mockDrivers: Driver[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@logistics.com",
    phone: "+1 (555) 123-4567",
    licenseNumber: "DL123456",
    assignedVehicle: "TR-001",
    status: "on-duty",
    totalDeliveries: 245,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.johnson@logistics.com",
    phone: "+1 (555) 234-5678",
    licenseNumber: "DL234567",
    assignedVehicle: "TR-023",
    status: "available",
    totalDeliveries: 189,
    rating: 4.9,
  },
  {
    id: "3",
    name: "Mike Davis",
    email: "mike.davis@logistics.com",
    phone: "+1 (555) 345-6789",
    licenseNumber: "DL345678",
    assignedVehicle: "Unassigned",
    status: "off-duty",
    totalDeliveries: 178,
    rating: 4.7,
  },
];

const mockVehicles: Vehicle[] = [
  {
    id: "1",
    registrationNumber: "TR-001",
    model: "Volvo FH16",
    capacity: 25000,
    assignedDriver: "John Smith",
    status: "in-use",
    lastMaintenance: "2024-01-10",
    mileage: 125450,
  },
  {
    id: "2",
    registrationNumber: "TR-023",
    model: "Mercedes Actros",
    capacity: 28000,
    assignedDriver: "Sarah Johnson",
    status: "in-use",
    lastMaintenance: "2024-01-05",
    mileage: 98765,
  },
  {
    id: "3",
    registrationNumber: "TR-045",
    model: "Scania R450",
    capacity: 25000,
    assignedDriver: "Unassigned",
    status: "available",
    lastMaintenance: "2024-01-15",
    mileage: 76543,
  },
];

export default function Drivers() {
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles);
  const [activeTab, setActiveTab] = useState<"drivers" | "vehicles">("drivers");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  const [newDriver, setNewDriver] = useState({
    name: "",
    email: "",
    phone: "",
    licenseNumber: "",
  });

  const [newVehicle, setNewVehicle] = useState({
    registrationNumber: "",
    model: "",
    capacity: "",
  });

  const [assignment, setAssignment] = useState({
    driverId: "",
    vehicleId: "",
  });

  const handleCreateDriver = () => {
    if (
      newDriver.name &&
      newDriver.email &&
      newDriver.phone &&
      newDriver.licenseNumber
    ) {
      const driver: Driver = {
        id: String(drivers.length + 1),
        ...newDriver,
        assignedVehicle: "Unassigned",
        status: "available",
        totalDeliveries: 0,
        rating: 0,
      };
      setDrivers([...drivers, driver]);
      setNewDriver({ name: "", email: "", phone: "", licenseNumber: "" });
    }
  };

  const handleCreateVehicle = () => {
    if (
      newVehicle.registrationNumber &&
      newVehicle.model &&
      newVehicle.capacity
    ) {
      const vehicle: Vehicle = {
        id: String(vehicles.length + 1),
        registrationNumber: newVehicle.registrationNumber,
        model: newVehicle.model,
        capacity: parseInt(newVehicle.capacity),
        assignedDriver: "Unassigned",
        status: "available",
        lastMaintenance: new Date().toISOString().split("T")[0],
        mileage: 0,
      };
      setVehicles([...vehicles, vehicle]);
      setNewVehicle({ registrationNumber: "", model: "", capacity: "" });
    }
  };

  const handleAssignVehicleToDriver = () => {
    if (assignment.driverId && assignment.vehicleId) {
      const driver = drivers.find((d) => d.id === assignment.driverId);
      const vehicle = vehicles.find((v) => v.id === assignment.vehicleId);

      if (driver && vehicle) {
        setDrivers(
          drivers.map((d) =>
            d.id === assignment.driverId
              ? { ...d, assignedVehicle: vehicle.registrationNumber }
              : d,
          ),
        );
        setVehicles(
          vehicles.map((v) =>
            v.id === assignment.vehicleId
              ? { ...v, assignedDriver: driver.name }
              : v,
          ),
        );
        setAssignment({ driverId: "", vehicleId: "" });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
      case "on-duty":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "off-duty":
      case "in-use":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtext }: any) => (
    <Card className="elevated-panel p-6 card-3d">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
          {subtext && (
            <p className="text-xs text-muted-foreground">{subtext}</p>
          )}
        </div>
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">
            Driver & Vehicle Management
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                <Plus className="w-4 h-4" />
                {activeTab === "drivers" ? "Add Driver" : "Add Vehicle"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {activeTab === "drivers"
                    ? "Add New Driver"
                    : "Add New Vehicle"}
                </DialogTitle>
              </DialogHeader>
              {activeTab === "drivers" ? (
                <div className="space-y-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      placeholder="John Smith"
                      value={newDriver.name}
                      onChange={(e) =>
                        setNewDriver({ ...newDriver, name: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="john@logistics.com"
                      value={newDriver.email}
                      onChange={(e) =>
                        setNewDriver({ ...newDriver, email: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      placeholder="+1 (555) 123-4567"
                      value={newDriver.phone}
                      onChange={(e) =>
                        setNewDriver({ ...newDriver, phone: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>License Number</Label>
                    <Input
                      placeholder="DL123456"
                      value={newDriver.licenseNumber}
                      onChange={(e) =>
                        setNewDriver({
                          ...newDriver,
                          licenseNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleCreateDriver}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Add Driver
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Registration Number</Label>
                    <Input
                      placeholder="TR-001"
                      value={newVehicle.registrationNumber}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          registrationNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Model</Label>
                    <Input
                      placeholder="Volvo FH16"
                      value={newVehicle.model}
                      onChange={(e) =>
                        setNewVehicle({ ...newVehicle, model: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Capacity (lbs)</Label>
                    <Input
                      type="number"
                      placeholder="25000"
                      value={newVehicle.capacity}
                      onChange={(e) =>
                        setNewVehicle({
                          ...newVehicle,
                          capacity: e.target.value,
                        })
                      }
                    />
                  </div>
                  <Button
                    onClick={handleCreateVehicle}
                    className="w-full bg-blue-500 hover:bg-blue-600"
                  >
                    Add Vehicle
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={User}
            title="Total Drivers"
            value={drivers.length}
            subtext={
              drivers.filter((d) => d.status === "available").length +
              " available"
            }
          />
          <StatCard
            icon={Truck}
            title="Total Vehicles"
            value={vehicles.length}
            subtext={
              vehicles.filter((v) => v.status === "available").length +
              " available"
            }
          />
          <StatCard
            icon={MapPin}
            title="Active Routes"
            value={drivers.filter((d) => d.status === "on-duty").length}
            subtext="Currently in transit"
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("drivers")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "drivers"
                ? "bg-blue-500 text-white"
                : "bg-accent/10 text-foreground hover:bg-accent/20"
            }`}
          >
            <User className="inline-block w-4 h-4 mr-2" />
            Drivers
          </button>
          <button
            onClick={() => setActiveTab("vehicles")}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === "vehicles"
                ? "bg-blue-500 text-white"
                : "bg-accent/10 text-foreground hover:bg-accent/20"
            }`}
          >
            <Truck className="inline-block w-4 h-4 mr-2" />
            Vehicles
          </button>
        </div>

        {/* Assignment Card */}
        <Card className="elevated-panel p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Assign Vehicle to Driver
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Select Driver</Label>
              <select
                value={assignment.driverId}
                onChange={(e) =>
                  setAssignment({ ...assignment, driverId: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a driver...</option>
                {drivers.map((driver) => (
                  <option key={driver.id} value={driver.id}>
                    {driver.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Select Vehicle</Label>
              <select
                value={assignment.vehicleId}
                onChange={(e) =>
                  setAssignment({ ...assignment, vehicleId: e.target.value })
                }
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Choose a vehicle...</option>
                {vehicles
                  .filter((v) => v.status === "available")
                  .map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registrationNumber} - {vehicle.model}
                    </option>
                  ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={handleAssignVehicleToDriver}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                Assign
              </Button>
            </div>
          </div>
        </Card>

        {/* Content */}
        {activeTab === "drivers" ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-600 dark:text-blue-400">
                {
                  drivers.filter((d) => d.assignedVehicle === "Unassigned")
                    .length
                }{" "}
                drivers are waiting for vehicle assignments
              </p>
            </div>

            {drivers.map((driver) => (
              <Card
                key={driver.id}
                className="elevated-panel p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedDriver(driver)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Name</p>
                    <p className="font-semibold text-foreground">
                      {driver.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      License
                    </p>
                    <p className="font-mono text-sm text-foreground">
                      {driver.licenseNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Vehicle
                    </p>
                    <p className="font-medium text-foreground">
                      {driver.assignedVehicle}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}
                    >
                      {driver.status.charAt(0).toUpperCase() +
                        driver.status.slice(1).replace("-", " ")}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Rating</p>
                    <p className="font-semibold text-foreground">
                      ⭐ {driver.rating}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {driver.totalDeliveries} deliveries
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <Card
                key={vehicle.id}
                className="elevated-panel p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setSelectedVehicle(vehicle)}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Registration
                    </p>
                    <p className="font-mono font-semibold text-foreground">
                      {vehicle.registrationNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Model</p>
                    <p className="font-medium text-foreground">
                      {vehicle.model}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Driver</p>
                    <p className="text-sm text-foreground">
                      {vehicle.assignedDriver}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}
                    >
                      {vehicle.status.charAt(0).toUpperCase() +
                        vehicle.status.slice(1).replace("-", " ")}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">
                      Mileage
                    </p>
                    <p className="font-semibold text-foreground">
                      {vehicle.mileage.toLocaleString()} mi
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
