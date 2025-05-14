import React, { useState, useRef } from "react";
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
  Download,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import UpdatePaymentModal from "./UpdatePaymentModal";
import InvoiceContent from "./InvoicePrintModal";
import html2pdf from "html2pdf.js";

// Helper function untuk mendapatkan badge status
const getStatusBadge = (status) => {
  const variants = {
    unpaid: {
      label: "Belum Lunas",
      variant: "warning",
      className: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20",
    },
    partial: {
      label: "Cicilan",
      variant: "info",
      className: "bg-[#0C4A6E]/10 text-[#0C4A6E] border-[#0C4A6E]/20",
    },
    paid: {
      label: "Lunas",
      variant: "success",
      className: "bg-green-100 text-green-700 border-green-200",
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

const BillList = ({ bills = [], onUpdatePayment }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    status: "all",
  });
  const [selectedBill, setSelectedBill] = useState(null);
  const [showUpdatePayment, setShowUpdatePayment] = useState(false);
  const [invoicePaymentHistory, setInvoicePaymentHistory] = useState([]);
  const invoiceRef = useRef();
  const [invoiceData, setInvoiceData] = useState({ bill: null, paymentHistory: [] });
  const navigate = useNavigate();

  const handleUpdatePayment = (bill, e) => {
    e.stopPropagation();
    setSelectedBill(bill);
    setShowUpdatePayment(true);
  };

  const handlePaymentUpdate = (id, updateData) => {
    onUpdatePayment(id, updateData);
    toast.success("Pembayaran berhasil diupdate");
  };

  const handlePrint = (bill) => {
    // Ambil riwayat pembayaran jika ada (misal bill.payment_history)
    setInvoiceData({ bill, paymentHistory: bill.payment_history || [] });
    setTimeout(() => {
      if (invoiceRef.current) {
        html2pdf()
          .set({
            margin: 0,
            filename: `Invoice-${bill.tracking_number}.pdf`,
            html2canvas: { scale: 1.2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
            pagebreak: { mode: ["avoid-all"] },
          })
          .from(invoiceRef.current)
          .save();
      }
    }, 100); // Tunggu render invoice
  };

  const handleDownload = (bill) => {
    // Implementasi download bukti pembayaran
    toast.success("Mengunduh bukti pembayaran...");
  };

  // Filter bills berdasarkan pencarian dan filter
  const filteredBills = bills.filter(
    (bill) =>
      (filter.status === "all" || bill.payment_status === filter.status) &&
      ((bill.tracking_number || "").toLowerCase().includes(search.toLowerCase()) ||
        (bill.recipient_name || "").toLowerCase().includes(search.toLowerCase()) ||
        (bill.sender_name || "").toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <CardTitle className="text-[#0C4A6E] text-xl font-semibold">
            Daftar Tagihan & Hutang
          </CardTitle>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
            <Input
              placeholder="Cari tagihan..."
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
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="unpaid">Belum Lunas</SelectItem>
              <SelectItem value="paid">Lunas</SelectItem>
              <SelectItem value="partial">Sebagian</SelectItem>
            </SelectContent>
          </Select>
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
                No. Resi
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Pengirim
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Penerima
              </TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">
                Total Tagihan
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
            {filteredBills.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  Tidak ada data tagihan
                </TableCell>
              </TableRow>
            ) : (
              filteredBills.map((bill) => (
                <TableRow
                  key={bill.id}
                  className="hover:bg-gray-50/80 transition-all border-b border-gray-100"
                >
                  <TableCell className="text-[#0C4A6E]/80">
                    {new Date(bill.created_at || bill.date).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="font-medium text-[#0C4A6E]">
                    {bill.tracking_number}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {bill.sender_name}
                  </TableCell>
                  <TableCell className="text-[#0C4A6E]/80">
                    {bill.recipient_name}
                  </TableCell>
                  <TableCell className="font-medium text-[#0C4A6E]">
                    Rp {(bill.final_shipping_cost || 0).toLocaleString("id-ID")}
                  </TableCell>
                  <TableCell className="pointer-events-none">
                    <Badge
                      className={
                        bill.payment_status === "paid"
                          ? "bg-green-100 text-green-700 border-green-200"
                          : bill.payment_status === "partial"
                          ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                          : "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20"
                      }
                    >
                      {bill.payment_status === "paid"
                        ? "Lunas"
                        : bill.payment_status === "partial"
                        ? "Sebagian"
                        : "Belum Lunas"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {bill.payment_status !== "paid" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                          onClick={(e) => handleUpdatePayment(bill, e)}
                          title="Update Transaksi"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={() => handlePrint(bill)}
                        title="Cetak Invoice"
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {showUpdatePayment && selectedBill && (
        <UpdatePaymentModal
          shipment={selectedBill}
          onClose={() => {
            setShowUpdatePayment(false);
            setSelectedBill(null);
          }}
          onUpdate={handlePaymentUpdate}
        />
      )}

      {/* Render invoice tersembunyi untuk html2pdf */}
      <div style={{ display: "none" }}>
        <div ref={invoiceRef}>
          <InvoiceContent bill={invoiceData.bill} paymentHistory={invoiceData.paymentHistory} />
        </div>
      </div>
    </Card>
  );
};

export default BillList; 