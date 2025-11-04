import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ScatterChart,
  Scatter,
} from 'recharts';
import {
  Download,
  FileJson,
  FileText,
  BarChart3,
  TrendingUp,
  Calendar,
  Filter,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react';

interface ReportData {
  date: string;
  shipments: number;
  deliveries: number;
  failed: number;
  revenue: number;
  avgDeliveryTime: number;
}

interface MetricCard {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  color: string;
}

const reportData: ReportData[] = [
  { date: 'Jan 1', shipments: 45, deliveries: 42, failed: 3, revenue: 12500, avgDeliveryTime: 2.1 },
  { date: 'Jan 2', shipments: 52, deliveries: 50, failed: 2, revenue: 14200, avgDeliveryTime: 2.0 },
  { date: 'Jan 3', shipments: 48, deliveries: 46, failed: 2, revenue: 13100, avgDeliveryTime: 2.2 },
  { date: 'Jan 4', shipments: 61, deliveries: 59, failed: 2, revenue: 15800, avgDeliveryTime: 2.1 },
  { date: 'Jan 5', shipments: 55, deliveries: 53, failed: 2, revenue: 14500, avgDeliveryTime: 2.0 },
  { date: 'Jan 6', shipments: 67, deliveries: 65, failed: 2, revenue: 17200, avgDeliveryTime: 1.9 },
  { date: 'Jan 7', shipments: 58, deliveries: 56, failed: 2, revenue: 15100, avgDeliveryTime: 2.1 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#1084FF' },
  { name: 'Textiles', value: 25, color: '#00D9FF' },
  { name: 'Furniture', value: 20, color: '#FFB800' },
  { name: 'Food', value: 20, color: '#FF6B6B' },
];

const performanceData = reportData.map(d => ({
  ...d,
  deliveryRate: ((d.deliveries / d.shipments) * 100).toFixed(1),
}));

const regionData = [
  { region: 'North', shipments: 245, deliveries: 235, failed: 10 },
  { region: 'South', shipments: 198, deliveries: 190, failed: 8 },
  { region: 'East', shipments: 312, deliveries: 305, failed: 7 },
  { region: 'West', shipments: 267, deliveries: 260, failed: 7 },
  { region: 'Midwest', shipments: 189, deliveries: 183, failed: 6 },
];

export default function AdvancedReports() {
  const [dateRange, setDateRange] = useState({ start: '2024-01-01', end: '2024-01-07' });
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'pdf'>('csv');

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    let data = '';
    let filename = `logistics-report-${new Date().toISOString().split('T')[0]}`;

    if (format === 'csv') {
      const headers = ['Date', 'Shipments', 'Deliveries', 'Failed', 'Revenue', 'Avg Delivery Time'];
      data = headers.join(',') + '\n';
      reportData.forEach(row => {
        data += [row.date, row.shipments, row.deliveries, row.failed, `$${row.revenue}`, `${row.avgDeliveryTime}d`].join(',') + '\n';
      });
      filename += '.csv';
    } else if (format === 'json') {
      data = JSON.stringify(reportData, null, 2);
      filename += '.json';
    } else if (format === 'pdf') {
      alert('PDF export would be generated here. In production, use a library like jsPDF or PDFKit.');
      return;
    }

    const blob = new Blob([data], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
  };

  const totalShipments = reportData.reduce((sum, d) => sum + d.shipments, 0);
  const totalDeliveries = reportData.reduce((sum, d) => sum + d.deliveries, 0);
  const totalRevenue = reportData.reduce((sum, d) => sum + d.revenue, 0);
  const avgDeliveryTime = (
    reportData.reduce((sum, d) => sum + d.avgDeliveryTime, 0) / reportData.length
  ).toFixed(2);
  const deliveryRate = ((totalDeliveries / totalShipments) * 100).toFixed(1);

  const metrics: MetricCard[] = [
    {
      title: 'Total Shipments',
      value: totalShipments,
      change: '+12% vs last week',
      icon: <BarChart3 className="w-6 h-6" />,
      color: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Successful Deliveries',
      value: totalDeliveries,
      change: `${deliveryRate}% success rate`,
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      title: 'Total Revenue',
      value: `$${(totalRevenue / 1000).toFixed(1)}K`,
      change: '+18% vs last week',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'bg-cyan-100 dark:bg-cyan-900/30',
    },
    {
      title: 'Avg Delivery Time',
      value: `${avgDeliveryTime}d`,
      change: '8% faster',
      icon: <Clock className="w-6 h-6" />,
      color: 'bg-orange-100 dark:bg-orange-900/30',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Advanced Reports & Analytics</h1>
          <p className="text-muted-foreground">Detailed insights and performance metrics for your logistics operations</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters & Export */}
        <Card className="elevated-panel p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label className="text-sm mb-2 block">Start Date</Label>
              <Input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">End Date</Label>
              <Input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Region</Label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Regions</option>
                <option value="north">North</option>
                <option value="south">South</option>
                <option value="east">East</option>
                <option value="west">West</option>
                <option value="midwest">Midwest</option>
              </select>
            </div>
            <div>
              <Label className="text-sm mb-2 block">Export</Label>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleExport('csv')}
                  className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <FileText className="w-4 h-4" />
                  CSV
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleExport('json')}
                  className="flex-1 gap-2 bg-cyan-500 hover:bg-cyan-600 text-white"
                >
                  <FileJson className="w-4 h-4" />
                  JSON
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric, index) => (
            <Card key={index} className="elevated-panel p-6 card-3d">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{metric.value}</h3>
                  <p className="text-xs text-green-600 dark:text-green-400">{metric.change}</p>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>{metric.icon}</div>
              </div>
            </Card>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Daily Performance */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Daily Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="shipments" stroke="#1084FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="deliveries" stroke="#00D9FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Category Distribution */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Category Distribution</h3>
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

          {/* Revenue Trend */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" fill="#1084FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Delivery Rate */}
          <Card className="elevated-panel p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Delivery Success Rate</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="deliveryRate" stroke="#00D9FF" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Regional Performance */}
        <Card className="elevated-panel p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Regional Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Region</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Shipments</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Deliveries</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Failed</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Success Rate</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {regionData.map((region, index) => {
                  const successRate = ((region.deliveries / region.shipments) * 100).toFixed(1);
                  return (
                    <tr key={index} className="border-b border-border hover:bg-accent/5 transition-colors">
                      <td className="py-3 px-4 font-medium text-foreground">{region.region}</td>
                      <td className="py-3 px-4 text-foreground">{region.shipments}</td>
                      <td className="py-3 px-4 text-foreground">{region.deliveries}</td>
                      <td className="py-3 px-4 text-foreground">{region.failed}</td>
                      <td className="py-3 px-4 font-semibold text-foreground">{successRate}%</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                            parseFloat(successRate) >= 95
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : parseFloat(successRate) >= 90
                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {parseFloat(successRate) >= 95 ? '✓' : parseFloat(successRate) >= 90 ? '!' : '✗'}
                          {successRate}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Insights & Recommendations */}
        <Card className="elevated-panel p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Insights & Recommendations</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">High Peak Days</p>
                <p className="text-sm text-muted-foreground">
                  Data shows Jan 6 had the highest shipment volume (67). Consider allocating more resources on Fridays.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Excellent Performance</p>
                <p className="text-sm text-muted-foreground">
                  Overall delivery success rate stands at {deliveryRate}%. Keep maintaining this level of service.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">Opportunity for Growth</p>
                <p className="text-sm text-muted-foreground">
                  East region shows strong performance with 305 successful deliveries. Consider expanding in this area.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
