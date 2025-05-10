import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import ShipmentForm from "./components/shipments/ShipmentForm";
import Employees from "./pages/Employees";
import Labels from "./pages/Labels";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";
import ShippingRates from "./pages/ShippingRates";
import Finance from "./pages/Finance";
import Login from "./pages/Login";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Komponen untuk memeriksa autentikasi
const AuthGuard = ({ children }) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Redirect ke halaman login jika tidak ada token
    return <Navigate to="/login" replace />;
  }

  // Cek apakah token sudah kadaluarsa
  const expiresAt = localStorage.getItem("expires_at");
  if (expiresAt && new Date().getTime() > parseInt(expiresAt)) {
    // Token kadaluarsa, hapus token dan redirect ke login
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("expires_at");
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  const [isReady, setIsReady] = useState(false);

  // Memastikan semua state terhidrolasi sebelum rendering
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null; // Atau tampilkan loading spinner
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Rute publik */}
            <Route path="/login" element={<Login />} />

            {/* Rute terproteksi */}
            <Route
              path="/"
              element={
                // <AuthGuard>
                  <Layout>
                    <Dashboard />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/shipments"
              element={
                // <AuthGuard>
                  <Layout>
                    <Shipments />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/shipments/new"
              element={
                // <AuthGuard>
                  <Layout>
                    <ShipmentForm />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/shipping-rates"
              element={
                // <AuthGuard>
                  <Layout>
                    <ShippingRates />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/finance"
              element={
                // <AuthGuard>
                  <Layout>
                    <Finance />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/employees"
              element={
                // <AuthGuard>
                  <Layout>
                    <Employees />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/labels"
              element={
                // <AuthGuard>
                  <Layout>
                    <Labels />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/reports"
              element={
                // <AuthGuard>
                  <Layout>
                    <Reports />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/settings"
              element={
                // <AuthGuard>
                  <Layout>
                    <Settings />
                  </Layout>
                // </AuthGuard>
              }
            />
            <Route
              path="/users"
              element={
                // <AuthGuard>
                  <Layout>
                    <Users />
                  </Layout>
                // </AuthGuard>
              }
            />

            {/* Rute not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
