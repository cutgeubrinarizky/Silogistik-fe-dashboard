import React, { forwardRef } from "react";
import { Badge } from "@/components/ui/badge";

const logoUrl = "/images/logosilogistik.png";

const InvoiceContent = forwardRef(({ bill, paymentHistory = [] }, ref) => {
  if (!bill) return null;

  // Format tanggal
  const formatDate = (date) =>
    new Date(date).toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit", year: "numeric" });

  // Status badge
  const getStatusBadge = (status) => {
    if (status === "paid") return <Badge className="pointer-events-none bg-green-100 text-green-700 border-green-200">Lunas</Badge>;
    if (status === "partial") return <Badge className="pointer-events-none bg-yellow-100 text-yellow-700 border-yellow-200">Sebagian</Badge>;
    return <Badge className="pointer-events-none bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20">Belum Lunas</Badge>;
  };

  // Tabel barang (dummy jika tidak ada)
  const items = bill.items || [
    { name: bill.service_type || "Barang", weight: bill.total_chargeable_weight || 0, qty: 1 }
  ];

  // Tabel transaksi pembayaran
  const payments = Array.isArray(paymentHistory) && paymentHistory.length > 0 ? paymentHistory : [];
  // Total pembayaran
  const totalPaid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div
      ref={ref}
      className="invoice-a4"
      style={{
        width: '210mm',
        height: '297mm',
        maxWidth: '100%',
        minHeight: '297mm',
        background: '#fff',
        boxSizing: 'border-box',
        padding: '20px',
        margin: 0,
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        fontSize: '13px',
        fontFamily: 'Arial, sans-serif'
      }}
    >
      {/* Header Logo dan Judul */}
      <div className="flex items-start justify-between mb-6 border-b pb-4">
        <img src={logoUrl} alt="Logo Silogistik" className="h-14 w-auto" />
        <div className="text-right">
          <h2 className="text-2xl font-bold text-[#0C4A6E]">INVOICE</h2>
          <div className="text-sm text-gray-500">No. Resi: <span className="font-semibold text-[#0C4A6E]">{bill.tracking_number}</span></div>
        </div>
      </div>

      {/* Info Tanggal & Status */}
      <div className="flex items-center gap-8 mb-6">
        <div className="text-sm text-gray-600">Tanggal Invoice: <span className="font-semibold">{formatDate(bill.created_at || bill.date)}</span></div>
        <div className="text-sm text-gray-600">Status: {getStatusBadge(bill.payment_status)}</div>
      </div>

      {/* Info Pengirim & Penerima */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <div className="font-semibold text-[#0C4A6E] mb-1">Pengirim</div>
          <div className="text-sm text-gray-700">{bill.sender_name}</div>
          <div className="text-xs text-gray-500">{bill.sender_address}</div>
          <div className="text-xs text-gray-500">{bill.sender_phone}</div>
        </div>
        <div>
          <div className="font-semibold text-[#0C4A6E] mb-1">Penerima</div>
          <div className="text-sm text-gray-700">{bill.recipient_name}</div>
          <div className="text-xs text-gray-500">{bill.recipient_address}</div>
          <div className="text-xs text-gray-500">{bill.recipient_phone}</div>
        </div>
      </div>

      {/* Tabel Barang */}
      <div className="mb-6">
        <div className="font-semibold text-[#0C4A6E] mb-2">Detail Barang</div>
        <table className="w-full border text-sm mb-2">
          <thead>
            <tr className="bg-gray-50">
              <th className="border px-2 py-1">Nama Barang</th>
              <th className="border px-2 py-1">Berat (kg)</th>
              <th className="border px-2 py-1">Qty</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={idx}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">{item.weight}</td>
                <td className="border px-2 py-1">{item.qty || 1}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tabel Transaksi Pembayaran */}
      <div className="mb-6">
        <div className="font-semibold text-[#0C4A6E] mb-2">Riwayat Pembayaran</div>
        {payments.length === 0 ? (
          <div className="text-gray-400 italic text-sm">Belum ada transaksi pembayaran</div>
        ) : (
          <>
            <table className="w-full border text-sm mb-2">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border px-2 py-1">Tanggal</th>
                  <th className="border px-2 py-1">Metode</th>
                  <th className="border px-2 py-1">Jumlah</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p, idx) => (
                  <tr key={idx}>
                    <td className="border px-2 py-1">{formatDate(p.date)}</td>
                    <td className="border px-2 py-1">{p.method}</td>
                    <td className="border px-2 py-1">Rp {p.amount.toLocaleString("id-ID")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end text-sm font-semibold mt-2">
              Total Dibayar: <span className="ml-2 text-green-700">Rp {totalPaid.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-end text-sm font-semibold mt-1">
              Sisa Tagihan: <span className="ml-2 text-red-700">Rp {(bill.final_shipping_cost - totalPaid).toLocaleString("id-ID")}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default InvoiceContent; 