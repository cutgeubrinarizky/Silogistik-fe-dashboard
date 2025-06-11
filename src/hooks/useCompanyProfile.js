import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from '../utils/apiConfig';

export const useCompanyProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Cek apakah data perusahaan sudah diisi
  const checkCompanyProfile = async () => {
    try {
      setIsLoading(true);
      
      const API_BASE_URL = VITE_SUPABASE_URL;
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        console.error('Token tidak ditemukan');
        return false;
      }
      
      const response = await fetch(`${API_BASE_URL}/functions/v1/auth/checkCompanyProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Gagal memeriksa data perusahaan');
      }
      
      const data = await response.json();
      console.log('Response checkCompanyProfile:', data);
      
      // Periksa nilai hasCompanyProfile sesuai format response
      if (data.hasCompanyProfile === null) {
        return false; // Tidak ada profil perusahaan, perlu dibuat
      } else if (data.hasCompanyProfile === 1) {
        return true; // Profil perusahaan sudah ada
      } else {
        return false; // Default jika format tidak sesuai
      }
    } catch (error) {
      console.error('Error checking company profile:', error);
      toast.error('Gagal memeriksa data perusahaan');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Simpan data perusahaan
  const saveCompanyProfile = async (data) => {
    try {
      const API_BASE_URL = VITE_SUPABASE_URL;
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        console.error('Token tidak ditemukan');
        return false;
      }
      
      const response = await fetch(`${API_BASE_URL}/functions/v1/company/saveProfile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data perusahaan');
      }

      const responseData = await response.json();
      setCompanyData(responseData);
      toast.success('Data perusahaan berhasil disimpan');
      return true;
    } catch (error) {
      console.error('Error saving company profile:', error);
      toast.error('Gagal menyimpan data perusahaan');
      return false;
    }
  };

  // Update data perusahaan
  const updateCompanyProfile = async (data) => {
    try {
      const API_BASE_URL = VITE_SUPABASE_URL;
      const token = localStorage.getItem("access_token");
      
      if (!token) {
        console.error('Token tidak ditemukan');
        return false;
      }
      
      const response = await fetch(`${API_BASE_URL}/functions/v1/company/updateProfile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate data perusahaan');
      }

      const responseData = await response.json();
      setCompanyData(responseData);
      toast.success('Data perusahaan berhasil diupdate');
      return true;
    } catch (error) {
      console.error('Error updating company profile:', error);
      toast.error('Gagal mengupdate data perusahaan');
      return false;
    }
  };

  return {
    showModal,
    setShowModal,
    companyData,
    isLoading,
    checkCompanyProfile,
    saveCompanyProfile,
    updateCompanyProfile,
  };
}; 