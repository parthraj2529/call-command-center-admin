
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Calls from "./pages/Calls";
import Agents from "./pages/Agents";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import AppLayout from "./components/layout/AppLayout";
import { CallProvider } from "./context/CallContext";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check token validity
    const checkAuth = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // If token is invalid, clear localStorage
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <CallProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="calls" element={<Calls />} />
                <Route path="agents" element={<Agents />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </CallProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
