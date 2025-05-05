
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

interface ShipmentLabelProps {
  shipment: {
    trackingNumber: string;
    sender: string;
    recipient: string;
    address: string;
    phone: string;
    courier: string;
    date: string;
    weight: number;
  };
}

const ShipmentLabel: React.FC<ShipmentLabelProps> = ({ shipment }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        <h3 className="font-medium">Label Pengiriman #{shipment.trackingNumber}</h3>
        <div className="space-x-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" /> Unduh
          </Button>
          <Button size="sm">
            <Printer size={16} className="mr-2" /> Cetak
          </Button>
        </div>
      </div>
      
      <Card>
        <CardContent className="p-6">
          <div className="border-2 border-dashed border-gray-300 p-4 relative">
            {/* Header */}
            <div className="flex justify-between mb-4">
              <div>
                <div className="text-sm font-bold uppercase">CargoPilot</div>
                <div className="text-xs text-gray-500">Logistik Terpercaya</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500">Tanggal:</div>
                <div className="text-sm">{shipment.date}</div>
              </div>
            </div>
            
            {/* Tracking Number */}
            <div className="flex justify-center mb-4">
              <div className="inline-block bg-gray-800 text-white text-lg font-bold py-1 px-4 rounded">
                {shipment.trackingNumber}
              </div>
            </div>
            
            {/* QR Code Placeholder */}
            <div className="flex justify-center mb-4">
              <div className="bg-gray-200 w-32 h-32 flex items-center justify-center">
                <div className="text-xs text-gray-500">QR Code</div>
              </div>
            </div>
            
            {/* Shipping Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-xs font-bold uppercase text-gray-500 mb-1">PENGIRIM</div>
                <div className="font-medium">{shipment.sender}</div>
              </div>
              <div>
                <div className="text-xs font-bold uppercase text-gray-500 mb-1">PENERIMA</div>
                <div className="font-medium">{shipment.recipient}</div>
                <div className="text-sm mt-1">{shipment.address}</div>
                <div className="text-sm">{shipment.phone}</div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t border-gray-300 pt-2 flex justify-between items-center">
              <div>
                <div className="text-xs text-gray-500">Kurir:</div>
                <div className="font-medium">{shipment.courier}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Berat:</div>
                <div className="font-medium">{shipment.weight} kg</div>
              </div>
            </div>
            
            {/* Cut Line */}
            <div className="absolute -left-2 top-1/2 w-4 h-4 bg-white border-2 border-dashed border-gray-300 rounded-full"></div>
            <div className="absolute -right-2 top-1/2 w-4 h-4 bg-white border-2 border-dashed border-gray-300 rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ShipmentLabel;
