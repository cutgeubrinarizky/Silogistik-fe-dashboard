import React, { useEffect } from 'react';
import LabelGenerator from '@/components/labels/LabelGenerator';
import { useQuery } from '@tanstack/react-query';
import { VITE_SUPABASE_URL } from '../utils/apiConfig';

const API_BASE_URL = VITE_SUPABASE_URL;

// API Service untuk Shipment
const ShipmentService = {
  getAllShipments: async (queryParams = {}) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${API_BASE_URL}/functions/v1/shipment${
        queryString ? `?${queryString}` : ""
      }`;

      console.log("Fetching shipments from:", url);

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data pengiriman");
      }

      const result = await response.json();
      console.log("API Response:", result);

      return {
        data: result.data?.shipments || [],
        pagination: result.data?.pagination || {
          page: 1,
          pageSize: 10,
          total: 0,
          totalPages: 0,
        },
        message: result.message || "",
        success: result.success !== false,
      };
    } catch (error) {
      console.error("Error fetching shipments:", error);
      return {
        data: [],
        message: error.message,
        success: false,
        pagination: { page: 1, pageSize: 10, total: 0, totalPages: 0 },
      };
    }
  },
};

const Labels = () => {
  const { data: shipmentsData, isLoading, error } = useQuery({
    queryKey: ['shipments'],
    queryFn: () => ShipmentService.getAllShipments({ is_archived: false }),
  });

  // Debugging
  useEffect(() => {
    console.log("Shipments Data:", shipmentsData);
    console.log("Loading State:", isLoading);
    console.log("Error State:", error);
  }, [shipmentsData, isLoading, error]);

  // Debug token
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    console.log("Access Token:", token ? "Token exists" : "No token found");
  }, []);

  return (
    <div className="space-y-6">
      {/* <h1 className="text-3xl font-bold">Cetak Label & Invoice</h1> */}
      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Error: {error.message}
        </div>
      ) : (
        <LabelGenerator 
          shipments={shipmentsData?.data || []} 
          isLoading={isLoading} 
        />
      )}
    </div>
  );
};

export default Labels;
