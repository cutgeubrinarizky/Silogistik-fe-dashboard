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
const getStatusBadge = (status) => {
  const variants = {
    pickup: { label: "Pickup", variant: "warning" },
    transit: { label: "Dalam Perjalanan", variant: "info" },
    delivered: { label: "Terkirim", variant: "success" },
    failed: { label: "Gagal", variant: "destructive" }
  };

  const statusInfo = variants[status] || { label: status, variant: "default" };
  
  return (
    <Badge variant={statusInfo.variant}>
      {statusInfo.label}
    </Badge>
  );
};

const ShipmentList = () => {
  const [filter, setFilter] = useState({
    status: 'all',
    courier: '',
    type: 'all',
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daftar Pengiriman</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" asChild>
            <Link to="/shipments/new">
              + Pengiriman Baru
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-2 mb-4">
          <Select 
            value={filter.status} 
            onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="transit">Dalam Perjalanan</SelectItem>
              <SelectItem value="delivered">Terkirim</SelectItem>
              <SelectItem value="failed">Gagal</SelectItem>
            </SelectContent>
          </Select>
          <Select 
            value={filter.type} 
            onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Jenis" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis</SelectItem>
              <SelectItem value="pickup">Pickup</SelectItem>
              <SelectItem value="dropoff">Drop-off</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No. Resi</TableHead>
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
                <TableCell>{shipment.trackingNumber}</TableCell>
                <TableCell>{shipment.recipient}</TableCell>
                <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                <TableCell>{shipment.courier}</TableCell>
                <TableCell>{shipment.finalWeight} kg</TableCell>
                <TableCell>Rp {shipment.cost.toLocaleString('id-ID')}</TableCell>
                <TableCell>{new Date(shipment.date).toLocaleDateString('id-ID')}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="mr-2 h-4 w-4" /> Cetak Label
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="mr-2 h-4 w-4" /> Update Status
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <PackageCheck className="mr-2 h-4 w-4" /> Tandai Pickup
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="mr-2 h-4 w-4" /> Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ShipmentList;
