
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
      return <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-medium px-3 py-1 rounded-full">Pickup</Badge>;
    case 'transit':
      return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 font-medium px-3 py-1 rounded-full">Dalam Perjalanan</Badge>;
    case 'delivered':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200 font-medium px-3 py-1 rounded-full">Terkirim</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200 font-medium px-3 py-1 rounded-full">Gagal</Badge>;
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
    <Card className="border-0 shadow-card overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 space-y-4 sm:space-y-0 border-b">
        <CardTitle>Daftar Pengiriman</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-9 border-gray-200 hover:border-gray-300 hover:bg-gray-50">
            <Filter size={16} className="mr-2 text-gray-500" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="h-9 border-gray-200 hover:border-gray-300 hover:bg-gray-50">
            <RefreshCcw size={16} className="mr-2 text-gray-500" />
            Refresh
          </Button>
          <Button size="sm" className="h-9 bg-modern-primary hover:bg-modern-primary/90" asChild>
            <Link to="/shipments/new">
              + Pengiriman Baru
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input placeholder="Cari nomor resi atau nama..." className="border-gray-200 focus:border-modern-primary" />
            </div>
            <Select value={filter.status} onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-[180px] border-gray-200 bg-white">
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
              <SelectTrigger className="w-[180px] border-gray-200 bg-white">
                <SelectValue placeholder="Jenis Pengiriman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="dropoff">Drop-off</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[100px] font-medium">No. Resi</TableHead>
                  <TableHead className="font-medium">Penerima</TableHead>
                  <TableHead className="font-medium">Status</TableHead>
                  <TableHead className="font-medium">Kurir</TableHead>
                  <TableHead className="font-medium">Berat Final</TableHead>
                  <TableHead className="font-medium">Ongkir</TableHead>
                  <TableHead className="font-medium">Tanggal</TableHead>
                  <TableHead className="text-right font-medium">Aksi</TableHead>
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
