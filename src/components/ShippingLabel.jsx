import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Printer, Download } from 'lucide-react';
import QRCode from 'react-qr-code';

const ShippingLabel = ({ isOpen, onClose, shipmentData }) => {
  // Data dummy untuk contoh
  const data = shipmentData || {
    trackingNumber: 'CP001',
    sender: {
      name: 'PT ABC',
      address: 'Jl. Sudirman No. 123',
      city: 'Jakarta',
      phone: '08123456789'
    },
    receiver: {
      name: 'PT XYZ',
      address: 'Jl. Pemuda No. 456',
      city: 'Surabaya',
      phone: '08987654321'
    },
    weight: '5 kg',
    courier: 'JNE',
    service: 'Regular',
    date: '2024-03-20'
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Implementasi download PDF
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle>Preview Label Pengiriman</DialogTitle>
        </DialogHeader>

        {/* Label Preview - ukuran A6 (105mm x 148mm) */}
        <div className="w-[105mm] h-[148mm] border rounded-lg p-4 mx-auto bg-white">
          {/* Header */}
          <div className="flex justify-between items-start border-b pb-2">
            <div>
              <h2 className="font-bold text-xl">CargoPilot</h2>
              <p className="text-sm text-gray-600">{data.courier} - {data.service}</p>
            </div>
            <QRCode
              value={data.trackingNumber}
              size={60}
            />
          </div>

          {/* Tracking Number */}
          <div className="text-center my-2 p-2 border-b">
            <p className="text-sm text-gray-600">No. Resi</p>
            <p className="font-mono font-bold text-lg">{data.trackingNumber}</p>
          </div>

          {/* Sender Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-sm bg-gray-100 p-1">PENGIRIM:</h3>
            <p className="font-medium">{data.sender.name}</p>
            <p className="text-sm">{data.sender.address}</p>
            <p className="text-sm">{data.sender.city}</p>
            <p className="text-sm">Telp: {data.sender.phone}</p>
          </div>

          {/* Receiver Info */}
          <div className="mb-4">
            <h3 className="font-semibold text-sm bg-gray-100 p-1">PENERIMA:</h3>
            <p className="font-medium">{data.receiver.name}</p>
            <p className="text-sm">{data.receiver.address}</p>
            <p className="text-sm">{data.receiver.city}</p>
            <p className="text-sm">Telp: {data.receiver.phone}</p>
          </div>

          {/* Footer */}
          <div className="mt-auto">
            <div className="flex justify-between text-sm">
              <span>Berat: {data.weight}</span>
              <span>Tanggal: {data.date}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
          <Button onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Unduh PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShippingLabel; 