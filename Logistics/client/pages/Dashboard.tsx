import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Package,
  Truck,
  MapPin,
  Clock,
  LogOut,
  Menu,
  X,
  TrendingUp,
  AlertCircle,
  Activity,
  BarChart3,
} from "lucide-react";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

interface DashboardMetrics {
  activeShipments: number;
  completedDeliveries: number;
  pendingShipments: number;
  warehouseUtilization: number;
}

const shipmentData = [
  { name: "Mon", shipments: 24, deliveries: 20 },
  { name: "Tue", shipments: 28, deliveries: 25 },
  { name: "Wed", shipments: 22, deliveries: 18 },
  { name: "Thu", shipments: 30, deliveries: 28 },
  { name: "Fri", shipments: 35, deliveries: 32 },
  { name: "Sat", shipments: 20, deliveries: 18 },
  { name: "Sun", shipments: 15, deliveries: 12 },
];

const warehouseData = [
  { name: "Electronics", value: 35, color: "#1084FF" },
  { name: "Textiles", value: 25, color: "#00D9FF" },
  { name: "Furniture", value: 20, color: "#FFB800" },
  { name: "Food", value: 20, color: "#FF6B6B" },
];

const recentShipments = [
  {
    id: "SHP001",
    destination: "New York",
    status: "in-transit",
    eta: "2h 30m",
  },
  {
    id: "SHP002",
    destination: "Los Angeles",
    status: "delivered",
    eta: "Completed",
  },
  { id: "SHP003", destination: "Chicago", status: "pending", eta: "12h 45m" },
  { id: "SHP004", destination: "Houston", status: "in-transit", eta: "5h 20m" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    activeShipments: 24,
    completedDeliveries: 156,
    pendingShipments: 18,
    warehouseUtilization: 78,
  });
  const [userRole, setUserRole] = useState("admin");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Real-time updates
  const trackingNumbers = useMemo(() => ["SHP-2024-001", "SHP-2024-002", "SHP-2024-003", "SHP-2024-004"], []);
  const { updates, shipmentStatuses } = useRealtimeUpdates(trackingNumbers);
  const recentUpdates = useMemo(() => updates.slice(0, 3), [updates]);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (!auth) {
      navigate("/login");
    } else {
      const authData = JSON.parse(auth);
      setUserRole(authData.role);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("auth");
    navigate("/login");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-transit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "delivered":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const MetricCard = ({ icon: Icon, title, value, subtext, color }: any) => (
    <Card className="elevated-panel p-6 card-3d card-lift hover-glow group stagger-item">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-foreground mb-2 group-hover:gradient-text transition-all duration-300 animate-bounce-in">
            {value}
          </h3>
          {subtext && (
            <p className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">{subtext}</p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color} transition-all duration-300 transform group-hover:scale-110 group-hover:rotate-12`}>
          <Icon className="w-6 h-6 animate-bounce-in" />
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur glass-effect supports-[backdrop-filter]:bg-card/60">
        <div className="flex items-center justify-between px-6 py-4 animate-fade-in-down">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-accent/10 rounded-lg transition-all duration-300 hover-scale lg:hidden"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5 animate-spin-360" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <h1 className="text-2xl font-bold text-foreground gradient-text">LogiTrack</h1>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 hover-lift transition-all duration-300"
          >
            <LogOut className="w-4 h-4 group-hover:animate-wave" />
            Logout
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static w-64 h-[calc(100vh-73px)] bg-sidebar border-r border-sidebar-border
            transform transition-transform duration-300 ease-in-out z-30
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            overflow-y-auto
          `}
        >
          <nav className="p-4 space-y-2">
            <NavItem
              icon={Package}
              label="Shipments"
              href="/shipments"
              active
            />
            <NavItem icon={Clock} label="Live Tracking" href="/live-tracking" />
            <NavItem icon={MapPin} label="Map Tracking" href="/map-tracking" />
            <NavItem icon={Truck} label="Driver Assignment" href="/drivers" />
            <NavItem icon={MapPin} label="Warehouse" href="/warehouse" />
            <NavItem icon={TrendingUp} label="Analytics" href="/analytics" />
            <NavItem icon={BarChart3} label="Advanced Reports" href="/advanced-reports" />
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in-up">
            <h2 className="text-3xl font-bold text-foreground mb-2 gradient-text">
              Welcome back, {userRole}!
            </h2>
            <p className="text-muted-foreground">
              Here's what's happening with your logistics operations today.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              icon={Package}
              title="Active Shipments"
              value={metrics.activeShipments}
              subtext="In transit"
              color="bg-blue-100 dark:bg-blue-900/30"
            />
            <MetricCard
              icon={Truck}
              title="Completed Deliveries"
              value={metrics.completedDeliveries}
              subtext="This month"
              color="bg-green-100 dark:bg-green-900/30"
            />
            <MetricCard
              icon={Clock}
              title="Pending Shipments"
              value={metrics.pendingShipments}
              subtext="Awaiting dispatch"
              color="bg-yellow-100 dark:bg-yellow-900/30"
            />
            <MetricCard
              icon={MapPin}
              title="Warehouse Utilization"
              value={`${metrics.warehouseUtilization}%`}
              subtext="Capacity used"
              color="bg-orange-100 dark:bg-orange-900/30"
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Shipment Trends */}
            <Card className="elevated-panel p-6 lg:col-span-2 card-lift hover-glow animate-slide-in-left stagger-item">
              <h3 className="text-lg font-semibold text-foreground mb-6 gradient-text animate-fade-in-up">
                Shipment Trends
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={shipmentData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="shipments"
                    stroke="#1084FF"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="deliveries"
                    stroke="#00D9FF"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Warehouse Distribution */}
            <Card className="elevated-panel p-6 card-lift hover-glow animate-slide-in-right stagger-item" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-lg font-semibold text-foreground mb-6 gradient-text animate-fade-in-up">
                Warehouse Inventory
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={warehouseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name} ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {warehouseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Live Updates Feed */}
          <Card className="elevated-panel p-6 card-lift hover-glow animate-slide-up stagger-item" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 gradient-text">
                <Activity className="w-5 h-5 text-cyan-600 dark:text-cyan-400 animate-smooth-pulse" />
                Live Updates
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/live-tracking")}
                className="text-sm hover-lift transition-all duration-300"
              >
                View All →
              </Button>
            </div>
            <div className="space-y-3">
              {recentUpdates.length > 0 ? (
                recentUpdates.map((update, index) => (
                  <div
                    key={update.id}
                    className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-all timeline-item hover-lift group"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <div className="mt-1 p-2 rounded-full transition-all group-hover:scale-110" style={{
                        backgroundColor: update.type === 'alert' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                      }}>
                        {update.type === "alert" ? (
                          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 animate-attention" />
                        ) : (
                          <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-smooth-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {update.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 group-hover:text-foreground/80 transition-colors">
                          {update.message}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-1 bg-accent/30 rounded-full text-muted-foreground font-medium hover:bg-accent/50 transition-all cursor-default">
                            {update.shipmentId}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(update.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 animate-fade-in-up">
                  <Activity className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3 animate-smooth-pulse" />
                  <p className="text-muted-foreground text-sm font-medium">
                    No updates yet. Updates will appear here in real-time.
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Recent Shipments Table */}
          <Card className="elevated-panel p-6 card-lift hover-glow animate-slide-up stagger-item" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-lg font-semibold text-foreground mb-6 gradient-text animate-fade-in-up">
              Recent Shipments
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      ID
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Destination
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      ETA
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-sm text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentShipments.map((shipment, index) => (
                    <tr
                      key={shipment.id}
                      className="border-b border-border hover:bg-accent/10 transition-all duration-300 stagger-item group"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <td className="py-3 px-4 font-mono text-sm text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {shipment.id}
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground group-hover:font-semibold transition-all">
                        {shipment.destination}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${getStatusColor(shipment.status)}`}
                        >
                          {shipment.status.charAt(0).toUpperCase() +
                            shipment.status.slice(1).replace("-", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-foreground">
                        {shipment.eta}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs hover-lift transition-all duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400"
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </main>
      </div>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function NavItem({ icon: Icon, label, href, active }: any) {
  const isActive = window.location.pathname === href;
  return (
    <a
      href={href}
      className={`
        flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 hover-lift group
        ${
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg animate-bounce-in"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        }
      `}
    >
      <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'animate-bounce-in' : 'group-hover:scale-110 group-hover:rotate-12'}`} />
      <span className="text-sm font-medium">{label}</span>
    </a>
  );
}
