import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  VITE_SUPABASE_ANON_KEY,
  VITE_SUPABASE_URL,
  VITE_SUPABASE_SERVICE_ROLE_KEY,
} from "../utils/apiConfig";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Cek apakah user sudah login saat komponen dimuat
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Email dan password harus diisi");
      return;
    }

    setIsLoading(true);

    //login supabase
    try {
      const API_BASE_URL = VITE_SUPABASE_URL || "http://localhost:54321";

      const response = await fetch(
        `${API_BASE_URL}/auth/v1/token?grant_type=password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: VITE_SUPABASE_ANON_KEY, // Menambahkan header apikey
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_description || data.error || "Login gagal");
      }

      // Simpan token ke localStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Tambahkan ekspirasi token jika ada
      if (data.expires_in) {
        const expiresAt = new Date().getTime() + data.expires_in * 1000;
        localStorage.setItem("expires_at", expiresAt.toString());
      }

      // Tambahkan data user jika ada
      if (data.tenant_info) {
        localStorage.setItem("tenant_info", JSON.stringify(data.tenant_info));
      }
      if (data.user) {
        const roleId = data.user.user_metadata.role_id || 1;
        const userInfo = data.user.user_metadata;
        localStorage.setItem("role", JSON.stringify(roleId));
        localStorage.setItem("user", JSON.stringify(userInfo));
      }

      toast.success("Login berhasil");
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Terjadi kesalahan saat login");
    } finally {
      setIsLoading(false);
    }
  };

  //   try {
  //     const API_BASE_URL = VITE_SUPABASE_URL || "http://localhost:54321";

  //     const response = await fetch(`${API_BASE_URL}/functions/v1/auth/login`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         // apikey: VITE_SUPABASE_SERVICE_ROLE_KEY,
  //       },
  //       body: JSON.stringify({
  //         email,
  //         password,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       throw new Error(data.error_description || data.error || "Login gagal");
  //     }

  //     // Simpan token ke localStorage
  //     localStorage.setItem("access_token", data.data.access_token);
  //     localStorage.setItem("refresh_token", data.data.refresh_token);

  //     // Tambahkan ekspirasi token jika ada
  //     if (data.data.expires_in) {
  //       const expiresAt = new Date().getTime() + data.data.expires_in * 1000;
  //       localStorage.setItem("expires_at", expiresAt.toString());
  //     }

  //     // Tambahkan data user jika ada
  //     if (data.data.tenant_info) {
  //       localStorage.setItem(
  //         "tenant_info",
  //         JSON.stringify(data.data.tenant_info)
  //       );
  //     }

  //     toast.success("Login berhasil");
  //     navigate("/");
  //   } catch (error) {
  //     console.error("Login error:", error);
  //     toast.error(error.message || "Terjadi kesalahan saat login");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <Card className="mx-auto w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center mb-6">
            <img
              src="/images/logosilogistik.png"
              alt="SiLogistik Logo"
              className="h-16"
              onError={(e) => {
                e.target.src =
                  "https://placehold.co/200x80/FF6B2C/white?text=SiLogistik";
              }}
            />
          </div>
          <CardTitle className="text-2xl font-bold text-[#0C4A6E]">
            Selamat Datang di Cargo Pilot
          </CardTitle>
          <p className="text-sm text-[#0C4A6E]/70">
            Masukkan kredensial Anda untuk mengakses dashboard
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0C4A6E]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-gray-200"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#0C4A6E]">
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs text-[#FF6B2C] hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    toast.info(
                      "Silakan hubungi administrator untuk reset password"
                    );
                  }}
                >
                  Lupa password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-gray-200"
                required
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
