import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
  MoreHorizontal, 
  Edit, 
  Trash2, 
  BarChart,
  Plus,
  RefreshCcw,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';

// Sample data for couriers
const initialCouriers = [
  {
    id: 1,
    name: 'Agus Subagyo',
    phone: '081234567890',
    plateNumber: 'B 1234 XYZ',
    active: true,
    deliveries: 150,
    successful: 142,
    failed: 8,
  },
  {
    id: 2,
    name: 'Budi Santoso',
    phone: '081298765432',
    plateNumber: 'B 5678 ABC',
    active: true,
    deliveries: 120,
    successful: 115,
    failed: 5,
  },
  {
    id: 3,
    name: 'Citra Dewi',
    phone: '081245678901',
    plateNumber: 'B 9012 DEF',
    active: false,
    deliveries: 95,
    successful: 90,
    failed: 5,
  },
  {
    id: 4,
    name: 'Dian Pratama',
    phone: '081256789012',
    plateNumber: 'B 3456 GHI',
    active: true,
    deliveries: 200,
    successful: 187,
    failed: 13,
  },
];

const CourierForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCourier = null 
}) => {
  const [name, setName] = useState(editingCourier?.name || '');
  const [phone, setPhone] = useState(editingCourier?.phone || '');
  const [plateNumber, setPlateNumber] = useState(editingCourier?.plateNumber || '');
  const [active, setActive] = useState(editingCourier?.active ?? true);

  const handleSubmit = (e) => {
    e.preventDefault();
    const courier = {
      id: editingCourier?.id || Date.now(),
      name,
      phone,
      plateNumber,
      active,
      deliveries: editingCourier?.deliveries || 0,
      successful: editingCourier?.successful || 0,
      failed: editingCourier?.failed || 0,
    };
    
    onSave(courier);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>{editingCourier ? 'Edit Kurir' : 'Tambah Kurir Baru'}</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Kurir</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor HP</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plateNumber">Plat Nomor</Label>
          <Input id="plateNumber" value={plateNumber} onChange={(e) => setPlateNumber(e.target.value)} 
            required 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch id="active" checked={active} onCheckedChange={setActive} />
          <Label htmlFor="active">Aktif</Label>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit">
            {editingCourier ? 'Simpan' : 'Tambah Kurir'}
          </Button>
        </div>
      </div>
    </form>
  );
};

const CourierList = () => {
  const [couriers, setCouriers] = useState(initialCouriers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCourier, setEditingCourier] = useState(null);

  const filteredCouriers = couriers.filter(courier => 
    courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    courier.phone.includes(searchQuery) ||
    courier.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNewCourier = () => {
    setEditingCourier(null);
    setShowDialog(true);
  };

  const handleEditCourier = (courier) => {
    setEditingCourier(courier);
    setShowDialog(true);
  };

  const handleSaveCourier = (courier) => {
    if (editingCourier) {
      // Update existing courier
      setCouriers(prev => 
        prev.map(c => c.id === courier.id ? courier : c)
      );
      toast.success('Kurir berhasil diperbarui');
    } else {
      // Add new courier
      setCouriers(prev => [...prev, courier]);
      toast.success('Kurir baru berhasil ditambahkan');
    }
  };

  const handleDeleteCourier = (id) => {
    setCouriers(prev => prev.filter(courier => courier.id !== id));
    toast.success('Kurir berhasil dihapus');
  };

  const calculateSuccessRate = (successful, total) => {
    if (total === 0) return '0%';
    return `${Math.round((successful / total) * 100)}%`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Daftar Kurir</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={handleAddNewCourier}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Kurir
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="w-72">
            <Input 
              placeholder="Cari kurir..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Kurir</TableHead>
              <TableHead>Nomor HP</TableHead>
              <TableHead>Plat Nomor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Kiriman</TableHead>
              <TableHead>Sukses</TableHead>
              <TableHead>Gagal</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCouriers.map((courier) => (
              <TableRow key={courier.id}>
                <TableCell>{courier.name}</TableCell>
                <TableCell>{courier.phone}</TableCell>
                <TableCell>{courier.plateNumber}</TableCell>
                <TableCell>
                  <Badge variant={courier.active ? "success" : "secondary"}>
                    {courier.active ? "Aktif" : "Nonaktif"}
                  </Badge>
                </TableCell>
                <TableCell>{courier.deliveries}</TableCell>
                <TableCell>{courier.successful} ({calculateSuccessRate(courier.successful, courier.deliveries)})</TableCell>
                <TableCell>{courier.failed}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditCourier(courier)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteCourier(courier.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Hapus
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart className="mr-2 h-4 w-4" />
                        Lihat Performa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
            {filteredCouriers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-muted-foreground">
                  Tidak ada data kurir yang sesuai
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <CourierForm 
            onClose={() => setShowDialog(false)}
            onSave={handleSaveCourier}
            editingCourier={editingCourier}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default CourierList;
