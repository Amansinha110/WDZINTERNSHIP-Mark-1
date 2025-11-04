import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Boxes, Package, AlertCircle, TrendingUp, Search, Filter, Plus, MapPin, BarChart3, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  location: string;
  reorderLevel: number;
  lastUpdated: string;
  condition: 'good' | 'damaged' | 'expired';
}

interface WarehouseLocation {
  id: string;
  name: string;
  capacity: number;
  utilization: number;
  items: number;
  temperature?: string;
  humidity?: string;
}

const warehouseLocations: WarehouseLocation[] = [
  {
    id: '1',
    name: 'Zone A - Cold Storage',
    capacity: 10000,
    utilization: 78,
    items: 7800,
    temperature: '-18°C',
    humidity: '45%',
  },
  {
    id: '2',
    name: 'Zone B - General Storage',
    capacity: 15000,
    utilization: 65,
    items: 9750,
    temperature: '22°C',
    humidity: '55%',
  },
  {
    id: '3',
    name: 'Zone C - High-Value Items',
    capacity: 5000,
    utilization: 82,
    items: 4100,
    temperature: '21°C',
    humidity: '50%',
  },
  {
    id: '4',
    name: 'Zone D - Loading Dock',
    capacity: 8000,
    utilization: 45,
    items: 3600,
    temperature: '20°C',
    humidity: '60%',
  },
];

const initialInventory: InventoryItem[] = [
  {
    id: '1',
    sku: 'SKU-001',
    name: 'Electronics - Laptops',
    category: 'Electronics',
    quantity: 145,
    location: 'Zone A - Shelf 12',
    reorderLevel: 50,
    lastUpdated: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    condition: 'good',
  },
  {
    id: '2',
    sku: 'SKU-002',
    name: 'Textiles - T-Shirts',
    category: 'Textiles',
    quantity: 32,
    location: 'Zone B - Shelf 5',
    reorderLevel: 100,
    lastUpdated: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    condition: 'good',
  },
  {
    id: '3',
    sku: 'SKU-003',
    name: 'Furniture - Chairs',
    category: 'Furniture',
    quantity: 78,
    location: 'Zone C - Shelf 8',
    reorderLevel: 20,
    lastUpdated: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    condition: 'damaged',
  },
  {
    id: '4',
    sku: 'SKU-004',
    name: 'Food - Frozen Vegetables',
    category: 'Food',
    quantity: 12,
    location: 'Zone A - Freezer 3',
    reorderLevel: 100,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    condition: 'good',
  },
  {
    id: '5',
    sku: 'SKU-005',
    name: 'Electronics - Cables',
    category: 'Electronics',
    quantity: 562,
    location: 'Zone B - Shelf 2',
    reorderLevel: 200,
    lastUpdated: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    condition: 'good',
  },
];

const capacityData = warehouseLocations.map(zone => ({
  name: zone.name.split(' - ')[1],
  used: Math.round((zone.utilization / 100) * zone.capacity),
  available: zone.capacity - Math.round((zone.utilization / 100) * zone.capacity),
}));

