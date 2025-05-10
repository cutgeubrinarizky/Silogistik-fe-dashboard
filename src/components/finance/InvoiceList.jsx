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
    draft: {
      label: "Draft",
      variant: "default",
      className: "bg-gray-100 text-gray-700 border-gray-200",
    },
    sent: {
      label: "Terkirim",
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

const InvoiceList = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    status: "all",
  });
  const navigate = useNavigate();

  // Data dummy untuk contoh
  const [invoices] = useState([
    {
      id: 1,
      invoiceNumber: "INV-2024-001",
      date: "2024-03-20",
      dueDate: "2024-04-20",
      customer: "PT. ABC Logistics",
      amount: 2500000,
      status: "paid",
    },
    {
      id: 2,
      invoiceNumber: "INV-2024-002",
      date: "2024-03-19",
      dueDate: "2024-04-19",
      customer: "CV. XYZ Transport",
      amount: 1500000,
      status: "sent",
    },
    // Tambahkan data dummy lainnya
  ]);

  const handleEdit = (invoice) => {
    navigate("/finance/invoices/edit", { state: { invoice } });
  };

  const handleDelete = (id) => {
    if (confirm("Apakah Anda yakin ingin menghapus invoice ini?")) {
      // Implementasi hapus invoice
      toast.success("Invoice berhasil dihapus");
    }
  };

  const handlePrint = (invoice) => {
    // Implementasi cetak invoice
    toast.success("Mencetak invoice...");
  };

  const handleDownload = (invoice) => {
    // Implementasi download invoice
    toast.success("Mengunduh invoice...");
  };

  // Filter invoice berdasarkan pencarian dan filter
  const filteredInvoices = invoices.filter(
    (i) =>
      (filter.status === "all" || i.status === filter.status) &&
      (i.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
        i.customer.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <CardTitle className="text-[#0C4A6E] text-xl font-semibold">
            Daftar Invoice
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
            <Input
              placeholder="Cari invoice..."
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
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Terkirim</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="overdue">Jatuh Tempo</SelectItem>
            </SelectContent>
          </Select>
          <Button
            size="sm"
            className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4 h-9"
            asChild
          >
            <Link to="/finance/invoices/new">
              <Plus className="h-4 w-4 mr-2" />
              Invoice Baru
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                No. Invoice
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Tanggal
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Jatuh Tempo
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Pelanggan
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
            {filteredInvoices.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  Tidak ada data invoice
                </TableCell>
              </TableRow>
            ) : (
              filteredInvoices.map((invoice) => (
                <TableRow
                  key={invoice.id}
                  className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
                >
                  <TableCell className="text-[#0C4A6E]/80 font-medium">
                    {invoice.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {new Date(invoice.date).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {new Date(invoice.dueDate).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {invoice.customer}
                  </TableCell>
                  <TableCell className="font-medium text-[#0C4A6E]">
                    Rp {invoice.amount.toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handlePrint(invoice)}
                        title="Cetak Invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handleDownload(invoice)}
                        title="Download Invoice"
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
                            onClick={() => handleEdit(invoice)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handlePrint(invoice)}
                            className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                          >
                            <FileText className="mr-2 h-4 w-4" /> Cetak Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(invoice.id)}
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

export default InvoiceList; 