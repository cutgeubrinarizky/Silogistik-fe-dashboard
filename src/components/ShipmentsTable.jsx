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
import { Search, Filter, MoreVertical, Printer, Copy, Edit, RefreshCw } from 'lucide-react';

const ShipmentsTable = () => {
  const [shipments, setShipments] = useState([
    {
      id: 1,
      trackingNumber: 'CP001',
      sender: 'PT ABC',
      receiver: 'PT XYZ',
      originCity: 'Jakarta',
      destinationCity: 'Surabaya',
      status: 'In Transit',
      weight: '5 kg',
      courier: 'JNE',
      date: '2024-03-20'
    },
    // Tambahkan data dummy lainnya di sini
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlePrintLabel = (id) => {
    // Implementasi cetak label
  };

  const handleDuplicate = (id) => {
    // Implementasi duplikasi
  };

  const handleEdit = (id) => {
    // Implementasi edit
  };

  const handleUpdateStatus = (id) => {
    // Implementasi update status
  };

  return (
    <div className="w-full">
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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Resi</TableHead>
            <TableHead>Pengirim</TableHead>
            <TableHead>Penerima</TableHead>
            <TableHead>Kota Asal</TableHead>
            <TableHead>Kota Tujuan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Berat</TableHead>
            <TableHead>Kurir</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shipments.map((shipment) => (
            <TableRow key={shipment.id}>
              <TableCell>{shipment.trackingNumber}</TableCell>
              <TableCell>{shipment.sender}</TableCell>
              <TableCell>{shipment.receiver}</TableCell>
              <TableCell>{shipment.originCity}</TableCell>
              <TableCell>{shipment.destinationCity}</TableCell>
              <TableCell>{shipment.status}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleEdit(shipment.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handlePrintLabel(shipment.id)}>
                      <Printer className="mr-2 h-4 w-4" />
                      Cetak Label
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDuplicate(shipment.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplikat
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(shipment.id)}>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Update Status
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ShipmentsTable; 