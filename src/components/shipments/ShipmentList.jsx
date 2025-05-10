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

// Helper function to get status badge
const getStatusBadge = (status) => {
  const variants = {
    pickup: {
      label: "Pickup",
      variant: "warning",
      className: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
    },
    transit: {
      label: "Dalam Perjalanan",
      variant: "info",
      className: "bg-[#0C4A6E]/10 text-[#0C4A6E] border-[#0C4A6E]/20",
    },
    delivered: {
      label: "Terkirim",
      variant: "success",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    failed: {
      label: "Gagal",
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

const UpdateStatusModal = ({ shipment, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updateDate, setUpdateDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [notes, setNotes] = useState("");

  const statusHistory = [
    {
      status: "Pickup",
      date: "2023-05-01 09:30",
      description: "Paket telah di-pickup dari pengirim",
    },
    {
      status: "In Transit",
      date: "2023-05-02 14:15",
      description: "Paket dalam perjalanan",
    },
    {
      status: "Delivered",
      date: "2023-05-03 16:20",
      description: "Paket telah diterima oleh Budi",
    },
  ];

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case "pickup":
        return <Box className="h-4 w-4 text-[#FF6B2C]" />;
      case "in transit":
        return <Truck className="h-4 w-4 text-[#0C4A6E]" />;
      case "delivered":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const handleUpdate = () => {
    if (!selectedStatus) {
      toast.error("Silakan pilih status pengiriman");
      return;
    }
    onUpdate(shipment.id, {
      status: selectedStatus,
      date: updateDate,
      notes: notes,
    });
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] p-0">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-[#0C4A6E]">
              Update Status Pengiriman
            </h2>
          </div>

          {/* Nomor Resi */}
          <div className="mb-5">
            <div className="text-sm text-gray-500 mb-1.5">Nomor Resi</div>
            <div className="p-2.5 bg-gray-50 rounded-lg text-[#0C4A6E] font-medium text-sm">
              {shipment?.trackingNumber}
            </div>
          </div>

          <div className="grid grid-cols-[1fr,1.2fr] gap-6">
            {/* Form - Left Column */}
            <div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1.5">Status</div>
                  <Select
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="w-full bg-white border-gray-200 h-10 text-sm">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1.5">
                    Tanggal Update
                  </div>
                  <Input
                    type="date"
                    value={updateDate}
                    onChange={(e) => setUpdateDate(e.target.value)}
                    className="bg-white border-gray-200 h-10 text-sm"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1.5">Keterangan</div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Masukkan keterangan (opsional)"
                    className="min-h-[100px] bg-white border-gray-200 text-sm resize-none focus:ring-1 focus:ring-[#0C4A6E]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="h-9 px-4 text-sm font-medium hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white h-9 px-4 text-sm font-medium"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>

            {/* History Status - Right Column */}
            <div className="border-l pl-6">
              <div className="text-sm text-gray-500 mb-4">History Status</div>
              <div className="relative">
                {statusHistory.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-6 relative group">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                          index === statusHistory.length - 1
                            ? "bg-green-100 group-hover:bg-green-200"
                            : "bg-gray-100 group-hover:bg-gray-200"
                        }`}
                      >
                        {getStatusIcon(item.status)}
                      </div>
                      {index !== statusHistory.length - 1 && (
                        <div className="absolute top-7 left-3.5 w-[1px] h-12 bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                      )}
                    </div>
                    <div className="group-hover:bg-gray-50 p-2 rounded-lg transition-colors -ml-2 flex-1">
                      <div className="font-medium text-[#0C4A6E] text-sm">
                        {item.status === "pickup"
                          ? "Pickup"
                          : item.status === "transit"
                          ? "In Transit"
                          : item.status === "delivered"
                          ? "Delivered"
                          : item.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {item.date}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {item.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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

  const handleStatusUpdate = (id, updateData) => {
    onUpdateStatus(id, updateData.status);
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
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="transit">Dalam Perjalanan</SelectItem>
                <SelectItem value="delivered">Terkirim</SelectItem>
                <SelectItem value="failed">Gagal</SelectItem>
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
                <SelectItem value="Agus Subagyo">Agus Subagyo</SelectItem>
                <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                <SelectItem value="Citra Dewi">Citra Dewi</SelectItem>
                <SelectItem value="Dian Pratama">Dian Pratama</SelectItem>
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
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="dropoff">Drop-off</SelectItem>
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
                      Tidak ada data pengiriman
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
          shipment={selectedShipment}
          onClose={() => {
            setShowUpdateStatus(false);
            setSelectedShipment(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default ShipmentList;
