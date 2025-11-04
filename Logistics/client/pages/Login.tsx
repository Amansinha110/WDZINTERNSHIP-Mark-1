import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { AlertCircle, Truck } from "lucide-react";

interface LoginCredentials {
  email: string;
  password: string;
  role: "admin" | "warehouse_manager" | "delivery_staff";
}

export default function Login() {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: "",
    password: "",
    role: "admin",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      if (!credentials.email || !credentials.password) {
        setError("Please fill in all fields");
        setLoading(false);
        return;
      }

      // Store auth info in localStorage (demo purposes)
      const authData = {
        email: credentials.email,
        role: credentials.role,
        loginTime: new Date().toISOString(),
      };
      localStorage.setItem("auth", JSON.stringify(authData));

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError("Authentication failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const demoCredentials = [
    { email: "admin@logistics.com", role: "admin", desc: "Admin Access" },
    {
      email: "manager@logistics.com",
      role: "warehouse_manager",
      desc: "Warehouse Manager",
    },
    {
      email: "driver@logistics.com",
      role: "delivery_staff",
      desc: "Delivery Staff",
    },
  ];

  const fillDemo = (email: string, role: string) => {
    setCredentials({
      email,
      password: "demo123",
      role: role as "admin" | "warehouse_manager" | "delivery_staff",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-200/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl mb-4 shadow-lg card-3d">
            <Truck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">LogiTrack</h1>
          <p className="text-muted-foreground">Logistics Management Portal</p>
        </div>

        {/* Main Login Card */}
        <Card className="elevated-panel p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@logistics.com"
                value={credentials.email}
                onChange={handleInputChange}
                disabled={loading}
                className="transition-all focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={credentials.password}
                onChange={handleInputChange}
                disabled={loading}
                className="transition-all focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                User Role
              </Label>
              <select
                id="role"
                name="role"
                value={credentials.role}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              >
                <option value="admin">Admin</option>
                <option value="warehouse_manager">Warehouse Manager</option>
                <option value="delivery_staff">Delivery Staff</option>
              </select>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <span className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-10 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium transition-all"
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Card>

        {/* Demo Credentials */}
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground text-center mb-3">
            Demo Credentials
          </p>
          <div className="grid gap-2">
            {demoCredentials.map((demo) => (
              <button
                key={demo.email}
                onClick={() => fillDemo(demo.email, demo.role)}
                className="p-3 rounded-lg border border-border hover:bg-accent/10 hover:border-accent transition-all text-left"
              >
                <div className="text-sm font-medium text-foreground">
                  {demo.desc}
                </div>
                <div className="text-xs text-muted-foreground">
                  {demo.email}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          Default password for all demo accounts:{" "}
          <span className="font-mono">demo123</span>
        </p>
      </div>
    </div>
  );
}
