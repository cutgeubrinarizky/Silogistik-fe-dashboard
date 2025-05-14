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
    if (status === "paid") return <span style={{background:'#d1fae5',color:'#047857',padding:'2px 8px',borderRadius:4,fontSize:11}}>Lunas</span>;
    if (status === "partial") return <span style={{background:'#fef9c3',color:'#b45309',padding:'2px 8px',borderRadius:4,fontSize:11}}>Sebagian</span>;
    return <span style={{background:'#fff7ed',color:'#ea580c',padding:'2px 8px',borderRadius:4,fontSize:11}}>Belum Lunas</span>;
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
      style={{
        width: '210mm',
        height: '297mm',
        background: '#fff',
        boxSizing: 'border-box',
        padding: '16px',
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        color: '#222',
        margin: 0,
        borderRadius: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        display: 'block'
      }}
    >
      {/* Header Logo dan Judul */}
      <table style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td style={{ width: '50%' }}>
              <img src={logoUrl} alt="Logo Silogistik" style={{ height: 40 }} />
              <div style={{fontSize:10, color:'#0C4A6E', fontWeight:600, marginTop:2}}>Mudah, Cepat, Terintegrasi.</div>
            </td>
            <td style={{ textAlign: 'right', verticalAlign: 'top' }}>
              <div style={{ fontWeight: 'bold', fontSize: 20, color: '#0C4A6E' }}>INVOICE</div>
              <div style={{ fontSize: 12, color: '#888' }}>No. Resi: <span style={{ color: '#0C4A6E', fontWeight: 600 }}>{bill.tracking_number}</span></div>
            </td>
          </tr>
        </tbody>
      </table>
      <hr style={{ margin: '12px 0' }} />
      <table style={{ width: '100%', marginBottom: 8 }}>
        <tbody>
          <tr>
            <td style={{ fontSize: 12 }}>Tanggal Invoice: <b>{formatDate(bill.created_at || bill.date)}</b></td>
            <td style={{ textAlign: 'right', fontSize: 12 }}>Status: {getStatusBadge(bill.payment_status)}</td>
          </tr>
        </tbody>
      </table>
      <table style={{ width: '100%', marginBottom: 8 }}>
        <tbody>
          <tr>
            <td style={{ verticalAlign: 'top', width: '50%' }}>
              <div style={{ fontWeight: 600, color: '#0C4A6E', marginBottom: 2 }}>Pengirim</div>
              <div style={{ fontSize: 12 }}>{bill.sender_name}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{bill.sender_address}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{bill.sender_phone}</div>
            </td>
            <td style={{ verticalAlign: 'top', width: '50%' }}>
              <div style={{ fontWeight: 600, color: '#0C4A6E', marginBottom: 2 }}>Penerima</div>
              <div style={{ fontSize: 12 }}>{bill.recipient_name}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{bill.recipient_address}</div>
              <div style={{ fontSize: 11, color: '#555' }}>{bill.recipient_phone}</div>
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{ fontWeight: 600, color: '#0C4A6E', margin: '12px 0 4px 0' }}>Detail Barang</div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
        <thead>
          <tr style={{ background: '#f3f4f6' }}>
            <th style={{ border: '1px solid #e5e7eb', padding: '4px 8px', fontWeight: 600, fontSize: 12 }}>Nama Barang</th>
            <th style={{ border: '1px solid #e5e7eb', padding: '4px 8px', fontWeight: 600, fontSize: 12 }}>Berat (kg)</th>
            <th style={{ border: '1px solid #e5e7eb', padding: '4px 8px', fontWeight: 600, fontSize: 12 }}>Qty</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={idx}>
              <td style={{ border: '1px solid #e5e7eb', padding: '4px 8px' }}>{item.name}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '4px 8px' }}>{item.weight}</td>
              <td style={{ border: '1px solid #e5e7eb', padding: '4px 8px' }}>{item.qty || 1}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ fontWeight: 600, color: '#0C4A6E', margin: '12px 0 4px 0' }}>Riwayat Pembayaran</div>
      {payments.length === 0 ? (
        <div style={{ color: '#888', fontStyle: 'italic', fontSize: 12 }}>Belum ada transaksi pembayaran</div>
      ) : (
        <>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr style={{ background: '#f3f4f6' }}>
                <th style={{ border: '1px solid #e5e7eb', padding: '4px 8px', fontWeight: 600, fontSize: 12 }}>Tanggal</th>
                <th style={{ border: '1px solid #e5e7eb', padding: '4px 8px', fontWeight: 600, fontSize: 12 }}>Metode</th>
                <th style={{ border: '1px solid #e5e7eb', padding: '4px 8px', fontWeight: 600, fontSize: 12 }}>Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, idx) => (
                <tr key={idx}>
                  <td style={{ border: '1px solid #e5e7eb', padding: '4px 8px' }}>{formatDate(p.date)}</td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '4px 8px' }}>{p.method}</td>
                  <td style={{ border: '1px solid #e5e7eb', padding: '4px 8px' }}>Rp {p.amount.toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <table style={{ width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#047857' }}>Total Dibayar: Rp {totalPaid.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'right', fontWeight: 600, fontSize: 12, color: '#dc2626' }}>Sisa Tagihan: Rp {(bill.final_shipping_cost - totalPaid).toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
        </>
      )}
    </div>
  );
});

export default InvoiceContent; 