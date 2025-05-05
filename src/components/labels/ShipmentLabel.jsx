import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

const ShipmentLabel = ({ shipment }) => {
  return (
    <div className="shipment-label">
      <Card>
        <div className="flex justify-between p-2 border-b">
          <h3 className="font-bold">Label Pengiriman #{shipment.trackingNumber}</h3>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1 h-4 w-4" /> Unduh
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="mr-1 h-4 w-4" /> Cetak
            </Button>
          </div>
        </div>
        <CardContent>
          <div className="mt-4 space-y-4">
            {/* Header */}
            <div className="flex justify-between">
              <div>
                <h2 className="font-bold text-lg">CargoPilot</h2>
                <p className="text-sm text-muted-foreground">Logistik Terpercaya</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Tanggal:</p>
                <p className="font-medium">{shipment.date}</p>
              </div>
            </div>
            
            {/* Tracking Number */}
            <div className="border border-dashed border-gray-300 p-2 text-center rounded-md">
              <p className="text-xl font-bold tracking-wider">{shipment.trackingNumber}</p>
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
                <p className="font-medium">{shipment.sender}</p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground">PENERIMA</h4>
                <p className="font-medium">{shipment.recipient}</p>
                <p className="text-sm">{shipment.address}</p>
                <p className="text-sm">{shipment.phone}</p>
              </div>
            </div>
            
            {/* Footer */}
            <div className="flex justify-between text-sm pt-4 border-t">
              <div>
                <span className="text-muted-foreground">Kurir:</span>
                <span className="ml-1 font-medium">{shipment.courier}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Berat:</span>
                <span className="ml-1 font-medium">{shipment.weight} kg</span>
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
