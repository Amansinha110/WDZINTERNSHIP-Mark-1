import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, PieChart as PieChartIcon, Download, RefreshCw, Filter, Calendar } from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ScatterChart,
  Scatter,
} from "recharts";

const analyticsData = [
  { month: "Jan", shipments: 450, deliveries: 420, revenue: 125000, efficiency: 93 },
  { month: "Feb", shipments: 520, deliveries: 485, revenue: 145000, efficiency: 93 },
  { month: "Mar", shipments: 480, deliveries: 450, revenue: 135000, efficiency: 94 },
  { month: "Apr", shipments: 610, deliveries: 580, revenue: 165000, efficiency: 95 },
  { month: "May", shipments: 690, deliveries: 650, revenue: 185000, efficiency: 94 },
  { month: "Jun", shipments: 750, deliveries: 710, revenue: 205000, efficiency: 95 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#1084FF" },
  { name: "Textiles", value: 25, color: "#00D9FF" },
  { name: "Furniture", value: 20, color: "#FFB800" },
  { name: "Food", value: 20, color: "#FF6B6B" },
];

const deliveryPerformanceData = [
  { day: "Mon", onTime: 95, delayed: 5 },
  { day: "Tue", onTime: 92, delayed: 8 },
  { day: "Wed", onTime: 97, delayed: 3 },
  { day: "Thu", onTime: 94, delayed: 6 },
  { day: "Fri", onTime: 96, delayed: 4 },
  { day: "Sat", onTime: 91, delayed: 9 },
  { day: "Sun", onTime: 93, delayed: 7 },
];

const costBreakdown = [
  { name: "Fuel", value: 30, color: "#FF6B6B" },
  { name: "Labor", value: 45, color: "#1084FF" },
  { name: "Maintenance", value: 15, color: "#FFB800" },
  { name: "Infrastructure", value: 10, color: "#00D9FF" },
];

export default function Analytics() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  const calculateTotals = () => {
    const totalShipments = analyticsData.reduce((sum, d) => sum + d.shipments, 0);
    const totalDeliveries = analyticsData.reduce((sum, d) => sum + d.deliveries, 0);
    const totalRevenue = analyticsData.reduce((sum, d) => sum + d.revenue, 0);
    const avgEfficiency = (analyticsData.reduce((sum, d) => sum + d.efficiency, 0) / analyticsData.length).toFixed(1);

    return { totalShipments, totalDeliveries, totalRevenue, avgEfficiency };
  };

  const { totalShipments, totalDeliveries, totalRevenue, avgEfficiency } = calculateTotals();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              Analytics & Reports
            </h1>
            <Button
              size="sm"
              variant="outline"
              onClick={handleRefresh}
              disabled={isLoading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
          <p className="text-muted-foreground">Real-time performance metrics and analytics</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Time Range Filter */}
        <div className="flex gap-2 mb-6">
          {(['week', 'month', 'year'] as const).map(range => (
            <Button
              key={range}
              size="sm"
              variant={timeRange === range ? 'default' : 'outline'}
              onClick={() => setTimeRange(range)}
              className="capitalize"
            >
              {range}
            </Button>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Shipments</p>
                <h3 className="text-3xl font-bold text-foreground mb-1">{totalShipments.toLocaleString()}</h3>
                <p className="text-xs text-green-600 dark:text-green-400">+12% from last period</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Successful Deliveries</p>
                <h3 className="text-3xl font-bold text-foreground mb-1">{totalDeliveries.toLocaleString()}</h3>
                <p className="text-xs text-green-600 dark:text-green-400">{((totalDeliveries / totalShipments) * 100).toFixed(1)}% success rate</p>
              </div>
              <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
                <h3 className="text-3xl font-bold text-foreground mb-1">${(totalRevenue / 1000000).toFixed(2)}M</h3>
                <p className="text-xs text-green-600 dark:text-green-400">+18% from last period</p>
              </div>
              <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-900/30">
                <PieChartIcon className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
          </Card>

          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Efficiency Score</p>
                <h3 className="text-3xl font-bold text-foreground mb-1">{avgEfficiency}%</h3>
                <p className="text-xs text-green-600 dark:text-green-400">+2% improvement</p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                <RefreshCw className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Revenue & Performance Trend */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Revenue & Efficiency Trend</h3>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1084FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1084FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" yAxisId="left" />
                <YAxis stroke="hsl(var(--muted-foreground))" yAxisId="right" orientation="right" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#1084FF"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="efficiency"
                  stroke="#00D9FF"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>

          {/* Shipment vs Delivery */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Shipments vs Deliveries</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                <Bar dataKey="shipments" fill="#1084FF" radius={[8, 8, 0, 0]} />
                <Bar dataKey="deliveries" fill="#00D9FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Delivery Performance */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Weekly Delivery Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={deliveryPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
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
                <Bar dataKey="onTime" fill="#22C55E" radius={[8, 8, 0, 0]} name="On-Time" />
                <Bar dataKey="delayed" fill="#EF4444" radius={[8, 8, 0, 0]} name="Delayed" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Shipment by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Cost Breakdown and Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Cost Breakdown */}
          <Card className="elevated-panel p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-6">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Summary Stats */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Summary</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">On-Time Delivery Rate</span>
                  <span className="font-semibold text-foreground">94.3%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94.3%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Customer Satisfaction</span>
                  <span className="font-semibold text-foreground">4.7/5.0</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '94%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Fleet Utilization</span>
                  <span className="font-semibold text-foreground">87.5%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full" style={{ width: '87.5%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Warehouse Capacity</span>
                  <span className="font-semibold text-foreground">72.1%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '72.1%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Export Section */}
        <Card className="elevated-panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Export Analytics</h3>
              <p className="text-sm text-muted-foreground">Download detailed reports in various formats</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                CSV
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                PDF
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Excel
              </Button>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
