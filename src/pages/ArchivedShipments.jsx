import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreVertical, Eye, RotateCcw } from 'lucide-react';

const ArchivedShipments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [archivedShipments] = useState([
    {
      id: 1,
      trackingNumber: 'CP001',
      sender: 'PT ABC',
      receiver: 'PT XYZ',
      originCity: 'Jakarta',
      destinationCity: 'Surabaya',
      weight: '5 kg',
      courier: 'JNE',
      date: '2024-03-15'
    },
    // Tambahkan data dummy lainnya
  ]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleViewDetails = (id) => {
    // Implementasi lihat detail
  };

  const handleUnarchive = (id) => {
    // Implementasi batalkan arsip
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Arsip Pengiriman</h1>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Input
            placeholder="Cari pengiriman..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-64"
            icon={<Search className="w-4 h-4" />}
          />
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Resi</TableHead>
              <TableHead>Pengirim</TableHead>
              <TableHead>Penerima</TableHead>
              <TableHead>Kota Asal</TableHead>
              <TableHead>Kota Tujuan</TableHead>
              <TableHead>Berat</TableHead>
              <TableHead>Kurir</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {archivedShipments.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell>{shipment.trackingNumber}</TableCell>
                <TableCell>{shipment.sender}</TableCell>
                <TableCell>{shipment.receiver}</TableCell>
                <TableCell>{shipment.originCity}</TableCell>
                <TableCell>{shipment.destinationCity}</TableCell>
                <TableCell>{shipment.weight}</TableCell>
                <TableCell>{shipment.courier}</TableCell>
                <TableCell>{shipment.date}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewDetails(shipment.id)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Lihat Detail
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleUnarchive(shipment.id)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Batalkan Arsip
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ArchivedShipments; 