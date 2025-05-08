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
  PackageCheck,
  Copy,
  ArrowRightLeft,
  Package,
  Download,
  X,
  Box,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import ShipmentLabel from './ShipmentLabel';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';

// Sample data for shipments
const shipments = [
  {
    id: 1,
    trackingNumber: 'CGO123456',
    sender: { name: 'PT. Sumber Jaya', phone: '08123456789', address: { province: 'Jawa Barat', city: 'Bandung', district: 'Coblong' } },
    recipient: { name: 'Ahmad Rasyid', phone: '08987654321', address: { province: 'Jawa Tengah', city: 'Semarang', district: 'Candisari', street: 'Jl. Diponegoro' } },
    items: [
      { id: 1, name: 'Buku', weight: '1', quantity: '2', length: '20', width: '15', height: '3' }
    ],
    shipmentType: 'pickup',
    courier: 'Agus Subagyo',
    marketing: 'Agus',
    discount: 0,
    status: 'pickup',
    cost: 25000,
    date: '2025-05-01',
  },
  {
    id: 2,
    trackingNumber: 'CGO234567',
    sender: { name: 'CV. Maju Jaya', phone: '081222333444', address: { province: 'Jawa Timur', city: 'Surabaya', district: 'Tegalsari' } },
    recipient: { name: 'Budi Santoso', phone: '082233445566', address: { province: 'Jawa Barat', city: 'Bekasi', district: 'Bekasi Timur', street: 'Jl. Ahmad Yani' } },
    items: [
      { id: 2, name: 'Elektronik', weight: '3', quantity: '1', length: '30', width: '20', height: '10' }
    ],
    shipmentType: 'dropoff',
    courier: 'Citra Dewi',
    marketing: 'Budi',
    discount: 5000,
    status: 'transit',
    cost: 15000,
    date: '2025-05-02',
  },
  {
    id: 3,
    trackingNumber: 'CGO345678',
    sender: { name: 'Toko Sukses', phone: '081355566677', address: { province: 'DKI Jakarta', city: 'Jakarta Selatan', district: 'Kebayoran Baru' } },
    recipient: { name: 'Dewi Putri', phone: '083344556677', address: { province: 'Banten', city: 'Tangerang', district: 'Cipondoh', street: 'Jl. Merdeka' } },
    items: [
      { id: 3, name: 'Pakaian', weight: '2', quantity: '5', length: '25', width: '20', height: '5' }
    ],
    shipmentType: 'pickup',
    courier: 'Budi Santoso',
    marketing: 'Dewi',
    discount: 0,
    status: 'delivered',
    cost: 30000,
    date: '2025-05-02',
  },
  {
    id: 4,
    trackingNumber: 'CGO456789',
    sender: { name: 'PT. Amanah', phone: '081466677788', address: { province: 'Jawa Tengah', city: 'Solo', district: 'Laweyan' } },
    recipient: { name: 'Eko Prasetyo', phone: '084455667788', address: { province: 'Jawa Timur', city: 'Malang', district: 'Klojen', street: 'Jl. Ijen' } },
    items: [
      { id: 4, name: 'Makanan', weight: '1', quantity: '10', length: '10', width: '10', height: '10' }
    ],
    shipmentType: 'dropoff',
    courier: 'Dian Pratama',
    marketing: 'Eko',
    discount: 2000,
    status: 'failed',
    cost: 10000,
    date: '2025-05-03',
  },
  {
    id: 5,
    trackingNumber: 'CGO567890',
    sender: { name: 'UD. Makmur', phone: '081577788899', address: { province: 'Bali', city: 'Denpasar', district: 'Denpasar Barat' } },
    recipient: { name: 'Fira Zahra', phone: '085566778899', address: { province: 'Bali', city: 'Badung', district: 'Kuta', street: 'Jl. Sunset Road' } },
    items: [
      { id: 5, name: 'Aksesoris', weight: '0.5', quantity: '20', length: '5', width: '5', height: '2' }
    ],
    shipmentType: 'pickup',
    courier: 'Agus Subagyo',
    marketing: 'Fira',
    discount: 0,
    status: 'transit',
    cost: 50000,
    date: '2025-05-04',
  }
];

// Helper function to get status badge
const getStatusBadge = (status) => {
  const variants = {
    pickup: { label: "Pickup", variant: "warning", className: "bg-[#FF6B2C]/10 text-[#FF6B2C] border-[#FF6B2C]/20" },
    transit: { label: "Dalam Perjalanan", variant: "info", className: "bg-[#0C4A6E]/10 text-[#0C4A6E] border-[#0C4A6E]/20" },
    delivered: { label: "Terkirim", variant: "success", className: "bg-green-100 text-green-700 border-green-200" },
    failed: { label: "Gagal", variant: "destructive", className: "bg-red-100 text-red-700 border-red-200" }
  };

  const statusInfo = variants[status] || { label: status, variant: "default", className: "" };
  
  return (
    <Badge variant={statusInfo.variant} className={statusInfo.className}>
      {statusInfo.label}
    </Badge>
  );
};

