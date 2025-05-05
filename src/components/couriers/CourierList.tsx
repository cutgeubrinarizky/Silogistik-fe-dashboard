
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
    deliveries: 124,
    successful: 118,
    failed: 6,
  },
  {
    id: 2,
    name: 'Budi Santoso',
    phone: '081298765432',
    plateNumber: 'B 5678 ABC',
    active: true,
    deliveries: 98,
    successful: 92,
    failed: 6,
  },
  {
    id: 3,
    name: 'Citra Dewi',
    phone: '081245678901',
    plateNumber: 'B 9012 DEF',
    active: false,
    deliveries: 65,
    successful: 61,
    failed: 4,
  },
  {
    id: 4,
    name: 'Dian Pratama',
    phone: '081256789012',
    plateNumber: 'B 3456 GHI',
    active: true,
    deliveries: 112,
    successful: 105,
    failed: 7,
  },
];

const CourierForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCourier = null 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (courier: any) => void,
  editingCourier: any | null
}) => {
  const [name, setName] = useState(editingCourier?.name || '');
  const [phone, setPhone] = useState(editingCourier?.phone || '');
  const [plateNumber, setPlateNumber] = useState(editingCourier?.plateNumber || '');
  const [active, setActive] = useState(editingCourier?.active ?? true);

  const handleSubmit = (e: React.FormEvent) => {
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
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{editingCourier ? 'Edit Kurir' : 'Tambah Kurir Baru'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4 pt-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Kurir</Label>
          <Input 
            id="name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Nomor HP</Label>
          <Input 
            id="phone" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="plate">Plat Nomor</Label>
          <Input 
            id="plate" 
            value={plateNumber} 
            onChange={(e) => setPlateNumber(e.target.value)} 
            required 
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Switch 
            id="active" 
            checked={active} 
            onCheckedChange={setActive} 
          />
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
      </form>
    </DialogContent>
  );
};

const CourierList = () => {
  const [couriers, setCouriers] = useState(initialCouriers);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editingCourier, setEditingCourier] = useState<any | null>(null);

  const filteredCouriers = couriers.filter(courier => 
    courier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    courier.phone.includes(searchQuery) ||
    courier.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNewCourier = () => {
    setEditingCourier(null);
    setShowDialog(true);
  };

  const handleEditCourier = (courier: any) => {
    setEditingCourier(courier);
    setShowDialog(true);
  };

  const handleSaveCourier = (courier: any) => {
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

  const handleDeleteCourier = (id: number) => {
    setCouriers(prev => prev.filter(courier => courier.id !== id));
    toast.success('Kurir berhasil dihapus');
  };

  const calculateSuccessRate = (successful: number, total: number) => {
    if (total === 0) return '0%';
    return `${Math.round((successful / total) * 100)}%`;
  };

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 space-y-4 sm:space-y-0">
        <CardTitle>Daftar Kurir</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCcw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="h-9" onClick={handleAddNewCourier}>
            <Plus size={16} className="mr-2" /> Tambah Kurir
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder="Cari kurir..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
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
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCouriers.map((courier) => (
                  <TableRow key={courier.id}>
                    <TableCell className="font-medium">{courier.name}</TableCell>
                    <TableCell>{courier.phone}</TableCell>
                    <TableCell>{courier.plateNumber}</TableCell>
                    <TableCell>
                      {courier.active ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Aktif</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Nonaktif</Badge>
                      )}
                    </TableCell>
                    <TableCell>{courier.deliveries}</TableCell>
                    <TableCell className="text-green-600">{courier.successful} ({calculateSuccessRate(courier.successful, courier.deliveries)})</TableCell>
                    <TableCell className="text-red-600">{courier.failed}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer" onClick={() => handleEditCourier(courier)}>
                            <Edit size={16} className="mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <BarChart size={16} className="mr-2" /> Lihat Kinerja
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer text-red-600"
                            onClick={() => handleDeleteCourier(courier.id)}
                          >
                            <Trash2 size={16} className="mr-2" /> Hapus
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCouriers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      Tidak ada data kurir yang sesuai
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <CourierForm 
          isOpen={showDialog}
          onClose={() => setShowDialog(false)}
          onSave={handleSaveCourier}
          editingCourier={editingCourier}
        />
      </Dialog>
    </Card>
  );
};

export default CourierList;
