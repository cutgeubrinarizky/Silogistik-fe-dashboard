
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
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowRight, Printer, Search } from 'lucide-react';
import ShipmentLabel from './ShipmentLabel';

// Sample shipment data
const shipments = [
  {
    id: 1,
    trackingNumber: 'CGO123456',
    sender: 'PT Global Express',
    recipient: 'Ahmad Rasyid',
    address: 'Jl. Melati No. 23, Jakarta Selatan',
    phone: '081234567890',
    courier: 'Agus Subagyo',
    date: '2025-05-05',
    weight: 2.5,
    selected: false,
  },
  {
    id: 2,
    trackingNumber: 'CGO234567',
    sender: 'PT Global Express',
    recipient: 'Budi Santoso',
    address: 'Jl. Anggrek No. 45, Jakarta Barat',
    phone: '081298765432',
    courier: 'Citra Dewi',
    date: '2025-05-05',
    weight: 1.5,
    selected: false,
  },
  {
    id: 3,
    trackingNumber: 'CGO345678',
    sender: 'PT Global Express',
    recipient: 'Dewi Putri',
    address: 'Jl. Mawar No. 12, Jakarta Timur',
    phone: '081345678901',
    courier: 'Budi Santoso',
    date: '2025-05-05',
    weight: 3.0,
    selected: false,
  },
];

const LabelGenerator = () => {
  const [labelSize, setLabelSize] = useState('thermal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipments, setSelectedShipments] = useState<number[]>([]);
  const [previewShipment, setPreviewShipment] = useState(shipments[0]);

  const filteredShipments = shipments.filter(shipment => 
    shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (shipmentId: number) => {
    setSelectedShipments(prev => {
      if (prev.includes(shipmentId)) {
        return prev.filter(id => id !== shipmentId);
      } else {
        return [...prev, shipmentId];
      }
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedShipments(filteredShipments.map(s => s.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handlePreview = (shipment: any) => {
    setPreviewShipment(shipment);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Cetak Label & Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search">Cari Pengiriman</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan Cetak</TabsTrigger>
            </TabsList>
            
            <TabsContent value="search" className="space-y-4 pt-4">
              <div className="flex space-x-2">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                      type="search" 
                      placeholder="Cari nomor resi atau nama penerima..." 
                      className="pl-8" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Button>
                  <Search size={16} className="mr-2" /> Cari
                </Button>
              </div>
              
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox 
                          checked={selectedShipments.length === filteredShipments.length && filteredShipments.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>No. Resi</TableHead>
                      <TableHead>Penerima</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedShipments.includes(shipment.id)}
                            onCheckedChange={() => handleCheckboxChange(shipment.id)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                        <TableCell>{shipment.recipient}</TableCell>
                        <TableCell>{new Date(shipment.date).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handlePreview(shipment)}>
                            Preview <ArrowRight size={16} className="ml-1" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredShipments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          Tidak ada data pengiriman yang sesuai
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              <div className="flex justify-between items-center pt-4">
                <div>
                  {selectedShipments.length > 0 ? (
                    <span className="text-sm">{selectedShipments.length} item dipilih</span>
                  ) : (
                    <span className="text-sm text-gray-500">Pilih item untuk dicetak</span>
                  )}
                </div>
                <Button disabled={selectedShipments.length === 0}>
                  <Printer size={16} className="mr-2" /> Cetak Label ({selectedShipments.length})
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-4 pt-4">
              <div>
                <label className="text-sm font-medium">Ukuran Label</label>
                <Select value={labelSize} onValueChange={setLabelSize}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="thermal">Thermal (10x15 cm)</SelectItem>
                    <SelectItem value="a4-2">A4 (2 Label per Halaman)</SelectItem>
                    <SelectItem value="a4-4">A4 (4 Label per Halaman)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  {labelSize === 'thermal' 
                    ? 'Label thermal dengan ukuran 10x15 cm, cocok untuk printer thermal.' 
                    : labelSize === 'a4-2'
                      ? 'Format A4 dengan 2 label per halaman (atas dan bawah).'
                      : 'Format A4 dengan 4 label per halaman (2x2 grid).'}
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Preview Section */}
      <ShipmentLabel shipment={previewShipment} />
    </div>
  );
};

export default LabelGenerator;