const UpdateStatusModal = ({ shipment, onClose, onUpdate }) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [updateDate, setUpdateDate] = useState(format(new Date(), 'yyyy-MM-dd'));
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
        return <Box className="h-4 w-4 text-[#FF6B2C]" />;
      case 'in transit':
        return <Truck className="h-4 w-4 text-[#0C4A6E]" />;
      case 'delivered':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return null;
    }
  };

  const handleUpdate = () => {
    if (!selectedStatus) {
      toast.error('Silakan pilih status pengiriman');
      return;
    }
    onUpdate({
      status: selectedStatus,
      date: updateDate,
      notes: notes
    });
    onClose();
    toast.success('Status pengiriman berhasil diperbarui');
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] p-0">
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-[#0C4A6E]">Update Status Pengiriman</h2>
          </div>

          {/* Nomor Resi */}
          <div className="mb-5">
            <div className="text-sm text-gray-500 mb-1.5">Nomor Resi</div>
            <div className="p-2.5 bg-gray-50 rounded-lg text-[#0C4A6E] font-medium text-sm">
              {shipment?.trackingNumber}
            </div>
          </div>

          <div className="grid grid-cols-[1fr,1.2fr] gap-6">
            {/* Form - Left Column */}
            <div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1.5">Status</div>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full bg-white border-gray-200 h-10 text-sm">
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
                  <div className="text-sm text-gray-500 mb-1.5">Tanggal Update</div>
                  <Input
                    type="date"
                    value={updateDate}
                    onChange={(e) => setUpdateDate(e.target.value)}
                    className="bg-white border-gray-200 h-10 text-sm"
                  />
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1.5">Keterangan</div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Masukkan keterangan (opsional)"
                    className="min-h-[100px] bg-white border-gray-200 text-sm resize-none focus:ring-1 focus:ring-[#0C4A6E]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="h-9 px-4 text-sm font-medium hover:bg-gray-50"
                  >
                    Batal
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    className="bg-[#0C4A6E] hover:bg-[#0C4A6E]/90 text-white h-9 px-4 text-sm font-medium"
                  >
                    Update Status
                  </Button>
                </div>
              </div>
            </div>

            {/* History Status - Right Column */}
            <div className="border-l pl-6">
              <div className="text-sm text-gray-500 mb-4">History Status</div>
              <div className="relative">
                {statusHistory.map((item, index) => (
                  <div key={index} className="flex gap-3 mb-6 relative group">
                    <div className="flex flex-col items-center">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                        index === statusHistory.length - 1 
                          ? 'bg-green-100 group-hover:bg-green-200' 
                          : 'bg-gray-100 group-hover:bg-gray-200'
                      }`}>
                        {getStatusIcon(item.status)}
                      </div>
                      {index !== statusHistory.length - 1 && (
                        <div className="absolute top-7 left-3.5 w-[1px] h-12 bg-gray-200 group-hover:bg-gray-300 transition-colors"></div>
                      )}
                    </div>
                    <div className="group-hover:bg-gray-50 p-2 rounded-lg transition-colors -ml-2 flex-1">
                      <div className="font-medium text-[#0C4A6E] text-sm">
                        {item.status === 'pickup' ? 'Pickup' :
                         item.status === 'transit' ? 'In Transit' :
                         item.status === 'delivered' ? 'Delivered' : item.status}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{item.date}</div>
                      <div className="text-xs text-gray-600 mt-1">{item.description}</div>
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

const ShipmentList = () => {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({
    status: 'all',
    courier: 'all',
    type: 'all',
  });
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [showLabel, setShowLabel] = useState(false);
  const [showUpdateStatus, setShowUpdateStatus] = useState(false);
  const navigate = useNavigate();

  const handleDuplicate = (shipment) => {
    const { trackingNumber, ...shipmentData } = shipment;
    navigate('/shipments/new', { state: { shipment: shipmentData, duplicate: true } });
  };

  const handleEdit = (shipment, e) => {
    e.stopPropagation();
    navigate('/shipments/new', { 
      state: { 
        shipment,
        isEdit: true
      } 
    });
  };

  const handlePrint = (shipment, e) => {
    e.stopPropagation();
    setSelectedShipment(shipment);
    setShowLabel(true);
  };

  const handleUpdateStatus = (shipment, e) => {
    e.stopPropagation();
    setSelectedShipment(shipment);
    setShowUpdateStatus(true);
  };

  const handleStatusUpdate = (updateData) => {
    // TODO: Implement status update logic
    console.log('Status updated:', updateData);
  };

  return (
    <>
      <Card className="border-0 shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6 pt-6 px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            {/* <div className="p-2 bg-[#FF6B2C]/10 rounded-lg">
              <Package className="h-5 w-5 text-[#FF6B2C]" />
            </div> */}
            <CardTitle className="text-[#0C4A6E] text-xl font-semibold">Daftar Pengiriman</CardTitle>
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
              value={filter.status}
              onValueChange={value => setFilter(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
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
            <Select
              value={filter.courier}
              onValueChange={value => setFilter(prev => ({ ...prev, courier: value }))}
            >
              <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
                <SelectValue placeholder="Kurir" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kurir</SelectItem>
                <SelectItem value="Agus Subagyo">Agus Subagyo</SelectItem>
                <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                <SelectItem value="Citra Dewi">Citra Dewi</SelectItem>
                <SelectItem value="Dian Pratama">Dian Pratama</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filter.type}
              onValueChange={value => setFilter(prev => ({ ...prev, type: value }))}
            >
              <SelectTrigger className="w-[140px] bg-gray-50/80 border-0 focus:ring-1 focus:ring-[#FF6B2C]/10 text-sm">
                <SelectValue placeholder="Jenis Kiriman" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="dropoff">Drop-off</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white shadow-sm px-4 h-9"
              asChild
            >
              <Link to="/shipments/new">
                + Pengiriman Baru
              </Link>
            </Button>
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
                <TableHead className="text-[#0C4A6E]/70 font-medium">Status</TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">Berat</TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">Kurir</TableHead>
                <TableHead className="text-[#0C4A6E]/70 font-medium">Tanggal</TableHead>
                <TableHead className="text-right text-[#0C4A6E]/70 font-medium">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments
                .filter(s =>
                  (filter.status === 'all' || s.status === filter.status) &&
                  (filter.courier === 'all' || s.courier === filter.courier) &&
                  (filter.type === 'all' || s.shipmentType === filter.type) &&
                  (
                    s.trackingNumber.toLowerCase().includes(search.toLowerCase()) ||
                    s.sender.name.toLowerCase().includes(search.toLowerCase()) ||
                    s.recipient.name.toLowerCase().includes(search.toLowerCase())
                  )
                )
                .map((shipment) => (
                  <TableRow key={shipment.id} className="cursor-pointer hover:bg-gray-50/80 transition-all border-b border-gray-100" onClick={() => {/* TODO: buka popup detail */}}>
                    <TableCell className="font-medium text-[#0C4A6E]">{shipment.trackingNumber}</TableCell>
                    <TableCell className="text-[#0C4A6E]/80">{shipment.sender.name}</TableCell>
                    <TableCell className="text-[#0C4A6E]/80">{shipment.recipient.name}</TableCell>
                    <TableCell className="text-[#0C4A6E]/80">{shipment.sender.address.city}</TableCell>
                    <TableCell className="text-[#0C4A6E]/80">{shipment.recipient.address.city}</TableCell>
                    <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                    <TableCell className="text-[#0C4A6E]/80">{shipment.items.reduce((sum, item) => sum + Number(item.weight) * Number(item.quantity), 0)} kg</TableCell>
                    <TableCell className="text-[#0C4A6E]/80">{shipment.courier}</TableCell>
                    <TableCell className="text-[#0C4A6E]/80">{new Date(shipment.date).toLocaleDateString('id-ID')}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#FF6B2C] hover:text-[#FF6B2C] hover:bg-[#FF6B2C]/10"
                          onClick={e => { e.stopPropagation(); handleUpdateStatus(shipment, e); }}
                          title="Update Status"
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100 text-[#0C4A6E]/70 hover:text-[#0C4A6E]"
                              onClick={e => e.stopPropagation()}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              onClick={(e) => handleEdit(shipment, e)} 
                              className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                            >
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => handlePrint(shipment, e)} 
                              className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                            >
                              <Printer className="mr-2 h-4 w-4" /> Cetak Label
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={e => { e.stopPropagation(); handleDuplicate(shipment); }} 
                              className="text-[#0C4A6E] hover:text-[#FF6B2C] cursor-pointer"
                            >
                              <Copy className="mr-2 h-4 w-4" /> Duplikat
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={e => e.stopPropagation()} 
                              className="text-red-600 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {showLabel && selectedShipment && (
        <ShipmentLabel 
          shipment={selectedShipment} 
          onClose={() => {
            setShowLabel(false);
            setSelectedShipment(null);
          }}
        />
      )}

      {showUpdateStatus && selectedShipment && (
        <UpdateStatusModal
          shipment={selectedShipment}
          onClose={() => {
            setShowUpdateStatus(false);
            setSelectedShipment(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}
    </>
  );
};

export default ShipmentList;
