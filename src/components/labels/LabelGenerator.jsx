import React, { useState, useEffect } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ArrowRight, Printer, Search } from 'lucide-react';
import ShipmentLabel from './ShipmentLabel';

// Konfigurasi desain label
const LABEL_DESIGNS = {
  standard: {
    name: 'Standar',
    description: 'Desain label standar dengan informasi lengkap',
    size: '10x15 cm',
    type: 'thermal',
    icon: '📦'
  },
  express: {
    name: 'Express',
    description: 'Desain label untuk pengiriman cepat dengan highlight tracking number',
    size: '10x15 cm',
    type: 'thermal',
    icon: '🚀'
  },
  fragile: {
    name: 'Fragile',
    description: 'Desain label khusus untuk barang rapuh dengan peringatan',
    size: '10x15 cm',
    type: 'thermal',
    icon: '⚠️'
  }
};

const LabelGenerator = ({ shipments = [], isLoading }) => {
  const [labelSize, setLabelSize] = useState('thermal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipments, setSelectedShipments] = useState([]);
  const [previewShipment, setPreviewShipment] = useState(shipments[0]);
  const [selectedDesign, setSelectedDesign] = useState('standard');

  useEffect(() => {
    if (shipments.length > 0 && !previewShipment) {
      setPreviewShipment(shipments[0]);
    }
  }, [shipments]);

  const filteredShipments = shipments.filter(shipment => 
    (shipment.tracking_number || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (shipment.recipient_name || shipment.recipient?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDesignChange = (design) => {
    setSelectedDesign(design);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
            <Printer className="h-6 w-6 text-[#FF6B2C]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0C4A6E]">Cetak Label & Invoice</h1>
            <p className="text-[#0C4A6E]/70 mt-1">Cetak label pengiriman dan invoice dengan mudah dan cepat</p>
          </div>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-5">
        <Card className="md:col-span-3 rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
          {/* <CardHeader className="pb-0">
            <CardTitle className="text-[#0C4A6E] text-xl font-bold">Cetak Label & Invoice</CardTitle>
          </CardHeader> */}
          <CardContent style={{ paddingTop: '30px' }}>
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="inline-flex p-1 gap-1 bg-gray-100/80 rounded-lg mb-4">
                <TabsTrigger
                  value="search"
                  className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
                >
                  Cari Pengiriman
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200 data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
                >
                  Pengaturan Cetak
                </TabsTrigger>
              </TabsList>
              <TabsContent value="search">
                <div className="space-y-4">
                  <div className="flex space-x-2">
                    <div className="flex-1">
                      <Input
                        placeholder="Cari no. resi atau nama penerima"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-gray-300 rounded-md"
                      />
                    </div>
                    <Button variant="outline" className="border-gray-300 text-[#0C4A6E]">
                      <Search className="mr-2 h-4 w-4" /> Cari
                    </Button>
                  </div>
                  <Table className="rounded-lg overflow-hidden border border-gray-200">
                    <TableHeader className="bg-gray-50">
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
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Memuat data...
                          </TableCell>
                        </TableRow>
                      ) : filteredShipments.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                            Tidak ada data pengiriman yang sesuai
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredShipments.map((shipment) => (
                          <TableRow key={shipment.id}>
                            <TableCell>
                              <Checkbox 
                                checked={selectedShipments.includes(shipment.id)}
                                onCheckedChange={() => handleCheckboxChange(shipment.id)}
                              />
                            </TableCell>
                            <TableCell>{shipment.tracking_number}</TableCell>
                            <TableCell>{shipment.recipient_name || shipment.recipient?.name}</TableCell>
                            <TableCell>
                              {shipment.created_at 
                                ? new Date(shipment.created_at).toLocaleDateString('id-ID')
                                : shipment.date 
                                  ? new Date(shipment.date).toLocaleDateString('id-ID')
                                  : '-'}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" className="text-[#FF6B2C] hover:bg-[#FF6B2C]/10" onClick={() => handlePreview(shipment)}>
                                <ArrowRight className="h-4 w-4" /> Preview 
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
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
                  <Button disabled={selectedShipments.length === 0} className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white">
                    <Printer className="mr-2 h-4 w-4" /> Cetak Label ({selectedShipments.length})
                  </Button>
                </div>
              </TabsContent>
              <TabsContent value="settings">
                <div className="space-y-6">
                  {/* Ukuran Label */}
                  <div className="space-y-2">
                    <Label className="font-medium">Ukuran Label</Label>
                    <Select value={labelSize} onValueChange={setLabelSize}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih ukuran label" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="thermal">Thermal (10x15 cm)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Label thermal dengan ukuran 10x15 cm, cocok untuk printer thermal.
                    </p>
                  </div>
                  {/* Pilihan Desain Label */}
                  <div className="space-y-2">
                    <Label className="font-medium">Pilih Desain Label</Label>
                    <RadioGroup 
                      value={selectedDesign} 
                      onValueChange={handleDesignChange}
                      className="grid grid-cols-2 md:grid-cols-3 gap-4"
                    >
                      {Object.entries(LABEL_DESIGNS).map(([key, design]) => (
                        <div key={key}>
                          <RadioGroupItem value={key} id={key} className="peer sr-only" />
                          <Label
                            htmlFor={key}
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                          >
                            <span className="text-2xl">{design.icon}</span>
                            <p className="font-medium">{design.name}</p>
                            <p className="text-xs text-muted-foreground text-center">{design.description}</p>
                            <p className="text-xs text-muted-foreground">Ukuran: {design.size}</p>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        {/* Preview Section */}
        <Card className="md:col-span-2 rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
          <CardHeader>
            <CardTitle className="text-[#0C4A6E] text-xl font-bold">Preview Label</CardTitle>
          </CardHeader>
          <CardContent>
            {previewShipment && (
              <div className="border rounded-lg p-4 bg-white">
                <ShipmentLabel 
                  shipment={previewShipment} 
                  size={labelSize}
                  design={selectedDesign}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LabelGenerator;
