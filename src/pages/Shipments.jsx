import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShipmentList from "@/components/shipments/ShipmentList";
import ArchivedShipments from "@/components/shipments/ArchivedShipments";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const API_BASE_URL =
  import.meta.env.VITE_SUPABASE_URL || "http://localhost:54321";

// API Service untuk Shipment
const ShipmentService = {
  // Mendapatkan semua data pengiriman
  getAllShipments: async (queryParams = {}) => {
    // Bangun query string dari parameter
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

    return response.json();
  },

  // Mendapatkan pengiriman berdasarkan ID
  getShipmentById: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengambil detail pengiriman");
    }

    return response.json();
  },

  // Membuat pengiriman baru
  createShipment: async (data) => {
    const response = await fetch(`${API_BASE_URL}/functions/v1/shipment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Gagal membuat pengiriman baru");
    }

    return response.json();
  },

  // Mengupdate data pengiriman
  updateShipment: async (id, data) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(data),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengupdate pengiriman");
    }

    return response.json();
  },

  // Mengupdate status pengiriman
  updateShipmentStatus: async (id, status) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ status }),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengupdate status pengiriman");
    }

    return response.json();
  },

  // Mengarsipkan pengiriman
  archiveShipment: async (id, isArchived = true) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({ is_archived: isArchived }),
      }
    );

    if (!response.ok) {
      throw new Error("Gagal mengarsipkan pengiriman");
    }

    return response.json();
  },

  // Menghapus pengiriman
  deleteShipment: async (id) => {
    const response = await fetch(
      `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal menghapus pengiriman");
    }

    return response.json();
  },
};

const Shipments = () => {
  const [activeTab, setActiveTab] = useState("active");
  const navigate = useNavigate();

  // Fetch data pengiriman aktif
  const {
    data: activeShipments,
    isLoading: isLoadingActive,
    error: errorActive,
    refetch: refetchActive,
  } = useQuery({
    queryKey: ["shipments", "active"],
    queryFn: () => ShipmentService.getAllShipments({ is_archived: false }),
    enabled: activeTab === "active",
  });

  // Fetch data pengiriman yang diarsipkan
  const {
    data: archivedShipments,
    isLoading: isLoadingArchived,
    error: errorArchived,
    refetch: refetchArchived,
  } = useQuery({
    queryKey: ["shipments", "archived"],
    queryFn: () => ShipmentService.getAllShipments({ is_archived: true }),
    enabled: activeTab === "archived",
  });

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
              <Package className="h-6 w-6 text-[#FF6B2C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0C4A6E]">
                Manajemen Pengiriman
              </h1>
              <p className="text-[#0C4A6E]/70 mt-1">
                Kelola semua pengiriman Anda dengan mudah dan efisien
              </p>
            </div>
          </div>
          <Button
            className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
            onClick={() => navigate("/shipments/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Buat Pengiriman
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <Tabs
          defaultValue="active"
          className="w-full"
          onValueChange={handleTabChange}
        >
          <div className="px-6 pt-6">
            <TabsList className="inline-flex p-1 gap-1 bg-gray-100/80 rounded-lg">
              <TabsTrigger
                value="active"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Pengiriman Aktif
              </TabsTrigger>
              <TabsTrigger
                value="archived"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Arsip
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="px-6 py-6">
            <TabsContent value="active" className="mt-0">
              <ShipmentList
                shipments={activeShipments?.data || []}
                isLoading={isLoadingActive}
                error={errorActive}
                refetch={refetchActive}
                onArchive={(id) =>
                  ShipmentService.archiveShipment(id, true).then(() =>
                    refetchActive()
                  )
                }
                onUpdateStatus={(id, status) =>
                  ShipmentService.updateShipmentStatus(id, status).then(() =>
                    refetchActive()
                  )
                }
                onDelete={(id) =>
                  ShipmentService.deleteShipment(id).then(() => refetchActive())
                }
              />
            </TabsContent>
            <TabsContent value="archived" className="mt-0">
              <ArchivedShipments
                shipments={archivedShipments?.data || []}
                isLoading={isLoadingArchived}
                error={errorArchived}
                refetch={refetchArchived}
                onUnarchive={(id) =>
                  ShipmentService.archiveShipment(id, false).then(() => {
                    refetchArchived();
                    refetchActive();
                  })
                }
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Shipments;
