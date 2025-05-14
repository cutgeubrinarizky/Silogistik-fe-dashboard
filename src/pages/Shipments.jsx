import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ShipmentList from "@/components/shipments/ShipmentList";
import ArchivedShipments from "@/components/shipments/ArchivedShipments";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from "../utils/apiConfig";

const API_BASE_URL = VITE_SUPABASE_URL || "http://localhost:54321";

// API Service untuk Shipment
const ShipmentService = {
  // Mendapatkan semua data pengiriman
  getAllShipments: async (queryParams = {}) => {
    try {
      // Bangun query string dari parameter
      const queryString = new URLSearchParams(queryParams).toString();
      const url = `${API_BASE_URL}/functions/v1/shipment${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          apikey: VITE_SUPABASE_ANON_KEY,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengambil data pengiriman");
      }

      const result = await response.json();
      console.log("API Response raw:", result);

      // Struktur respons API:
      // { success, message, data: { shipments: [...], pagination: {...} } }
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

  // Mendapatkan pengiriman berdasarkan ID
  getShipmentById: async (id) => {
    try {
      if (!id) {
        throw new Error("ID pengiriman tidak valid");
      }

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

      const result = await response.json();
      console.log("API Response detail:", result);

      // Mengikuti struktur yang sama dengan getAllShipments
      // Namun di sini kita harapkan object shipment, bukan array
      return {
        data: result.data?.shipment || {},
        message: result.message || "",
        success: result.success !== false,
      };
    } catch (error) {
      console.error("Error fetching shipment details:", error);
      throw error;
    }
  },

  // Membuat pengiriman baru
  createShipment: async (data) => {
    try {
      // Menyesuaikan struktur data sesuai ekspektasi API
      const shipmentData = {
        tracking_number: data.tracking_number,
        sender_name: data.sender.name,
        sender_phone: data.sender.phone,
        sender_address: `${data.sender.address.street || ""}, ${
          data.sender.address.district
        }, ${data.sender.address.city}, ${data.sender.address.province}`.trim(),
        sender_city_id: data.sender_city_id || 1, // Default value jika tidak ada
        recipient_name: data.recipient.name,
        recipient_phone: data.recipient.phone,
        recipient_address: `${data.recipient.address.street || ""}, ${
          data.recipient.address.district
        }, ${data.recipient.address.city}, ${
          data.recipient.address.province
        }`.trim(),
        recipient_city_id: data.recipient_city_id || 2, // Default value jika tidak ada
        shipment_type: data.shipment_type,
        status: data.status || "pickup",
        courier_id: data.courier_id || data.courier,
        marketer_id: data.marketer_id || data.marketing,
        total_chargeable_weight: parseFloat(data.total_weight || 0),
        base_shipping_cost: parseFloat(data.total_cost || 0),
        discount: parseFloat(data.discount || 0),
        final_shipping_cost: parseFloat(data.final_cost || 0),
        is_archived: data.is_archived || false,
        notes: data.notes || "",
        payment_status: data.payment_status || "unpaid",
      };

      console.log("Data to be sent to API:", shipmentData);

      const response = await fetch(`${API_BASE_URL}/functions/v1/shipment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(shipmentData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal membuat pengiriman baru");
      }

      const result = await response.json();
      return {
        success: result.success,
        message: result.message,
        data: result.data?.shipment || {},
      };
    } catch (error) {
      console.error("Error creating shipment:", error);
      throw error;
    }
  },

  // Mengupdate data pengiriman
  updateShipment: async (id, data) => {
    try {
      // Menyesuaikan struktur data sesuai ekspektasi API
      const shipmentData = {
        tracking_number: data.tracking_number,
        sender_name: data.sender.name,
        sender_phone: data.sender.phone,
        sender_address: `${data.sender.address.street || ""}, ${
          data.sender.address.district
        }, ${data.sender.address.city}, ${data.sender.address.province}`.trim(),
        sender_city_id: data.sender_city_id || 1,
        recipient_name: data.recipient.name,
        recipient_phone: data.recipient.phone,
        recipient_address: `${data.recipient.address.street || ""}, ${
          data.recipient.address.district
        }, ${data.recipient.address.city}, ${
          data.recipient.address.province
        }`.trim(),
        recipient_city_id: data.recipient_city_id || 2,
        shipment_type: data.shipment_type,
        courier_id: data.courier_id || data.courier,
        marketer_id: data.marketer_id || data.marketing,
        total_chargeable_weight: parseFloat(data.total_weight || 0),
        base_shipping_cost: parseFloat(data.total_cost || 0),
        discount: parseFloat(data.discount || 0),
        final_shipping_cost: parseFloat(data.final_cost || 0),
        notes: data.notes || "",
      };

      console.log("Update data to be sent to API:", shipmentData);

      const response = await fetch(
        `${API_BASE_URL}/functions/v1/shipment?id=${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          body: JSON.stringify(shipmentData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengupdate pengiriman");
      }

      const result = await response.json();
      return {
        success: result.success,
        message: result.message,
        data: result.data?.shipment || {},
      };
    } catch (error) {
      console.error("Error updating shipment:", error);
      throw error;
    }
  },

  // Mengupdate status pengiriman
  updateShipmentStatus: async (id, status) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/functions/v1/shipment/status?id=${id}`,
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Gagal mengupdate status pengiriman"
        );
      }

      const result = await response.json();
      return {
        success: result.success,
        message: result.message,
        data: result.data?.shipment || {},
      };
    } catch (error) {
      console.error("Error updating shipment status:", error);
      throw error;
    }
  },

  // Mengarsipkan pengiriman
  archiveShipment: async (id, isArchived = true) => {
    try {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal mengarsipkan pengiriman");
      }

      const result = await response.json();
      return {
        success: result.success,
        message: result.message,
        data: result.data?.shipment || {},
      };
    } catch (error) {
      console.error("Error archiving shipment:", error);
      throw error;
    }
  },

  // Menghapus pengiriman
  deleteShipment: async (id) => {
    try {
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Gagal menghapus pengiriman");
      }

      const result = await response.json();
      return {
        success: result.success,
        message: result.message,
      };
    } catch (error) {
      console.error("Error deleting shipment:", error);
      throw error;
    }
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

  // Debug data struktur
  useEffect(() => {
    if (activeShipments) {
      console.log("Active Shipments Response:", activeShipments);
    }
    if (archivedShipments) {
      console.log("Archived Shipments Response:", archivedShipments);
    }
  }, [activeShipments, archivedShipments]);

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
