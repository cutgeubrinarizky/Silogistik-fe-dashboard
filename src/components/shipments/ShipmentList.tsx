
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Filter, 
  MoreHorizontal, 
  RefreshCcw, 
  Edit, 
  Printer, 
  Trash2, 
  CheckCircle,
  PackageCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

// Sample data for shipments
const shipments = [
  {
    id: 1,
    trackingNumber: 'CGO123456',
    recipient: 'Ahmad Rasyid',
    status: 'pickup',
    courier: 'Agus Subagyo',
    actualWeight: 2.5,
    volumeWeight: 1.8,
    finalWeight: 2.5,
    type: 'pickup',
    cost: 25000,
    date: '2025-05-01',
  },
  {
    id: 2,
    trackingNumber: 'CGO234567',
    recipient: 'Budi Santoso',
    status: 'transit',
    courier: 'Citra Dewi',
    actualWeight: 1.2,
    volumeWeight: 1.5,
    finalWeight: 1.5,
    type: 'dropoff',
    cost: 15000,
    date: '2025-05-02',
  },
  {
    id: 3,
    trackingNumber: 'CGO345678',
    recipient: 'Dewi Putri',
    status: 'delivered',
    courier: 'Budi Santoso',
    actualWeight: 3.0,
    volumeWeight: 2.2,
    finalWeight: 3.0,
    type: 'pickup',
    cost: 30000,
    date: '2025-05-02',
  },
  {
    id: 4,
    trackingNumber: 'CGO456789',
    recipient: 'Eko Prasetyo',
    status: 'failed',
    courier: 'Dian Pratama',
    actualWeight: 1.0,
    volumeWeight: 0.8,
    finalWeight: 1.0,
    type: 'dropoff',
    cost: 10000,
    date: '2025-05-03',
  },
  {
    id: 5,
    trackingNumber: 'CGO567890',
    recipient: 'Fira Zahra',
    status: 'transit',
    courier: 'Agus Subagyo',
    actualWeight: 4.2,
    volumeWeight: 5.0,
    finalWeight: 5.0,
    type: 'pickup',
    cost: 50000,
    date: '2025-05-04',
  }
];

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  switch(status) {
    case 'pickup':
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">Pickup</Badge>;
    case 'transit':
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Dalam Perjalanan</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Terkirim</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Gagal</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const ShipmentList = () => {
  const [filter, setFilter] = useState({
    status: '',
    courier: '',
    type: '',
  });

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 space-y-4 sm:space-y-0">
        <CardTitle>Daftar Pengiriman</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-9">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCcw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="h-9" asChild>
            <Link to="/shipments/new">
              + Pengiriman Baru
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Cari nomor resi atau nama..." />
            </div>
            <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="transit">Dalam Perjalanan</SelectItem>
                <SelectItem value="delivered">Terkirim</SelectItem>
                <SelectItem value="failed">Gagal</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filter.type} onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Jenis Pengiriman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="dropoff">Drop-off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">No. Resi</TableHead>
                  <TableHead>Penerima</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Kurir</TableHead>
                  <TableHead>Berat Final</TableHead>
                  <TableHead>Ongkir</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.map((shipment) => (
                  <TableRow key={shipment.id}>
                    <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                    <TableCell>{shipment.recipient}</TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell>{shipment.courier}</TableCell>
                    <TableCell>{shipment.finalWeight} kg</TableCell>
                    <TableCell>Rp {shipment.cost.toLocaleString('id-ID')}</TableCell>
                    <TableCell>{new Date(shipment.date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit size={16} className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Printer size={16} className="mr-2" /> Cetak Label
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <CheckCircle size={16} className="mr-2" /> Update Status
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <PackageCheck size={16} className="mr-2" /> Tandai Pickup
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-600">
                            <Trash2 size={16} className="mr-2" /> Hapus
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
      </CardContent>
    </Card>
  );
};

export default ShipmentList;
