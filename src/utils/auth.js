/**
 * File ini berisi fungsi-fungsi untuk membantu penanganan autentikasi
 */
import { VITE_SUPABASE_URL } from "./apiConfig";
/**
 * Memeriksa apakah pengguna sudah login
 * @returns {boolean} - true jika pengguna sudah login
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return false;
  
  // Cek apakah token sudah kadaluarsa
  const expiresAt = localStorage.getItem("expires_at");
  if (expiresAt && new Date().getTime() > parseInt(expiresAt)) {
    // Token kadaluarsa, coba refresh token
    refreshToken().catch(() => {
      // Jika refresh gagal, hapus token yang ada
      clearAuthData();
    });
    return false;
  }
  
  return true;
};

/**
 * Mendapatkan token akses
 * @returns {string|null} - Token akses atau null jika tidak ada
 */
export const getAccessToken = () => {
  return localStorage.getItem("access_token");
};

/**
 * Mendapatkan data pengguna
 * @returns {Object|null} - Data pengguna atau null jika tidak ada
 */
export const getUserData = () => {
  const userData = localStorage.getItem("user");
  if (userData) {
    try {
      return JSON.parse(userData);
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return null;
};

/**
 * Melakukan refresh token
 * @returns {Promise<boolean>} - Promise yang resolve ke true jika refresh berhasil
 */
export const refreshToken = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    return false;
  }
  
  try {
    const API_BASE_URL = VITE_SUPABASE_URL || "http://localhost:54321";

    const response = await fetch(`${API_BASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh_token: refreshToken
      }),
    });
    
    if (!response.ok) {
      throw new Error("Failed to refresh token");
    }
    
    const data = await response.json();
    
    // Simpan token baru ke localStorage
    localStorage.setItem("access_token", data.access_token);
    
    if (data.refresh_token) {
      localStorage.setItem("refresh_token", data.refresh_token);
    }
    
    if (data.expires_in) {
      const expiresAt = new Date().getTime() + data.expires_in * 1000;
      localStorage.setItem("expires_at", expiresAt.toString());
    }
    
    return true;
  } catch (error) {
    console.error("Error refreshing token:", error);
    return false;
  }
};

/**
 * Menghapus semua data autentikasi
 */
export const clearAuthData = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expires_at");
  localStorage.removeItem("user");
};

/**
 * Mendapatkan header autentikasi untuk API request
 * @returns {Object} - Header dengan token autentikasi
 */
export const getAuthHeaders = () => {
  const token = getAccessToken();
  return {
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/**
 * Cek izin pengguna (contoh implementasi sederhana)
 * @param {string} permission - Izin yang ingin diperiksa
 * @returns {boolean} - true jika pengguna memiliki izin
 */
export const hasPermission = (permission) => {
  const user = getUserData();
  if (!user) return false;
  
  // Implementasi sederhana berdasarkan role
  // Untuk implementasi lebih kompleks, sesuaikan dengan struktur data dan kebutuhan
  const role = user.role || user.user_metadata?.role;
  
  switch (role) {
    case "super_admin":
      return true; // Super admin memiliki semua izin
    case "admin":
      // Admin memiliki semua izin kecuali beberapa izin tertentu
      return permission !== "delete_shipping_rate";
    case "viewer":
      // Viewer hanya memiliki izin melihat
      return permission.startsWith("view_");
    default:
      return false;
  }
}; 