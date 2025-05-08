import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Archive, Eye, Undo2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const ArchivedShipments = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    date: 'all'
  });
  
  const [archivedShipments, setArchivedShipments] = useState([
    {
      id: 1,
      trackingNumber: 'CGO123456',
      sender: { name: 'John Doe', phone: '08123456789', address: { province: 'Jawa Barat', city: 'Bandung', district: 'Coblong' } },
      recipient: { name: 'Jane Smith', phone: '08987654321', address: { province: 'Jawa Tengah', city: 'Semarang', district: 'Candisari', street: 'Jl. Diponegoro' } },
      date: '2024-03-20',
      items: [
        { id: 1, name: 'Buku', weight: '1', quantity: '2', length: '20', width: '15', height: '3' }
      ],
      shipmentType: 'pickup',
      courier: 'Agus Subagyo',
      marketing: 'Agus',
      discount: 0
    },
    // ... data lainnya
  ]);

  const navigate = useNavigate();

  const handleUnarchive = (id, e) => {
    e.stopPropagation();
    setArchivedShipments(prev => prev.filter(item => item.id !== id));
    toast.success('Pengiriman berhasil dibatalkan arsip');
  };

  const handleViewDetails = (id, e) => {
    e.stopPropagation();
    const shipment = archivedShipments.find(item => item.id === id);
    if (shipment) {
      navigate('/shipments/new', { state: { shipment } });
    }
  };

  // Helper function untuk menghitung total berat
  const calculateTotalWeight = (items) => {
    return items.reduce((sum, item) => sum + (Number(item.weight) * Number(item.quantity)), 0);
  };

  return (
    <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* <div className="p-2 bg-[#FF6B2C]/10 rounded-lg">
            <Archive className="h-5 w-5 text-[#FF6B2C]" />
          </div> */}
          <CardTitle className="text-[#0C4A6E] text-xl font-semibold">Arsip Pengiriman</CardTitle>
        </div>
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center bg-gray-50/80 rounded-lg p-1 gap-1.5">
            <Input
              placeholder="Cari pengiriman..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-56 border-0 bg-transparent focus:ring-0 placeholder:text-gray-400 text-sm"
            />
            <Button size="icon" variant="ghost" className="h-8 w-8 text-gray-400 hover:text-[#FF6B2C]">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          <Select
            value={filter.date}
            onValueChange={value => setFilter(prev => ({ ...prev, date: value }))}
          >
            <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
              <SelectValue placeholder="Tanggal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tanggal</SelectItem>
              <SelectItem value="today">Hari Ini</SelectItem>
              <SelectItem value="week">Minggu Ini</SelectItem>
              <SelectItem value="month">Bulan Ini</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-gray-100 hover:bg-transparent">
              <TableHead className="text-[#0C4A6E]/70 font-medium">Nomor Resi</TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">Pengirim</TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">Penerima</TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">Kota Asal</TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">Kota Tujuan</TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">Berat</TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">Kurir</TableHead>
              <TableHead className="text-[#0C4A6E]/70 font-medium">Tanggal</TableHead>
              <TableHead className="text-right text-[#0C4A6E]/70 font-medium">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archivedShipments
              .filter(s => 
                search === '' || 
                s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
                s.sender.name.toLowerCase().includes(search.toLowerCase()) ||
                s.recipient.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((shipment) => (
                <TableRow 
                  key={shipment.id} 
                  className="cursor-pointer hover:bg-gray-50/80 transition-all border-b border-gray-100"
                  onClick={() => handleViewDetails(shipment.id)}
                >
                  <TableCell className="font-medium text-[#0C4A6E]">{shipment.trackingNumber}</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">{shipment.sender.name}</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">{shipment.recipient.name}</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">{shipment.sender.address.city}</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">{shipment.recipient.address.city}</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">{calculateTotalWeight(shipment.items)} kg</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">{shipment.courier}</TableCell>
                  <TableCell className="text-[#0C4A6E]/80">{new Date(shipment.date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#0C4A6E] hover:text-[#0C4A6E] hover:bg-[#0C4A6E]/10"
                        onClick={(e) => handleViewDetails(shipment.id, e)}
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                        onClick={(e) => handleUnarchive(shipment.id, e)}
                        title="Batalkan Arsip"
                      >
                        <Undo2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ArchivedShipments; 