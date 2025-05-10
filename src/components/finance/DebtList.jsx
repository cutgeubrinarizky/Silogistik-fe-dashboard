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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Helper function untuk mendapatkan badge status
const getStatusBadge = (status) => {
  const variants = {
    pending: {
      label: "Belum Lunas",
      variant: "warning",
      className: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
    },
    paid: {
      label: "Lunas",
      variant: "success",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    overdue: {
      label: "Jatuh Tempo",
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

// Helper function untuk mendapatkan badge tipe hutang
const getDebtTypeBadge = (type) => {
  const variants = {
    supplier: {
      label: "Supplier",
      variant: "default",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    vendor: {
      label: "Vendor",
      variant: "default",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    bank: {
      label: "Bank",
      variant: "default",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    lainnya: {
      label: "Lainnya",
      variant: "default",
      className: "bg-gray-100 text-gray-700 border-gray-200",
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

const DebtList = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    type: "all",
    status: "all",
  });
  const navigate = useNavigate();

  // Data dummy untuk contoh
  const [debts] = useState([
    {
      id: 1,
      date: "2024-03-20",
      dueDate: "2024-04-20",
      description: "Pembayaran supplier bahan baku",
      amount: 5000000,
      type: "supplier",
      status: "pending",
      creditor: "PT. Supplier Jaya",
    },
    {
      id: 2,
      date: "2024-03-19",
      dueDate: "2024-04-19",
      description: "Pembayaran vendor jasa",
      amount: 2500000,
      type: "vendor",
      status: "paid",
      creditor: "CV. Vendor Sukses",
    },
    // Tambahkan data dummy lainnya
  ]);

  const handleEdit = (debt) => {
    navigate("/finance/debts/edit", { state: { debt } });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus data hutang ini?")) {
      // Implementasi hapus hutang
      toast.success("Data hutang berhasil dihapus");
    }
  };

  const handlePrint = (debt) => {
    // Implementasi cetak bukti hutang
    toast.success("Mencetak bukti hutang...");
  };

  const handleDownload = (debt) => {
    // Implementasi download bukti hutang
    toast.success("Mengunduh bukti hutang...");
  };

  // Filter hutang berdasarkan pencarian dan filter
  const filteredDebts = debts.filter(
    (d) =>
      (filter.type === "all" || d.type === filter.type) &&
      (filter.status === "all" || d.status === filter.status) &&
      (d.description.toLowerCase().includes(search.toLowerCase()) ||
        d.creditor.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <CardTitle className="text-[#0C4A6E] text-xl font-semibold">
            Daftar Hutang
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
            <Input
              placeholder="Cari hutang..."
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
            value={filter.type}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, type: value }))
            }
          >
            <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
              <SelectValue placeholder="Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="supplier">Supplier</SelectItem>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="bank">Bank</SelectItem>
              <SelectItem value="lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>
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
              <SelectItem value="pending">Belum Lunas</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="overdue">Jatuh Tempo</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4 h-9"
            asChild
          >
            <Link to="/finance/debts/new">
              <Plus className="h-4 w-4 mr-2" />
              Hutang Baru
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
                Jatuh Tempo
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Deskripsi
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Kreditur
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Jumlah
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Tipe
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
            {filteredDebts.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
                >
                  Tidak ada data hutang
                </TableCell>
              </TableRow>
            ) : (
              filteredDebts.map((debt) => (
                <TableRow
                  key={debt.id}
                  className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
                >
                  <TableCell className="text-[#0C4A6E]/80">
                    {new Date(debt.date).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {new Date(debt.dueDate).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {debt.description}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {debt.creditor}
                  </TableCell>
                  <TableCell className="font-medium text-red-600">
                    Rp {debt.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{getDebtTypeBadge(debt.type)}</TableCell>
                  <TableCell>{getStatusBadge(debt.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handlePrint(debt)}
                        title="Cetak Bukti"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handleDownload(debt)}
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
                            onClick={() => handleEdit(debt)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePrint(debt)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" /> Cetak Bukti
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(debt.id)}
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

export default DebtList; 