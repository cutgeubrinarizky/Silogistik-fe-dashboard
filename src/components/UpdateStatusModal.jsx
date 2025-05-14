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
import { Box, Truck, CheckCircle2, X, AlertTriangle } from "lucide-react";
import { toast } from "react-hot-toast";
import { VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY } from "@/utils/apiConfig";

const API_BASE_URL = VITE_SUPABASE_URL || "http://localhost:54321";

const UpdateStatusModal = ({ isOpen, onClose, shipment }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateDate, setUpdateDate] = useState("");
  const [notes, setNotes] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && shipment?.id) {
      fetchStatusHistory(shipment.id);
    }
  }, [isOpen, shipment]);

  const fetchStatusHistory = async (shipmentId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

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

      if (result.success) {
        setStatusHistory(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching status history:", error);
      toast.error("Gagal memuat history status");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pickup":
        return <Box className="h-5 w-5 text-[#FF6B2C]" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-[#0C4A6E]" />;
      case "delivered":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "failed":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
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
      };

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

      if (result.success) {
        toast.success("Status berhasil diperbarui");
        fetchStatusHistory(shipment.id);
        setSelectedStatus("");
        setUpdateDate("");
        setNotes("");
        onClose();
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
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
    } catch (error) {
      return dateString;
    }
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
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Nomor Resi</div>
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
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="in_transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
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
              {loading && (
                <div className="text-sm text-gray-500">Memuat history...</div>
              )}

              {!loading && statusHistory.length === 0 && (
                <div className="text-sm text-gray-500">
                  Belum ada history status
                </div>
              )}

              {!loading && statusHistory.length > 0 && (
                <div className="relative">
                  {statusHistory.map((item, index) => (
                    <div key={item.id} className="flex gap-4 mb-8 relative">
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
                          {item.status
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDateTime(item.created_at)}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {item.description}
                        </div>
                        {item.updated_by && (
                          <div className="text-xs text-gray-500 mt-1">
                            Oleh: {item.updated_by.name}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal;
