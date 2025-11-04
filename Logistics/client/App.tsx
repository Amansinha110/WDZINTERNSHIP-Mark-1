import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import Drivers from "./pages/Drivers";
import Warehouse from "./pages/Warehouse";
import Analytics from "./pages/Analytics";
import LiveTracking from "./pages/LiveTracking";
import MapTracking from "./pages/MapTracking";
import AdvancedReports from "./pages/AdvancedReports";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/shipments" element={<Shipments />} />
          <Route path="/drivers" element={<Drivers />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/live-tracking" element={<LiveTracking />} />
          <Route path="/map-tracking" element={<MapTracking />} />
          <Route path="/advanced-reports" element={<AdvancedReports />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
