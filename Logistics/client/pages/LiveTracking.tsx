import { useState, useEffect, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRealtimeUpdates, getUpdateColor } from '@/hooks/useRealtimeUpdates';
import { MapPin, AlertCircle, CheckCircle, Clock, Wifi, WifiOff, Truck, Activity } from 'lucide-react';

export default function LiveTracking() {
  const trackingNumbers = useMemo(() => ['SHP-2024-001', 'SHP-2024-002', 'SHP-2024-003', 'SHP-2024-004'], []);
  const { updates, shipmentStatuses, isConnected } = useRealtimeUpdates(trackingNumbers);
  const [selectedShipment, setSelectedShipment] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'in-transit':
        return <Truck className="w-5 h-5" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Activity className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'in-transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedShipmentData = shipmentStatuses.find(s => s.id === selectedShipment);
  const shipmentUpdates = selectedShipment
    ? updates.filter(u => u.shipmentId === selectedShipment)
    : updates.slice(0, 10);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur glass-effect">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4 animate-fade-in-down">
            <h1 className="text-2xl font-bold text-foreground gradient-text">Live Tracking Updates</h1>
            <div className="flex items-center gap-2 relative">
              {isConnected ? (
                <>
                  <div className="relative">
                    <Wifi className="w-5 h-5 text-green-600 dark:text-green-400 animate-pulse-wave" />
                  </div>
                  <span className="text-sm text-green-600 dark:text-green-400 font-medium animate-fade-in-up">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-5 h-5 text-red-600 dark:text-red-400 animate-attention" />
                  <span className="text-sm text-red-600 dark:text-red-400 font-medium">Disconnected</span>
                </>
              )}
            </div>
          </div>
          <p className="text-muted-foreground animate-fade-in-up">Real-time shipment tracking and status updates</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Shipment List */}
          <div className="lg:col-span-1 animate-slide-in-left">
            <Card className="elevated-panel p-6 card-lift">
              <h3 className="text-lg font-semibold text-foreground mb-4 gradient-text">Active Shipments</h3>
              <div className="space-y-3">
                {shipmentStatuses.map((shipment, index) => (
                  <button
                    key={shipment.id}
                    onClick={() => setSelectedShipment(shipment.id)}
                    className={`w-full p-4 rounded-lg border transition-all text-left stagger-item hover-lift group relative overflow-hidden ${
                      selectedShipment === shipment.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg'
                        : 'border-border hover:border-blue-400 hover:bg-accent/5'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-mono font-semibold text-sm text-foreground">{shipment.trackingNumber}</p>
                        <span className={`transition-transform duration-300 ${selectedShipment === shipment.id ? 'animate-bounce-in' : ''}`}>
                          {getStatusIcon(shipment.status)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{shipment.currentLocation}</p>
                      <div className="w-full bg-border rounded-full h-1.5 mb-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500 animate-fill-progress"
                          style={{ width: `${shipment.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">{Math.round(shipment.progress)}% complete</p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="elevated-panel p-6 mt-6 card-lift animate-slide-in-left" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-lg font-semibold text-foreground mb-4 gradient-text">Statistics</h3>
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-accent/10 to-accent/5 hover-glow transition-all">
                  <p className="text-xs text-muted-foreground mb-1">Total Updates</p>
                  <p className="text-2xl font-bold text-foreground animate-bounce-in">{updates.length}</p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-400/5 hover-glow transition-all">
                  <p className="text-xs text-muted-foreground mb-1">In Transit</p>
                  <p className="text-2xl font-bold text-blue-600 animate-bounce-in">
                    {shipmentStatuses.filter(s => s.status === 'in-transit').length}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gradient-to-br from-green-500/10 to-green-400/5 hover-glow transition-all">
                  <p className="text-xs text-muted-foreground mb-1">Delivered</p>
                  <p className="text-2xl font-bold text-green-600 animate-bounce-in">
                    {shipmentStatuses.filter(s => s.status === 'delivered').length}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Details and Updates */}
          <div className="lg:col-span-2 space-y-6 animate-slide-in-right">
            {/* Shipment Details */}
            {selectedShipmentData && (
              <Card className="elevated-panel p-6 card-lift animate-bounce-in">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 gradient-text">{selectedShipmentData.trackingNumber}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-all duration-300 ${getStatusColor(selectedShipmentData.status)}`}>
                        <span className="animate-bounce-in">
                          {getStatusIcon(selectedShipmentData.status)}
                        </span>
                        {selectedShipmentData.status.charAt(0).toUpperCase() + selectedShipmentData.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedShipment(null)}
                    className="hover-rotate transition-all duration-300"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Current Location', value: selectedShipmentData.currentLocation, icon: MapPin },
                    { label: 'Vehicle', value: selectedShipmentData.vehicle },
                    { label: 'Driver', value: selectedShipmentData.driver },
                    { label: 'ETA', value: new Date(selectedShipmentData.eta || '').toLocaleDateString() },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-accent/10 to-accent/5 rounded-lg hover-lift stagger-item transition-all"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className="font-semibold text-foreground flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-foreground">Delivery Progress</p>
                    <p className="text-sm font-bold text-blue-600 dark:text-blue-400 animate-bounce-in">{Math.round(selectedShipmentData.progress)}%</p>
                  </div>
                  <div className="w-full bg-border rounded-full h-3 overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-500 h-3 rounded-full transition-all duration-500 animate-fill-progress shadow-lg animate-gradient-shift"
                      style={{ width: `${selectedShipmentData.progress}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground animate-fade-in-up">
                  Last updated: {new Date(selectedShipmentData.lastUpdate).toLocaleTimeString()}
                </p>
              </Card>
            )}

            {/* Live Updates Stream */}
            <Card className="elevated-panel p-6 card-lift">
              <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2 gradient-text animate-fade-in-up">
                <Activity className={`w-5 h-5 ${isConnected ? 'animate-smooth-pulse' : ''}`} />
                {selectedShipment ? 'Shipment Updates' : 'All Updates'}
              </h3>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {shipmentUpdates.length > 0 ? (
                  shipmentUpdates.map((update, index) => (
                    <div
                      key={update.id}
                      className={`p-4 rounded-lg border transition-all timeline-item hover-lift group relative ${
                        update.severity === 'critical'
                          ? 'border-red-500/50 bg-red-50/30 dark:bg-red-900/10'
                          : 'border-border bg-card/50 hover:bg-card'
                      }`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div className="flex items-start gap-4 relative z-10">
                        <div
                          className={`mt-1 flex-shrink-0 p-2 rounded-full transition-all duration-300 ${
                            update.severity === 'critical' || update.severity === 'warning'
                              ? 'bg-red-100/50 dark:bg-red-900/30 animate-attention'
                              : update.type === 'delivery'
                                ? 'bg-green-100/50 dark:bg-green-900/30'
                                : update.type === 'location'
                                  ? 'bg-blue-100/50 dark:bg-blue-900/30'
                                  : 'bg-accent/20'
                          } ${getUpdateColor(update.type, update.severity)}`}
                        >
                          {update.severity === 'critical' || update.severity === 'warning' ? (
                            <AlertCircle className="w-5 h-5 animate-pulse-wave" />
                          ) : update.type === 'delivery' ? (
                            <CheckCircle className="w-5 h-5 animate-bounce-in" />
                          ) : update.type === 'location' ? (
                            <MapPin className="w-5 h-5 animate-bounce-in" />
                          ) : (
                            <Activity className="w-5 h-5 animate-smooth-pulse" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
                            <p className="font-semibold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {update.title}
                            </p>
                            <span className="text-xs text-muted-foreground opacity-75 group-hover:opacity-100 transition-opacity">
                              {new Date(update.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3 group-hover:text-foreground/80 transition-colors">
                            {update.message}
                          </p>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs px-3 py-1 bg-accent/30 rounded-full text-muted-foreground font-medium hover:bg-accent/50 transition-all cursor-default">
                              {update.shipmentId}
                            </span>
                            {update.status && (
                              <span
                                className={`text-xs px-3 py-1 rounded-full font-medium transition-all duration-300 ${
                                  update.status === 'in-transit'
                                    ? 'bg-blue-100/70 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 animate-smooth-pulse'
                                    : update.status === 'delivered'
                                      ? 'bg-green-100/70 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                                      : 'bg-yellow-100/70 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300'
                                }`}
                              >
                                {update.status.charAt(0).toUpperCase() + update.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 mb-4 animate-smooth-pulse">
                      <Activity className="w-8 h-8 text-muted-foreground/60" />
                    </div>
                    <p className="text-muted-foreground font-medium">No updates available</p>
                    <p className="text-xs text-muted-foreground mt-2">Updates will appear here as they happen</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
