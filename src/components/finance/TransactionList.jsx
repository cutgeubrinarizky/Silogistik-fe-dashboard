import React, { useState } from "react";
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
  Edit,
  Printer,
  Trash2,
  FileText,
  Plus,
  Download,
  Search,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { VITE_SUPABASE_URL } from "../../utils/apiConfig";

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
};

// Helper function untuk mendapatkan badge status
const getStatusBadge = (status) => {
  const variants = {
    unpaid: {
      label: "Belum Lunas",
      className: "bg-red-100 text-red-700 border-red-200",
    },
    partial: {
      label: "Cicilan",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    paid: {
      label: "Lunas",
      className: "bg-green-100 text-green-700 border-green-200",
    },
  };

  const statusInfo = variants[status] || {
    label: status,
    className: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <Badge variant="outline" className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

// Helper function untuk mendapatkan badge tipe transaksi
const getTransactionTypeBadge = (type) => {
  const variants = {
    income: {
      label: "Pemasukan",
      variant: "success",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    expense: {
      label: "Pengeluaran",
      variant: "destructive",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

  const typeInfo = variants[type] || {
    label: type,
    variant: "default",
    className: "",
  };

  return (
    <Badge variant={typeInfo.variant} className={typeInfo.className}>
      {typeInfo.label}
    </Badge>
  );
};

// Helper function untuk mendapatkan badge kategori
const getCategoryBadge = (category) => {
  const variants = {
    invoice: {
      label: "Invoice",
      variant: "default",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    operasional: {
      label: "Operasional",
      variant: "default",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    gaji: {
      label: "Gaji",
      variant: "default",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    bbm: {
      label: "BBM",
      variant: "default",
      className: "bg-orange-100 text-orange-700 border-orange-200",
    },
    maintenance: {
      label: "Maintenance",
      variant: "default",
      className: "bg-pink-100 text-pink-700 border-pink-200",
    },
    lainnya: {
      label: "Lainnya",
      variant: "default",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    },
  };

  const categoryInfo = variants[category] || {
    label: category,
    variant: "default",
    className: "",
  };

  return (
    <Badge variant={categoryInfo.variant} className={categoryInfo.className}>
      {categoryInfo.label}
    </Badge>
  );
};

// Helper function untuk mendapatkan badge metode pembayaran
const getPaymentMethodBadge = (method) => {
  const variants = {
    cash: {
      label: "Tunai",
      variant: "default",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    transfer: {
      label: "Transfer",
      variant: "default",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    qris: {
      label: "QRIS",
      variant: "default",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
  };

  const methodInfo = variants[method] || {
    label: method,
    variant: "default",
    className: "",
  };

  return (
    <Badge variant={methodInfo.variant} className={methodInfo.className}>
      {methodInfo.label}
    </Badge>
  );
};

const TransactionList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const navigate = useNavigate();

  // Fetch data pengiriman untuk transaksi
  const {
    data: shipmentsData,
    isLoading: isLoadingShipments,
    error: errorShipments,
  } = useQuery({
    queryKey: ["shipments", "transactions"],
    queryFn: () => ShipmentService.getAllShipments(),
  });

  // Transform data pengiriman menjadi format transaksi
  const transformShipmentsToTransactions = (shipments) => {
    return shipments.map((shipment) => ({
      id: shipment.id,
      date: shipment.created_at,
      description: `Pembayaran pengiriman ${shipment.tracking_number} (${shipment.service_type})`,
      amount: shipment.final_shipping_cost,
      type: "income",
      status: shipment.payment_status,
      category: "Pengiriman",
      tracking_number: shipment.tracking_number,
      recipient_name: shipment.recipient_name,
      service_type: shipment.service_type,
      origin: shipment.origin,
      destination: shipment.destination,
      weight: shipment.weight,
    }));
  };

  const transactions = shipmentsData?.data
    ? transformShipmentsToTransactions(shipmentsData.data)
    : [];

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.tracking_number
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.recipient_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || transaction.type === filterType;
    const matchesCategory =
      filterCategory === "all" || transaction.category === filterCategory;
    const matchesStatus =
      filterStatus === "all" || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesCategory && matchesStatus;
  });

  const handleEdit = (transaction) => {
    navigate("/finance/transactions/edit", { state: { transaction } });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      // Implementasi hapus transaksi
      toast.success("Transaksi berhasil dihapus");
    }
  };

  const handlePrint = (transaction) => {
    // Implementasi cetak bukti transaksi
    toast.success("Mencetak bukti transaksi...");
  };

  const handleDownload = (transaction) => {
    // Implementasi download bukti transaksi
    toast.success("Mengunduh bukti transaksi...");
  };

  if (isLoadingShipments) {
    return <div>Memuat data...</div>;
  }

  if (errorShipments) {
    return <div>Error: {errorShipments.message}</div>;
  }

  return (
    <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <CardTitle className="text-[#0C4A6E] text-xl font-semibold">
            Daftar Transaksi
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari transaksi..."
              className="w-56 border-0 bg-transparent focus:ring-0 placeholder:text-gray-400 text-sm pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select
            value={filterType}
            onValueChange={(value) => setFilterType(value)}
          >
            <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="income">Pemasukan</SelectItem>
              <SelectItem value="expense">Pengeluaran</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterCategory}
            onValueChange={(value) => setFilterCategory(value)}
          >
            <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="invoice">Invoice</SelectItem>
              <SelectItem value="operasional">Operasional</SelectItem>
              <SelectItem value="gaji">Gaji</SelectItem>
              <SelectItem value="bbm">BBM</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterStatus}
            onValueChange={(value) => setFilterStatus(value)}
          >
            <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="unpaid">Belum Lunas</SelectItem>
              <SelectItem value="partial">Cicilan</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4 h-9"
            asChild
          >
            <Link to="/finance/transactions/new">
              <Plus className="h-4 w-4 mr-2" />
              Transaksi Baru
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Tanggal
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Deskripsi
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                No. Resi
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Penerima
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Kategori
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Jumlah
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Status
              </TableHead>
              <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  Tidak ada data transaksi
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
                >
                  <TableCell className="text-[#0C4A6E]/80">
                    {new Date(transaction.date).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {transaction.description}
                  </TableCell>
                  <TableCell>{transaction.tracking_number}</TableCell>
                  <TableCell>{transaction.recipient_name}</TableCell>
                  <TableCell>
                    {getCategoryBadge(transaction.category)}
                  </TableCell>
                  <TableCell
                    className={`font-medium ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    Rp {transaction.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handlePrint(transaction)}
                        title="Cetak Bukti"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handleDownload(transaction)}
                        title="Download Bukti"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100 text-[#0C4A6E]/70 hover:text-[#0C4A6E]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleEdit(transaction)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePrint(transaction)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" /> Cetak Bukti
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(transaction.id)}
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
      </CardContent>
    </Card>
  );
};

export default TransactionList;
