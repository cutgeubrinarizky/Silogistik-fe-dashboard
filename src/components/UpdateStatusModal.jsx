import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Box, Truck, CheckCircle2, X } from 'lucide-react';

const UpdateStatusModal = ({ isOpen, onClose, shipment }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updateDate, setUpdateDate] = useState('');
  const [notes, setNotes] = useState('');

  const statusHistory = [
    {
      status: 'Pickup',
      date: '2023-05-01 09:30',
      description: 'Paket telah di-pickup dari pengirim'
    },
    {
      status: 'In Transit',
      date: '2023-05-02 14:15',
      description: 'Paket dalam perjalanan'
    },
    {
      status: 'Delivered',
      date: '2023-05-03 16:20',
      description: 'Paket telah diterima oleh Budi'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pickup':
        return <Box className="h-5 w-5 text-[#FF6B2C]" />;
      case 'in transit':
        return <Truck className="h-5 w-5 text-[#0C4A6E]" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default:
        return null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implementasi update status
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] p-0">
        <div className="p-6">
          {/* Header */}
            <h2 className="text-xl font-semibold text-[#0C4A6E]">Update Status Pengiriman</h2>
            

          {/* Nomor Resi */}
          <div className="mb-6">
            <div className="text-sm text-gray-600 mb-2">Nomor Resi</div>
            <div className="p-3 bg-gray-50 rounded-lg text-[#0C4A6E] font-medium">
              {shipment?.trackingNumber || 'CGO123456'}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Form */}
            <div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-2">Status</div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="transit">In Transit</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Tanggal Update</div>
                  <Input
                    type="date"
                    value={updateDate}
                    onChange={(e) => setUpdateDate(e.target.value)}
                    className="bg-white"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-600 mb-2">Keterangan</div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Masukkan keterangan (opsional)"
                    className="min-h-[120px] bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-4"
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleSubmit}
                    className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white px-4"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>

            {/* History Status */}
            <div className="border-l pl-8">
              <div className="text-sm text-gray-600 mb-4">History Status</div>
              <div className="relative">
                {statusHistory.map((item, index) => (
                  <div key={index} className="flex gap-4 mb-8 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index === statusHistory.length - 1 ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {getStatusIcon(item.status)}
                      </div>
                      {index !== statusHistory.length - 1 && (
                        <div className="absolute top-8 left-4 w-0.5 h-16 bg-gray-200"></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-[#0C4A6E]">{item.status}</div>
                      <div className="text-sm text-gray-500">{item.date}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateStatusModal; 