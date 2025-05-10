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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Helper function untuk mendapatkan badge status
const getStatusBadge = (status) => {
  const variants = {
    pending: {
      label: "Menunggu",
      variant: "warning",
      className: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
    },
    approved: {
      label: "Disetujui",
      variant: "success",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    rejected: {
      label: "Ditolak",
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

// Helper function untuk mendapatkan badge kategori
const getCategoryBadge = (category) => {
  const variants = {
    operasional: {
      label: "Operasional",
      variant: "default",
      className: "bg-blue-100 text-blue-700 border-blue-200",
    },
    gaji: {
      label: "Gaji",
      variant: "default",
      className: "bg-purple-100 text-purple-700 border-purple-200",
    },
    bbm: {
      label: "BBM",
      variant: "default",
      className: "bg-yellow-100 text-yellow-700 border-yellow-200",
    },
    maintenance: {
      label: "Maintenance",
      variant: "default",
      className: "bg-orange-100 text-orange-700 border-orange-200",
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

const ExpenseList = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    category: "all",
    status: "all",
  });
  const navigate = useNavigate();

  // Data dummy untuk contoh
  const [expenses] = useState([
    {
      id: 1,
      date: "2024-03-20",
      description: "Pembayaran BBM kurir",
      amount: 500000,
      category: "bbm",
      status: "approved",
      approvedBy: "John Doe",
    },
    {
      id: 2,
      date: "2024-03-19",
      description: "Service kendaraan",
      amount: 750000,
      category: "maintenance",
      status: "pending",
      approvedBy: null,
    },
    // Tambahkan data dummy lainnya
  ]);

  const handleEdit = (expense) => {
    navigate("/finance/expenses/edit", { state: { expense } });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) {
      // Implementasi hapus pengeluaran
      toast.success("Pengeluaran berhasil dihapus");
    }
  };

  const handlePrint = (expense) => {
    // Implementasi cetak bukti pengeluaran
    toast.success("Mencetak bukti pengeluaran...");
  };

  // Filter pengeluaran berdasarkan pencarian dan filter
  const filteredExpenses = expenses.filter(
    (e) =>
      (filter.category === "all" || e.category === filter.category) &&
      (filter.status === "all" || e.status === filter.status) &&
      e.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <CardTitle className="text-[#0C4A6E] text-xl font-semibold">
            Daftar Pengeluaran
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
            <Input
              placeholder="Cari pengeluaran..."
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
            value={filter.category}
            onValueChange={(value) =>
              setFilter((prev) => ({ ...prev, category: value }))
            }
          >
            <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="operasional">Operasional</SelectItem>
              <SelectItem value="gaji">Gaji</SelectItem>
              <SelectItem value="bbm">BBM</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
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
              <SelectItem value="pending">Menunggu</SelectItem>
              <SelectItem value="approved">Disetujui</SelectItem>
              <SelectItem value="rejected">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4 h-9"
            asChild
          >
            <Link to="/finance/expenses/new">
              <Plus className="h-4 w-4 mr-2" />
              Pengeluaran Baru
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
                Jumlah
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Kategori
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Status
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Disetujui Oleh
              </TableHead>
              <TableHead className="text-right text-[#0C4A6E]/70 font-medium">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  Tidak ada data pengeluaran
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((expense) => (
                <TableRow
                  key={expense.id}
                  className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
                >
                  <TableCell className="text-[#0C4A6E]/80">
                    {new Date(expense.date).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {expense.description}
                  </TableCell>
                  <TableCell className="font-medium text-red-600">
                    Rp {expense.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{getCategoryBadge(expense.category)}</TableCell>
                  <TableCell>{getStatusBadge(expense.status)}</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {expense.approvedBy || "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handlePrint(expense)}
                        title="Cetak Bukti"
                      >
                        <Printer className="h-4 w-4" />
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
                            onClick={() => handleEdit(expense)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePrint(expense)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" /> Cetak Bukti
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(expense.id)}
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

export default ExpenseList; 