import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Truck,
  Package,
  BarChart3,
  MapPin,
  Shield,
  Zap,
  ArrowRight,
  Boxes,
} from "lucide-react";

export default function Index() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Package,
      title: "Shipment Tracking",
      description:
        "Real-time tracking of all incoming and outgoing shipments with detailed status updates.",
    },
    {
      icon: Truck,
      title: "Driver Management",
      description:
        "Efficiently manage drivers, vehicles, and assignments with intuitive dashboard.",
    },
    {
      icon: Boxes,
      title: "Warehouse Dashboard",
      description:
        "Monitor inventory, locations, and quantities across all warehouse facilities.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description:
        "Comprehensive reports and insights into deliveries, pending shipments, and metrics.",
    },
    {
      icon: MapPin,
      title: "Live Updates",
      description:
        "Monitor logistics operations in real-time with live status updates and notifications.",
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description:
        "Secure access control for Admin, Warehouse Managers, and Delivery Staff.",
    },
  ];

  const stats = [
    { label: "Active Shipments", value: "2,450+" },
    { label: "Completed Deliveries", value: "12,890" },
    { label: "Fleet Vehicles", value: "156" },
    { label: "Delivery Staff", value: "89" },
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 border-b border-border bg-card/95 backdrop-blur glass-effect">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between animate-fade-in-down">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-110">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">LogiTrack</h1>
          </div>
          <Button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-200/30 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div className="absolute top-1/2 right-0 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-float"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 animate-slide-in-left">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100/50 dark:bg-blue-900/30 rounded-full border border-blue-200/50 dark:border-blue-800/30 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default">
                  <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Next-generation Logistics
                  </span>
                </div>
                <h2 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight gradient-text">
                  Streamline Your Logistics Operations
                </h2>
                <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
                  Manage shipments, track drivers, optimize warehouse
                  operations, and gain real-time visibility across your entire
                  logistics network.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-2 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300 transform hover:scale-105"
                >
                  View Demo
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-96 lg:h-full animate-slide-in-right">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl border border-blue-200/20 dark:border-blue-800/20 shadow-lg hover:shadow-2xl transition-all duration-500"></div>
              <div className="absolute inset-4 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 rounded-xl"></div>
              <div className="flex items-center justify-center h-full">
                <div className="text-center transform hover:scale-110 transition-transform duration-500">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-2xl hover:shadow-3xl transition-all duration-300 animate-float">
                    <Boxes className="w-12 h-12 text-white" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    Logistics Management
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-transparent to-blue-50/30 dark:to-blue-950/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="elevated-panel p-6 text-center card-3d stagger-item group"
              >
                <p className="text-3xl font-bold text-foreground mb-2 group-hover:gradient-text transition-all duration-300">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6 gradient-text">
              Powerful Features for Modern Logistics
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Everything you need to manage, track, and optimize your logistics
              operations in one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="elevated-panel p-8 card-3d group stagger-item hover:border-blue-400 dark:hover:border-blue-500"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg mb-6 group-hover:from-blue-500/40 group-hover:to-cyan-500/40 transition-all duration-300 transform group-hover:scale-125 group-hover:rotate-12">
                    <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors duration-300">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-r from-blue-600 to-cyan-600 relative overflow-hidden group">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            Ready to Transform Your Logistics?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Join leading logistics companies using LogiTrack to streamline
            operations and increase efficiency.
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/login")}
            className="gap-2 bg-white text-blue-600 hover:bg-white/90 font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="stagger-item">
              <div className="flex items-center gap-2 mb-4 group">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-lg transition-all duration-300 transform group-hover:scale-110 group-hover:shadow-xl">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-foreground">LogiTrack</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Modern logistics management platform for the digital age.
              </p>
            </div>
            <div className="stagger-item">
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Security
                  </a>
                </li>
              </ul>
            </div>
            <div className="stagger-item">
              <h4 className="font-semibold text-foreground mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div className="stagger-item">
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground hover:translate-x-1 transition-all duration-300 inline-block">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-muted-foreground animate-fade-in-up">
            <p>&copy; 2024 LogiTrack. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground hover:translate-y-0.5 transition-all duration-300">
                Privacy
              </a>
              <a href="#" className="hover:text-foreground hover:translate-y-0.5 transition-all duration-300">
                Terms
              </a>
              <a href="#" className="hover:text-foreground hover:translate-y-0.5 transition-all duration-300">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