export default function Warehouse() {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    sku: '',
    name: '',
    category: '',
    quantity: '',
    location: '',
    reorderLevel: '',
  });

  // Simulate real-time inventory updates
  useEffect(() => {
    const interval = setInterval(() => {
      setInventory(prev =>
        prev.map(item => {
          if (Math.random() > 0.7) {
            const change = Math.floor(Math.random() * 20) - 10;
            return {
              ...item,
              quantity: Math.max(0, item.quantity + change),
              lastUpdated: new Date().toISOString(),
            };
          }
          return item;
        })
      );
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch =
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddItem = () => {
    if (newItem.sku && newItem.name && newItem.category && newItem.quantity && newItem.location) {
      const item: InventoryItem = {
        id: String(inventory.length + 1),
        ...newItem,
        quantity: parseInt(newItem.quantity),
        reorderLevel: parseInt(newItem.reorderLevel) || 0,
        lastUpdated: new Date().toISOString(),
        condition: 'good',
      };
      setInventory([...inventory, item]);
      setNewItem({ sku: '', name: '', category: '', quantity: '', location: '', reorderLevel: '' });
    }
  };

  const handleDeleteItem = (id: string) => {
    setInventory(inventory.filter(item => item.id !== id));
  };

  const criticalItems = inventory.filter(item => item.quantity <= item.reorderLevel);
  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const damagedItems = inventory.filter(item => item.condition === 'damaged').length;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'good':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'damaged':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'expired':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">Warehouse Management</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white">
                <Plus className="w-4 h-4" />
                Add Inventory
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Inventory Item</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>SKU</Label>
                  <Input
                    placeholder="SKU-001"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({ ...newItem, sku: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Item Name</Label>
                  <Input
                    placeholder="e.g., Electronics - Laptops"
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Category</Label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select category...</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Textiles">Textiles</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Food">Food</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="100"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Reorder Level</Label>
                    <Input
                      type="number"
                      placeholder="50"
                      value={newItem.reorderLevel}
                      onChange={(e) => setNewItem({ ...newItem, reorderLevel: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label>Location</Label>
                  <select
                    value={newItem.location}
                    onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select location...</option>
                    {warehouseLocations.map(zone => (
                      <option key={zone.id} value={zone.name}>
                        {zone.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button onClick={handleAddItem} className="w-full bg-blue-500 hover:bg-blue-600">
                  Add Item
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Total Items</p>
                <h3 className="text-3xl font-bold text-foreground">{totalItems.toLocaleString()}</h3>
                <p className="text-xs text-muted-foreground mt-2">Across all zones</p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Boxes className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </Card>
          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Critical Stock</p>
                <h3 className="text-3xl font-bold text-foreground">{criticalItems.length}</h3>
                <p className="text-xs text-muted-foreground mt-2">Below reorder level</p>
              </div>
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </Card>
          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Warehouse Zones</p>
                <h3 className="text-3xl font-bold text-foreground">{warehouseLocations.length}</h3>
                <p className="text-xs text-muted-foreground mt-2">Active locations</p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <MapPin className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </Card>
          <Card className="elevated-panel p-6 card-3d">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-1">Damaged Items</p>
                <h3 className="text-3xl font-bold text-foreground">{damagedItems}</h3>
                <p className="text-xs text-muted-foreground mt-2">Requires inspection</p>
              </div>
              <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Capacity Chart */}
        <Card className="elevated-panel p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Zone Capacity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={capacityData}>
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
              <Bar dataKey="used" fill="#1084FF" radius={[8, 8, 0, 0]} />
              <Bar dataKey="available" fill="#00D9FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Warehouse Locations */}
        <Card className="elevated-panel p-6 mb-8">
          <h3 className="text-lg font-semibold text-foreground mb-6">Warehouse Zones</h3>
          <div className="space-y-4">
            {warehouseLocations.map(zone => (
              <div key={zone.id} className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground mb-1">{zone.name}</h4>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Items: {zone.items}</span>
                      <span>Capacity: {zone.capacity.toLocaleString()} lbs</span>
                      {zone.temperature && <span>Temp: {zone.temperature}</span>}
                      {zone.humidity && <span>Humidity: {zone.humidity}</span>}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-border rounded-full h-3 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full transition-all"
                    style={{ width: `${zone.utilization}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{zone.utilization}% utilized</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Inventory Items */}
        <Card className="elevated-panel p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by SKU or item name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={filterCategory || ''}
              onChange={(e) => setFilterCategory(e.target.value || null)}
              className="px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Textiles">Textiles</option>
              <option value="Furniture">Furniture</option>
              <option value="Food">Food</option>
            </select>
          </div>

          {/* Critical Items Alert */}
          {criticalItems.length > 0 && (
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400">
                {criticalItems.length} item(s) below reorder level - Immediate action needed
              </p>
            </div>
          )}

          <div className="space-y-3">
            {filteredInventory.length > 0 ? (
              filteredInventory.map(item => (
                <div
                  key={item.id}
                  className="p-4 border border-border rounded-lg hover:bg-accent/5 transition-all cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">SKU</p>
                      <p className="font-mono font-semibold text-foreground">{item.sku}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Item Name</p>
                      <p className="text-sm text-foreground">{item.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Location</p>
                      <p className="text-sm text-foreground">{item.location.split(' - ')[1]}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Quantity</p>
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${item.quantity <= item.reorderLevel ? 'text-red-600' : 'text-foreground'}`}>
                          {item.quantity}
                        </p>
                        {item.quantity <= item.reorderLevel && (
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Low</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Condition</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                        {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}
                      </span>
                    </div>
                    <div className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteItem(item.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No items found</p>
              </div>
            )}
          </div>
        </Card>

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4" onClick={() => setSelectedItem(null)}>
            <Card className="elevated-panel w-full max-w-2xl p-8" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{selectedItem.sku}</h3>
                  <p className="text-muted-foreground">{selectedItem.name}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-accent/10 rounded-lg">
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Category</p>
                  <p className="font-medium text-foreground">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Current Quantity</p>
                  <p className="font-medium text-foreground">{selectedItem.quantity}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Reorder Level</p>
                  <p className="font-medium text-foreground">{selectedItem.reorderLevel}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Location</p>
                  <p className="font-medium text-foreground">{selectedItem.location}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Condition</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getConditionColor(selectedItem.condition)}`}>
                    {selectedItem.condition.charAt(0).toUpperCase() + selectedItem.condition.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Last Updated</p>
                  <p className="font-medium text-foreground">
                    {new Date(selectedItem.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              <Button onClick={() => setSelectedItem(null)} className="w-full bg-blue-500 hover:bg-blue-600">
                Close
              </Button>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
