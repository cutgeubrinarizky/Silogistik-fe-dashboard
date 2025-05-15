import React, { useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ShipmentLabel = ({ shipment, size = 'thermal', design = 'standard' }) => {
  const labelRef = useRef(null);

  // Transform data untuk memastikan kompatibilitas
  const labelData = {
    trackingNumber: shipment?.tracking_number || shipment?.trackingNumber || '-',
    sender: typeof shipment?.sender === 'object' ? shipment?.sender?.name : (shipment?.sender_name || shipment?.sender || '-'),
    recipient: typeof shipment?.recipient === 'object' ? shipment?.recipient?.name : (shipment?.recipient_name || shipment?.recipient || '-'),
    address: typeof shipment?.recipient === 'object' ? shipment?.recipient?.address : (shipment?.recipient_address || shipment?.address || '-'),
    phone: typeof shipment?.recipient === 'object' ? shipment?.recipient?.phone : (shipment?.recipient_phone || shipment?.phone || '-'),
    courier: typeof shipment?.courier === 'object' ? shipment?.courier?.name : (shipment?.courier_name || shipment?.courier || '-'),
    date: shipment?.created_at || shipment?.date || '-',
    weight: shipment?.weight || '0'
  };

  // Format tanggal jika ada
  const formattedDate = labelData.date !== '-' 
    ? new Date(labelData.date).toLocaleDateString('id-ID')
    : '-';

  // Styling berdasarkan desain
  const getDesignStyles = () => {
    switch (design) {
      case 'express':
        return {
          container: 'bg-blue-50',
          header: 'bg-blue-100',
          trackingNumber: 'bg-blue-200 text-blue-900',
          highlight: 'text-blue-700',
          warning: 'hidden'
        };
      case 'economy':
        return {
          container: 'bg-gray-50',
          header: 'bg-gray-100',
          trackingNumber: 'bg-gray-200 text-gray-900',
          highlight: 'text-gray-700',
          warning: 'hidden'
        };
      case 'fragile':
        return {
          container: 'bg-yellow-50',
          header: 'bg-yellow-100',
          trackingNumber: 'bg-yellow-200 text-yellow-900',
          highlight: 'text-yellow-700',
          warning: 'block'
        };
      case 'cold':
        return {
          container: 'bg-cyan-50',
          header: 'bg-cyan-100',
          trackingNumber: 'bg-cyan-200 text-cyan-900',
          highlight: 'text-cyan-700',
          warning: 'hidden'
        };
      case 'dangerous':
        return {
          container: 'bg-red-50',
          header: 'bg-red-100',
          trackingNumber: 'bg-red-200 text-red-900',
          highlight: 'text-red-700',
          warning: 'block'
        };
      case 'a4':
        return {
          container: 'bg-white',
          header: 'bg-gray-50',
          trackingNumber: 'bg-gray-100 text-gray-900',
          highlight: 'text-gray-700',
          warning: 'hidden'
        };
      default: // standard
        return {
          container: 'bg-white',
          header: 'bg-gray-50',
          trackingNumber: 'bg-gray-100 text-gray-900',
          highlight: 'text-gray-700',
          warning: 'hidden'
        };
    }
  };

  const styles = getDesignStyles();

  // Warning message berdasarkan desain
  const getWarningMessage = () => {
    switch (design) {
      case 'fragile':
        return '⚠️ BARANG RAPUH - HATI-HATI';
      case 'dangerous':
        return '☣️ BARANG BERBAHAYA - HATI-HATI';
      default:
        return '';
    }
  };

  // Fungsi cetak
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Label Pengiriman - ${labelData.trackingNumber}</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body onload="window.print()">
          <div>${labelRef.current.innerHTML}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Fungsi unduh PDF
  const handleDownload = async () => {
    const canvas = await html2canvas(labelRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a6'
    });
    pdf.addImage(imgData, 'PNG', 0, 0, 105, 148);
    pdf.save(`Label-${labelData.trackingNumber}.pdf`);
  };

  return (
    <div className={`shipment-label ${styles.container} rounded-lg overflow-hidden`}>
      <Card className="border-0 shadow-none">
        <div className={`flex justify-between p-2 ${styles.header}`}>
          <h3 className={`font-bold ${styles.highlight}`}>Label Pengiriman #{labelData.trackingNumber}</h3>
          <div className="flex space-x-2">
            <Button size="sm" className="flex items-center gap-2 bg-[#0C4A6E] text-white hover:bg-[#0C4A6E]/90" onClick={handleDownload}>
              <Download className="mr-1 h-4 w-4" /> Unduh
            </Button>
            <Button size="sm" className="flex items-center gap-2 bg-[#FF6B2C] text-white hover:bg-[#FF6B2C]/90" onClick={handlePrint}>
              <Printer className="mr-1 h-4 w-4" /> Cetak
            </Button>
          </div>
        </div>
        <CardContent className="p-4">
          <div ref={labelRef}>
            {/* Warning Message */}
            {styles.warning === 'block' && (
              <div className={`p-2 text-center font-bold ${styles.highlight} bg-opacity-20 ${styles.header}`}>
                {getWarningMessage()}
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-lg">CargoPilot</h2>
                <p className="text-sm text-muted-foreground">Logistik Terpercaya</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tanggal:</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </div>
            
            {/* Tracking Number */}
            <div className={`border border-dashed p-2 text-center rounded-md ${styles.trackingNumber}`}>
              <p className="text-xl font-bold tracking-wider">{labelData.trackingNumber}</p>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="flex justify-center py-2">
              <div className="w-32 h-32 bg-gray-200 flex items-center justify-center">
                QR Code
              </div>
            </div>
            
            {/* Shipping Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">PENGIRIM</h4>
                <p className="font-medium">{labelData.sender}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">PENERIMA</h4>
                <p className="font-medium">{labelData.recipient}</p>
                <p className="text-sm">{labelData.address}</p>
                <p className="text-sm">{labelData.phone}</p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between text-sm pt-4 border-t">
              <div>
                <span className="text-muted-foreground">Kurir:</span>
                <span className="ml-1 font-medium">{labelData.courier}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Berat:</span>
                <span className="ml-1 font-medium">{labelData.weight} kg</span>
              </div>
            </div>
            
            {/* Cut Line */}
            <div className="border-t border-dashed my-2 pt-2 text-center text-xs text-muted-foreground">
              Potong di sini
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentLabel;
