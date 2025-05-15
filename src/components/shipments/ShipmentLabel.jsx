import React, { useRef } from 'react';
import { Download, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ShipmentLabel = ({ shipment, onClose }) => {
  const labelRef = useRef(null);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Label Pengiriman - ${shipment.trackingNumber}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <style>
            @page {
              size: A6;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background: white;
            }
            .print-container {
              width: 10.5cm;
              height: 14.8cm;
              padding: 12mm;
              margin: 0 auto;
              background: white;
              position: relative;
              font-family: system-ui, -apple-system, sans-serif;
            }
          </style>
        </head>
        <body onload="window.print()">
          <div id="label-content" class="print-container">
            ${labelRef.current.innerHTML}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleDownload = async () => {
    try {
      // Membuat canvas dari elemen label
      const canvas = await html2canvas(labelRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Mengkonversi canvas ke gambar
      const imgData = canvas.toDataURL('image/jpeg', 1.0);

      // Membuat PDF dengan ukuran A6
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a6'
      });

      // Menambahkan gambar ke PDF
      pdf.addImage(imgData, 'JPEG', 0, 0, 105, 148);

      // Mengunduh PDF
      pdf.save(`Label-${shipment.trackingNumber}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Terjadi kesalahan saat mengunduh PDF. Silakan coba lagi.');
    }
  };

  const labelData = {
    weight: shipment.weight || shipment.total_weight || shipment.total_chargeable_weight || '0',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-[#0C4A6E]">Preview Label</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="flex items-center gap-2 bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90"
              onClick={handlePrint}
            >
              <Printer className="h-4 w-4" /> Cetak
            </Button>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-[#0C4A6E] text-white hover:bg-[#0C4A6E]/90"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" /> Unduh PDF
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="hover:bg-gray-100"
            >
              ✕
            </Button>
          </div>
        </div>

        {/* Preview Label */}
        <div ref={labelRef} className="w-[10.5cm] mx-auto bg-white border border-[#FF6B2C] rounded-lg p-[12mm]">
          <div className="text-sm text-gray-500 mb-4">
            Label akan dicetak dalam ukuran A6 (10.5cm x 14.8cm)
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-[#0C4A6E]">CargoPilot</h1>
                <p className="text-sm text-gray-500">Logistik Terpercaya</p>
              </div>
              <div className="text-right text-sm">
                <p className="text-gray-500">Tanggal Pengiriman:</p>
                <p className="font-semibold">{new Date(shipment.date).toLocaleDateString('id-ID')}</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-[#0C4A6E] rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-[#0C4A6E]">{shipment.trackingNumber}</div>
            </div>

            <div className="w-[100px] h-[100px] mx-auto bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-400">QR Code</p>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-1">PENGIRIM</h3>
                <p className="font-bold text-[#0C4A6E] text-sm mb-1">{shipment.sender.name}</p>
                <p className="text-xs text-gray-700">
                  {shipment.sender.address.district}, {shipment.sender.address.city}
                </p>
                <p className="text-xs text-gray-700">{shipment.sender.phone}</p>
              </div>
              <div>
                <h3 className="text-xs font-semibold text-gray-500 mb-1">PENERIMA</h3>
                <p className="font-bold text-[#0C4A6E] text-sm mb-1">{shipment.recipient.name}</p>
                <p className="text-xs text-gray-700">
                  {shipment.recipient.address.street}<br />
                  {shipment.recipient.address.district}, {shipment.recipient.address.city}
                </p>
                <p className="text-xs text-gray-700">{shipment.recipient.phone}</p>
              </div>
            </div>

            <div className="flex justify-between text-sm pt-2">
              <div>
                <span className="text-gray-500">Kurir:</span>
                <span className="font-semibold ml-1">{shipment.courier}</span>
              </div>
              <div>
                <span className="text-gray-500">Berat:</span>
                <span className="ml-1 font-medium">{labelData.weight} kg</span>
              </div>
            </div>
          </div>

          <div className="border-t border-dashed mt-6 pt-2 text-center text-gray-400 text-xs">
            ✂️ Potong di sini
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentLabel; 