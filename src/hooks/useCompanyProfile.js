import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export const useCompanyProfile = () => {
  const [showModal, setShowModal] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cek apakah data perusahaan sudah diisi
  const checkCompanyProfile = async () => {
    try {
      setIsLoading(true);
      // TODO: Implementasi API call untuk mengecek data perusahaan
      const response = await fetch('/api/company-profile');
      const data = await response.json();

      if (!data || !data.companyName) {
        return false;
      } else {
        setCompanyData(data);
        return true;
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
      // TODO: Implementasi API call untuk menyimpan data
      const response = await fetch('/api/company-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Gagal menyimpan data perusahaan');
      }

      setCompanyData(data);
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
      // TODO: Implementasi API call untuk update data
      const response = await fetch('/api/company-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Gagal mengupdate data perusahaan');
      }

      setCompanyData(data);
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