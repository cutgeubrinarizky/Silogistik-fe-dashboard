import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Filter,
  MoreHorizontal,
  RefreshCcw,
  Edit,
  Printer,
  Trash2,
  CheckCircle,
  PackageCheck,
  Copy,
  ArrowRightLeft,
  Package,
  Download,
  X,
  Box,
  Truck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import ShipmentLabel from "./ShipmentLabel";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import UpdatePaymentModal from "../finance/UpdatePaymentModal";
import UpdateStatusModal from "../UpdateStatusModal";

// Helper function to get status badge
const getStatusBadge = (status) => {
  const variants = {
    picked_up: {
      label: "Sedang di Pickup",
      variant: "warning",
      className: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
    },
    pending_delivery: {
      label: "Menunggu Pengiriman",
      variant: "warning",
      className: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
    },
    in_transit: {
      label: "Dalam Perjalanan",
      variant: "info",
      className: "bg-[#0C4A6E]/10 text-[#0C4A6E] border-[#0C4A6E]/20",
    },
    delivered: {
      label: "Terkirim",
      variant: "success",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    failed_delivery: {
      label: "Pengiriman Gagal",
      variant: "destructive",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const statusInfo = variants[status] || {
    label: status,
    variant: "default",
    className: "",
  };

  return (
    <Badge variant={statusInfo.variant} className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

const ShipmentList = ({
  shipments = [],
  isLoading,
  error,
  refetch,
  onArchive,
  onUpdateStatus,
  onDelete,
  onUpdatePayment,
}) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    status: "all",
    courier: "all",
    type: "all",
  });
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showLabel, setShowLabel] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);
  const navigate = useNavigate();

  // Debug untuk memeriksa struktur data
  useEffect(() => {
    console.log("ShipmentList received shipments:", shipments);
  }, [shipments]);

  const handleDuplicate = (shipment) => {
    const { trackingNumber, ...shipmentData } = shipment;
    navigate("/shipments/new", {
      state: { shipment: shipmentData, duplicate: true },
    });
  };

  const handleEdit = (shipment, e) => {
    e.stopPropagation();
    navigate("/shipments/new", {
      state: {
        shipment,
        isEdit: true,
      },
    });
  };

  const handlePrint = (shipment, e) => {
    e.stopPropagation();
    setSelectedShipment(shipment);
    setShowLabel(true);
  };

  const handleUpdateStatus = (shipment, e) => {
    e.stopPropagation();
    setSelectedShipment(shipment);
    setShowUpdateStatus(true);
  };

  const handleStatusUpdated = () => {
    // Setelah status diperbarui, refresh data
    refetch();
    setShowUpdateStatus(false);
    setSelectedShipment(null);
    toast.success("Status pengiriman berhasil diperbarui");
  };

  const handlePaymentUpdate = (id, updateData) => {
    onUpdatePayment(id, updateData);
    toast.success("Pembayaran berhasil diupdate");
  };

  const handleUpdatePayment = (shipment, e) => {
    e.stopPropagation();
    setSelectedShipment(shipment);
    setShowUpdatePayment(true);
  };

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin menghapus pengiriman ini?")) {
      onDelete(id);
      toast.success("Pengiriman berhasil dihapus");
    }
  };

  const handleArchive = (id, e) => {
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin mengarsipkan pengiriman ini?")) {
      onArchive(id);
      toast.success("Pengiriman berhasil diarsipkan");
    }
  };

  // Helper function untuk menghitung total berat
  const calculateTotalWeight = (items = []) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce(
      (sum, item) =>
        sum + Number(item.weight || 0) * Number(item.quantity || 1),
      0
    );
  };

  // Ensure shipments is an array
  const shipmentsArray = Array.isArray(shipments) ? shipments : [];
  console.log("ShipmentList processed shipments:", shipmentsArray);

  // Filter shipments berdasarkan search dan filter
  const filteredShipments = shipmentsArray.filter(
    (s) =>
      (filter.status === "all" || s.status === filter.status) &&
      (filter.courier === "all" ||
        (s.courier?.users?.name || s.courier) === filter.courier) &&
      (filter.type === "all" || s.shipment_type === filter.type) &&
      ((s.tracking_number || "").toLowerCase().includes(search.toLowerCase()) ||
        (s.sender_name || s.sender?.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        (s.recipient_name || s.recipient?.name || "")
          .toLowerCase()
          .includes(search.toLowerCase()))
  );

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">Terjadi kesalahan: {error.message}</p>
        <Button onClick={refetch} className="mt-4 bg-[#0C4A6E]">
          <RefreshCcw className="h-4 w-4 mr-2" /> Coba Lagi
        </Button>
      </div>
    );
  }

  return (
    <>
      <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <CardTitle className="text-[#0C4A6E] text-xl font-semibold">
              Daftar Pengiriman
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
              <Input
                placeholder="Cari pengiriman..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-56 border-0 bg-transparent focus:ring-0 placeholder:text-gray-400 text-sm"
              />
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 text-gray-400 hover:text-[#FF6B2C]"
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            <Select
              value={filter.status}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="picked_up">Pickup</SelectItem>
                <SelectItem value="in_transit">Dalam Perjalanan</SelectItem>
                <SelectItem value="delivered">Terkirim</SelectItem>
                <SelectItem value="failed_delivery">Gagal</SelectItem>
                <SelectItem value="pending_delivery">
                  Menunggu Pengiriman
                </SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filter.courier}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, courier: value }))
              }
            >
              <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
                <SelectValue placeholder="Kurir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kurir</SelectItem>
                {Array.from(
                  new Set(
                    shipmentsArray
                      .map((s) => s.courier?.users?.name || s.courier)
                      .filter(Boolean)
                  )
                ).map((courier) => (
                  <SelectItem key={courier} value={courier}>
                    {courier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filter.type}
              onValueChange={(value) =>
                setFilter((prev) => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
                <SelectValue placeholder="Jenis Kiriman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                {Array.from(
                  new Set(
                    shipmentsArray.map((s) => s.shipment_type).filter(Boolean)
                  )
                ).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type === "pickup"
                      ? "Pickup"
                      : type === "dropoff"
                      ? "Drop-off"
                      : type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4 h-9"
              asChild
            >
              <Link to="/shipments/new">+ Pengiriman Baru</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#0C4A6E]" />
              <span className="ml-3 text-[#0C4A6E]">Memuat data...</span>
            </div>
          ) : shipmentsArray.length === 0 ? (
            <div className="text-center py-20">
              <Package className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-1">
                Belum ada data pengiriman
              </h3>
              <p className="text-gray-500 mb-4">
                Silakan tambahkan pengiriman baru untuk mulai mengelola
                pengiriman Anda
              </p>
              {/* <Button
                className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4"
                asChild
              >
                <Link to="/shipments/new">+ Pengiriman Baru</Link>
              </Button> */}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-gray-100 hover:bg-transparent">
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Nomor Resi
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Pengirim
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Penerima
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Kota Asal
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Kota Tujuan
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Status
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Berat
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Kurir
                  </TableHead>
                  <TableHead className="text-[#0C4A6E]/70 font-medium">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredShipments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="text-center py-10 text-gray-500"
                    >
                      Tidak ada data pengiriman yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredShipments.map((shipment) => (
                    <TableRow
                      key={shipment.id}
                      className="cursor-pointer hover:bg-gray-50/80 transition-all border-b border-gray-100"
                      onClick={() => navigate(`/shipments/${shipment.id}`)}
                    >
                      <TableCell className="font-medium text-[#0C4A6E]">
                        {shipment.tracking_number}
                      </TableCell>
                      <TableCell className="text-[#0C4A6E]/80">
                        {shipment.sender_name || shipment.sender?.name}
                      </TableCell>
                      <TableCell className="text-[#0C4A6E]/80">
                        {shipment.recipient_name || shipment.recipient?.name}
                      </TableCell>
                      <TableCell className="text-[#0C4A6E]/80">
                        {shipment.sender_city?.name ||
                          shipment.sender?.address?.city}
                      </TableCell>
                      <TableCell className="text-[#0C4A6E]/80">
                        {shipment.recipient_city?.name ||
                          shipment.recipient?.address?.city}
                      </TableCell>
                      <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                      <TableCell className="text-[#0C4A6E]/80">
                        {shipment.total_chargeable_weight ||
                          calculateTotalWeight(shipment.items || [])}{" "}
                        kg
                      </TableCell>
                      <TableCell className="text-[#0C4A6E]/80">
                        {shipment.courier?.users?.name || shipment.courier}
                      </TableCell>
                      <TableCell className="text-[#0C4A6E]/80">
                        {shipment.created_at
                          ? new Date(shipment.created_at).toLocaleDateString(
                              "id-ID"
                            )
                          : shipment.date
                          ? new Date(shipment.date).toLocaleDateString("id-ID")
                          : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(shipment, e);
                            }}
                            title="Update Status"
                          >
                            <ArrowRightLeft className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                            onClick={(e) => handleUpdatePayment(shipment, e)}
                            title="Update Pembayaran"
                          >
                            <PackageCheck className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 hover:bg-gray-100 text-[#0C4A6E]/70 hover:text-[#0C4A6E]"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem
                                onClick={(e) => handleEdit(shipment, e)}
                                className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                              >
                                <Edit className="mr-2 h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => handlePrint(shipment, e)}
                                className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                              >
                                <Printer className="mr-2 h-4 w-4" /> Cetak Label
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicate(shipment);
                                }}
                                className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                              >
                                <Copy className="mr-2 h-4 w-4" /> Duplikat
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleArchive(shipment.id, e);
                                }}
                                className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                              >
                                <PackageCheck className="mr-2 h-4 w-4" />{" "}
                                Arsipkan
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(shipment.id, e);
                                }}
                                className="text-red-600 hover:text-red-700 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {showLabel && selectedShipment && (
        <ShipmentLabel
          shipment={selectedShipment}
          onClose={() => {
            setShowLabel(false);
            setSelectedShipment(null);
          }}
        />
      )}

      {showUpdateStatus && selectedShipment && (
        <UpdateStatusModal
          isOpen={showUpdateStatus}
          onClose={() => {
            setShowUpdateStatus(false);
            setSelectedShipment(null);
          }}
          shipment={selectedShipment}
          onSuccess={handleStatusUpdated}
        />
      )}

      {showUpdatePayment && selectedShipment && (
        <UpdatePaymentModal
          shipment={selectedShipment}
          onClose={() => {
            setShowUpdatePayment(false);
            setSelectedShipment(null);
          }}
          onUpdate={handlePaymentUpdate}
        />
      )}
    </>
  );
};

export default ShipmentList;
