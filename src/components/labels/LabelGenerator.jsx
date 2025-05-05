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
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [previewShipment, setPreviewShipment] = useState(shipments[0]);

  const filteredShipments = shipments.filter(shipment => 
    shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.recipient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (shipmentId) => {
    setSelectedShipments(prev => {
      if (prev.includes(shipmentId)) {
        return prev.filter(id => id !== shipmentId);
      } else {
        return [...prev, shipmentId];
      }
    });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedShipments(filteredShipments.map(s => s.id));
    } else {
      setSelectedShipments([]);
    }
  };

  const handlePreview = (shipment) => {
    setPreviewShipment(shipment);
  };

  return (
    <div className="grid gap-6 md:grid-cols-5">
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Cetak Label & Invoice</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="search">
            <TabsList className="mb-4">
              <TabsTrigger value="search">Cari Pengiriman</TabsTrigger>
              <TabsTrigger value="settings">Pengaturan Cetak</TabsTrigger>
            </TabsList>
            <TabsContent value="search">
              <div className="space-y-4">
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Cari no. resi atau nama penerima"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline">
                    <Search className="mr-2 h-4 w-4" /> Cari
                  </Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedShipments.length > 0}
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
                        <TableCell>{shipment.trackingNumber}</TableCell>
                        <TableCell>{shipment.recipient}</TableCell>
                        <TableCell>{new Date(shipment.date).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" onClick={() => handlePreview(shipment)}>
                            <ArrowRight className="h-4 w-4" /> Preview 
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredShipments.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          Tidak ada data pengiriman yang sesuai
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {selectedShipments.length > 0 ? (
                    <span>{selectedShipments.length} item dipilih</span>
                  ) : (
                    <span>Pilih item untuk dicetak</span>
                  )}
                </div>
                <Button disabled={selectedShipments.length === 0}>
                  <Printer className="mr-2 h-4 w-4" /> Cetak Label ({selectedShipments.length})
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="font-medium">Ukuran Label</label>
                  <Select value={labelSize} onValueChange={setLabelSize}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih ukuran label" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="thermal">Thermal (10x15 cm)</SelectItem>
                      <SelectItem value="a4-2">A4 (2 Label per Halaman)</SelectItem>
                      <SelectItem value="a4-4">A4 (4 Label per Halaman)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    {labelSize === 'thermal' 
                      ? 'Label thermal dengan ukuran 10x15 cm, cocok untuk printer thermal.' 
                      : labelSize === 'a4-2'
                        ? 'Format A4 dengan 2 label per halaman (atas dan bawah).'
                        : 'Format A4 dengan 4 label per halaman (2x2 grid).'}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Preview Section */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Preview Label</CardTitle>
        </CardHeader>
        <CardContent>
          {previewShipment && (
            <div className="border rounded-lg p-4">
              <ShipmentLabel shipment={previewShipment} size={labelSize} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default LabelGenerator;
