import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Banknote, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import TransactionList from "@/components/finance/TransactionList";
import DebtList from "@/components/finance/DebtList";
import FinancialReport from "@/components/finance/FinancialReport";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import BillList from "@/components/finance/BillList";
import { VITE_SUPABASE_URL } from "../utils/apiConfig";

const API_BASE_URL = VITE_SUPABASE_URL || "http://localhost:54321";

// API Service untuk Shipment
const ShipmentService = {
  getAllShipments: async (queryParams = {}) => {
    try {
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${API_BASE_URL}/functions/v1/shipment${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data pengiriman");
      }

      const result = await response.json();
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

  updatePaymentStatus: async (paymentData) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/functions/v1/shipment/payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengupdate status pembayaran");
      }

      const result = await response.json();
      return {
        success: result.success,
        message: result.message,
        data: result.data,
      };
    } catch (error) {
      console.error("Error updating payment status:", error);
      throw error;
    }
  },
};

const Finance = () => {
  const [activeTab, setActiveTab] = useState("report");
  const navigate = useNavigate();

  // Fetch data pengiriman untuk transaksi dan tagihan
  const {
    data: shipmentsData,
    isLoading: isLoadingShipments,
    error: errorShipments,
    refetch: refetchShipments,
  } = useQuery({
    queryKey: ["shipments", "finance"],
    queryFn: () => ShipmentService.getAllShipments(),
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  const handleUpdatePayment = async (id, updateData) => {
    try {
      // Implementasi update pembayaran ke API
      const response = await fetch(
        `${API_BASE_URL}/functions/v1/shipment/${id}/payment`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengupdate pembayaran");
      }

      // Refresh data setelah update
      refetchShipments();
    } catch (error) {
      console.error("Error updating payment:", error);
      throw error;
    }
  };

  if (isLoadingShipments) {
    return <div>Memuat data...</div>;
  }

  if (errorShipments) {
    return <div>Error: {errorShipments.message}</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
              <Banknote className="h-6 w-6 text-[#FF6B2C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0C4A6E]">
                Manajemen Keuangan
              </h1>
              <p className="text-[#0C4A6E]/70 mt-1">
                Kelola semua transaksi keuangan Anda dengan mudah dan efisien
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <Tabs
          defaultValue="report"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <div className="px-6 pt-6">
            <TabsList className="inline-flex p-1 gap-1 bg-gray-100/80 rounded-lg">
              <TabsTrigger
                value="report"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Laporan Keuangan
              </TabsTrigger>
              <TabsTrigger
                value="transactions"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Transaksi & Invoice
              </TabsTrigger>
              <TabsTrigger
                value="bills"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Tagihan & Hutang
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="px-6 py-6">
            <TabsContent value="report" className="mt-0">
              <FinancialReport />
            </TabsContent>
            <TabsContent value="transactions" className="mt-0">
              <TransactionList />
            </TabsContent>
            <TabsContent value="bills" className="mt-0">
              <BillList
                bills={shipmentsData?.data || []}
                onUpdatePayment={handleUpdatePayment}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Finance;
