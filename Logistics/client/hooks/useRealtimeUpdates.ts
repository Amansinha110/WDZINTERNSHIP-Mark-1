import { useState, useEffect, useCallback } from 'react';

export interface LiveUpdate {
  id: string;
  shipmentId: string;
  timestamp: string;
  type: 'location' | 'status' | 'delivery' | 'alert';
  title: string;
  message: string;
  latitude?: number;
  longitude?: number;
  status?: 'pending' | 'in-transit' | 'delivered';
  severity?: 'info' | 'warning' | 'critical';
}

export interface ShipmentStatus {
  id: string;
  trackingNumber: string;
  currentLocation: string;
  status: 'pending' | 'in-transit' | 'delivered';
  progress: number;
  lastUpdate: string;
  nextCheckpoint?: string;
  eta?: string;
  driver?: string;
  vehicle?: string;
}

const generateMockUpdate = (shipmentId: string, trackingNumber: string): LiveUpdate => {
  const types: LiveUpdate['type'][] = ['location', 'status', 'delivery', 'alert'];
  const locations = [
    'New York',
    'Boston',
    'Philadelphia',
    'Chicago',
    'Los Angeles',
    'San Francisco',
    'Houston',
    'Miami',
    'Seattle',
    'Denver',
  ];
  const statuses: ShipmentStatus['status'][] = ['pending', 'in-transit', 'delivered'];

  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomLocation = locations[Math.floor(Math.random() * locations.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  const messages: Record<LiveUpdate['type'], string[]> = {
    location: [
      `Package scanned at ${randomLocation} sorting facility`,
      `Delivery vehicle picked up package in ${randomLocation}`,
      `Package arrived at local distribution center in ${randomLocation}`,
    ],
    status: [
      'Out for delivery',
      'In transit to next facility',
      'Awaiting pickup from sender',
      'Clearance completed',
    ],
    delivery: [
      'Package delivered successfully',
      'Delivery attempted, no one home',
      'Scheduled for delivery tomorrow',
    ],
    alert: [
      'Weather delay reported',
      'High-value package flagged for security',
      'Delivery address needs verification',
    ],
  };

  const randomMessage = messages[randomType][Math.floor(Math.random() * messages[randomType].length)];

  return {
    id: `update-${Date.now()}-${Math.random()}`,
    shipmentId,
    timestamp: new Date().toISOString(),
    type: randomType,
    title: randomType.charAt(0).toUpperCase() + randomType.slice(1) + ' Update',
    message: randomMessage,
    latitude: Math.random() * 180 - 90,
    longitude: Math.random() * 360 - 180,
    status: randomStatus,
    severity: randomType === 'alert' ? 'warning' : 'info',
  };
};

export const useRealtimeUpdates = (trackingNumbers: string[]) => {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [shipmentStatuses, setShipmentStatuses] = useState<ShipmentStatus[]>([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Initialize shipment statuses
    const initialStatuses: ShipmentStatus[] = trackingNumbers.map((trackingNumber, index) => ({
      id: `shipment-${index}`,
      trackingNumber,
      currentLocation: ['New York', 'Los Angeles', 'Chicago'][index % 3],
      status: ['pending', 'in-transit', 'delivered'][index % 3] as any,
      progress: [0, 50, 100][index % 3],
      lastUpdate: new Date().toISOString(),
      nextCheckpoint: 'Distribution Center',
      eta: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      driver: `Driver ${index + 1}`,
      vehicle: `TR-${String(index + 1).padStart(3, '0')}`,
    }));

    setShipmentStatuses(initialStatuses);
  }, [trackingNumbers]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIsConnected(true);

      setShipmentStatuses(prevStatuses => {
        if (prevStatuses.length === 0) return prevStatuses;

        const randomShipment = prevStatuses[Math.floor(Math.random() * prevStatuses.length)];
        const newUpdate = generateMockUpdate(randomShipment.id, randomShipment.trackingNumber);

        // Add new update
        setUpdates(prev => [newUpdate, ...prev.slice(0, 49)]);

        // Update shipment status
        return prevStatuses.map(shipment =>
          shipment.id === randomShipment.id
            ? {
              ...shipment,
              progress: Math.min(100, shipment.progress + Math.random() * 10),
              lastUpdate: new Date().toISOString(),
              currentLocation: ['New York', 'Boston', 'Chicago', 'Los Angeles'][
                Math.floor(Math.random() * 4)
              ],
            }
            : shipment
        );
      });
    }, 6000); // Update every 6 seconds

    return () => clearInterval(interval);
  }, []);

  return { updates, shipmentStatuses, isConnected };
};

export const getUpdateColor = (type: LiveUpdate['type'] | undefined, severity?: string) => {
  if (severity === 'critical') return 'text-red-600 dark:text-red-400';
  if (severity === 'warning') return 'text-yellow-600 dark:text-yellow-400';
  
  switch (type) {
    case 'location':
      return 'text-blue-600 dark:text-blue-400';
    case 'status':
      return 'text-cyan-600 dark:text-cyan-400';
    case 'delivery':
      return 'text-green-600 dark:text-green-400';
    case 'alert':
      return 'text-yellow-600 dark:text-yellow-400';
    default:
      return 'text-gray-600 dark:text-gray-400';
  }
};
