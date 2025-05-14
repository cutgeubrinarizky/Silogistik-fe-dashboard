import React, { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Box,
  Truck,
  CheckCircle2,
  X,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from "@/utils/apiConfig";

const API_BASE_URL = VITE_SUPABASE_URL;

const UpdateStatusModal = ({ isOpen, onClose, shipment, onSuccess }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [updateDate, setUpdateDate] = useState(() => {
    // Membuat nilai default dengan waktu lokal yang benar
    const now = new Date();
    // Menggunakan metode yang mempertahankan zona waktu lokal
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    // Format: YYYY-MM-DDThh:mm dengan waktu lokal
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shipment?.id) {
      console.log("Fetching status history for shipment:", shipment);
      fetchStatusHistory(shipment.id);
    }
  }, [isOpen, shipment]);

  const fetchStatusHistory = async (shipmentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      console.log(
        `Fetching status history: ${API_BASE_URL}/functions/v1/shipment_status?shipment_id=${shipmentId}`
      );

      const response = await fetch(
        `${API_BASE_URL}/functions/v1/shipment_status?shipment_id=${shipmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apikey: VITE_SUPABASE_ANON_KEY,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengambil history status");
      }

      const result = await response.json();
      console.log("Status history response:", result);

      if (result.success) {
        // Data yang diterima dari API adalah array dari objek status history
        if (Array.isArray(result.data)) {
          console.log("Setting status history:", result.data);
          setStatusHistory(result.data);
        } else {
          console.error("Expected an array but received:", typeof result.data);
          setStatusHistory([]);
        }
      } else {
        console.error("API returned success=false:", result.message);
        setStatusHistory([]);
      }
    } catch (error) {
      console.error("Error fetching status history:", error);
      toast.error("Gagal memuat history status");
      setStatusHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "pickup":
      case "picked_up":
        return <Box className="h-5 w-5 text-[#FF6B2C]" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-[#0C4A6E]" />;
      case "pending_delivery":
        return <Clock className="h-5 w-5 text-[#0C4A6E]" />;
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "failed":
      case "failed_delivery":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedStatus) {
      toast.error("Status harus dipilih");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      const payload = {
        shipment_id: shipment.id,
        status: selectedStatus,
        description: notes,
        update_date: updateDate,
      };

      console.log("Submitting status update:", payload);

      const response = await fetch(
        `${API_BASE_URL}/functions/v1/shipment_status`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apikey: VITE_SUPABASE_ANON_KEY,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Gagal mengupdate status");
      }

      const result = await response.json();
      console.log("Status update response:", result);

      if (result.success) {
        toast.success("Status berhasil diperbarui");
        fetchStatusHistory(shipment.id);
        setSelectedStatus("");
        setNotes("");

        // Reset tanggal ke nilai default (waktu sekarang)
        const now = new Date();
        setUpdateDate(now.toISOString().slice(0, 16));

        if (typeof onSuccess === "function") {
          onSuccess(result.data);
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Gagal memperbarui status");
    } finally {
      setLoading(false);
    }
  };

  // Helper untuk memformat tanggal
  const formatDateTime = (dateString) => {
    try {
      if (!dateString) return "-";

      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return dateString || "-";
    }
  };

  // Helper untuk memformat status name
  const formatStatusName = (status) => {
    if (!status) return "";

    return status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  // Logging untuk debug
  useEffect(() => {
    console.log("Current status history state:", statusHistory);
  }, [statusHistory]);

  const renderHistoryContent = () => {
    if (loading) {
      return <div className="text-sm text-gray-500">Memuat history...</div>;
    }

    if (!statusHistory || statusHistory.length === 0) {
      return (
        <div className="text-sm text-gray-500">Belum ada history status</div>
      );
    }

    return (
      <div className="relative max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {statusHistory.map((item, index) => (
          <div key={item.id || index} className="flex gap-4 mb-8 relative">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index === 0 ? "bg-green-100" : "bg-gray-100"
                }`}
              >
                {getStatusIcon(item.status)}
              </div>
              {index !== statusHistory.length - 1 && (
                <div className="absolute top-8 left-4 w-0.5 h-16 bg-gray-200"></div>
              )}
            </div>
            <div>
              <div className="font-medium text-[#0C4A6E]">
                {formatStatusName(item.status)}
              </div>
              <div className="text-sm text-gray-500">
                {formatDateTime(item.created_at || item.update_date)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {item.description || "-"}
              </div>
              {item.updated_by && (
                <div className="text-xs text-gray-500 mt-1">
                  Oleh: {item.updated_by.name || "-"}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] p-0">
        <div className="p-6">
          {/* Header */}
          <h2 className="text-xl font-semibold text-[#0C4A6E]">
            Update Status Pengiriman
          </h2>

          {/* Nomor Resi */}
          <div className="mb-6 mt-4">
            <div className="p-3 bg-gray-50 rounded-lg text-[#0C4A6E] font-medium">
              {shipment?.trackingNumber ||
                shipment?.tracking_number ||
                "CGO123456"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Status</div>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="picked_up">Pickup</SelectItem>
                      <SelectItem value="pending_delivery">
                        Pending Delivery
                      </SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed_delivery">
                        Failed Delivery
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">
                    Tanggal Update
                  </div>
                  <Input
                    type="datetime-local"
                    value={updateDate}
                    onChange={(e) => setUpdateDate(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Keterangan</div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Masukkan keterangan (opsional)"
                    className="min-h-[120px] bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-4"
                    disabled={loading}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white px-4"
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Update Status"}
                  </Button>
                </div>
              </div>
            </div>

            {/* History Status */}
            <div className="border-l pl-8">
              <div className="text-sm text-gray-600 mb-4">History Status</div>
              {renderHistoryContent()}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
