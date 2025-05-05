import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

// A simple couriers array
const couriers = [
  { id: 1, name: 'Agus Subagyo' },
  { id: 2, name: 'Budi Santoso' },
  { id: 3, name: 'Citra Dewi' },
  { id: 4, name: 'Dian Pratama' },
];

// Volume calculation constants
const DEFAULT_DIVISOR = 6000;

const ShipmentForm = () => {
  // Form state
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [shipmentType, setShipmentType] = useState('pickup');
  const [courier, setCourier] = useState('');
  const [ratePerKg, setRatePerKg] = useState('10000');
  const [packageDetails, setPackageDetails] = useState({
    length: '',
    width: '',
    height: '',
    weight: '',
    count: '1',
  });

  // Calculated values
  const volumeWeight = calculateVolumeWeight();
  const actualWeight = parseFloat(packageDetails.weight) || 0;
  const chargeableWeight = Math.max(volumeWeight, actualWeight);
  const totalPackages = parseInt(packageDetails.count) || 1;
  const totalShippingCost = calculateTotalCost();
  
  // Generate sample tracking number
  const [trackingNumber, setTrackingNumber] = useState('CGO' + Math.floor(100000 + Math.random() * 900000));
  
  function calculateVolumeWeight() {
    const length = parseFloat(packageDetails.length) || 0;
    const width = parseFloat(packageDetails.width) || 0;
    const height = parseFloat(packageDetails.height) || 0;
    
    return (length * width * height) / DEFAULT_DIVISOR;
  }
  
  function calculateTotalCost() {
    const rate = parseFloat(ratePerKg) || 0;
    return chargeableWeight * rate * totalPackages;
  }
  
  const handlePackageDetailChange = (field, value) => {
    setPackageDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Pengiriman berhasil dibuat!', {
      description: `Nomor resi: ${trackingNumber}`
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>
            <h2 className="text-xl font-bold">Pengiriman Baru</h2>
          </CardTitle>
          <Tabs defaultValue="sender-recipient">
            <TabsList className="mb-4">
              <TabsTrigger value="sender-recipient">Data Pengirim & Penerima</TabsTrigger>
              <TabsTrigger value="package-details">Detail Paket</TabsTrigger>
              <TabsTrigger value="shipping-cost">Ongkir & Kurir</TabsTrigger>
            </TabsList>
            <TabsContent value="sender-recipient">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sender">Nama Pengirim</Label>
                  <Input 
                    id="sender" 
                    value={sender} 
                    onChange={(e) => setSender(e.target.value)} 
                    placeholder="Nama lengkap pengirim" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="recipient">Nama Penerima</Label>
                  <Input 
                    id="recipient" 
                    value={recipient} 
                    onChange={(e) => setRecipient(e.target.value)} 
                    placeholder="Nama lengkap penerima" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Tujuan</Label>
                  <Input 
                    id="address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)} 
                    placeholder="Alamat lengkap tujuan pengiriman" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">No. HP Penerima</Label>
                  <Input 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="Format: 08xxxx" 
                    required 
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="package-details">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shipment-type">Jenis Pengiriman</Label>
                  <Select 
                    id="shipment-type" 
                    value={shipmentType} 
                    onValueChange={setShipmentType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis pengiriman" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup</SelectItem>
                      <SelectItem value="dropoff">Drop-off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package-count">Jumlah Paket</Label>
                  <Input 
                    id="package-count" 
                    value={packageDetails.count} 
                    onChange={(e) => handlePackageDetailChange('count', e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package-length">Panjang (cm)</Label>
                  <Input 
                    id="package-length" 
                    value={packageDetails.length} 
                    onChange={(e) => handlePackageDetailChange('length', e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package-width">Lebar (cm)</Label>
                  <Input 
                    id="package-width" 
                    value={packageDetails.width} 
                    onChange={(e) => handlePackageDetailChange('width', e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package-height">Tinggi (cm)</Label>
                  <Input 
                    id="package-height" 
                    value={packageDetails.height} 
                    onChange={(e) => handlePackageDetailChange('height', e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="package-weight">Berat Aktual (kg)</Label>
                  <Input 
                    id="package-weight" 
                    value={packageDetails.weight} 
                    onChange={(e) => handlePackageDetailChange('weight', e.target.value)} 
                    required 
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="shipping-cost">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="courier">Kurir</Label>
                  <Select
                    id="courier"
                    value={courier}
                    onValueChange={setCourier}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kurir" />
                    </SelectTrigger>
                    <SelectContent>
                      {couriers.map(courier => (
                        <SelectItem key={courier.id} value={courier.id.toString()}>
                          {courier.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="rate-per-kg">Ongkir per kg (Rp)</Label>
                  <Input 
                    id="rate-per-kg" 
                    value={ratePerKg} 
                    onChange={(e) => setRatePerKg(e.target.value)} 
                    required 
                  />
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Berat Volume:</span>
                      <span className="ml-2 font-medium">{volumeWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Berat Aktual:</span>
                      <span className="ml-2 font-medium">{actualWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Berat Terpakai:</span>
                      <span className="ml-2 font-medium">{chargeableWeight.toFixed(2)} kg</span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Jumlah Paket:</span>
                      <span className="ml-2 font-medium">{totalPackages}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Nomor Resi:</span>
                      <span className="ml-2 font-medium">{trackingNumber}</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="text-base font-medium">
                      <span className="text-muted-foreground">Total Ongkir:</span>
                      <span className="ml-2 text-primary">Rp {totalShippingCost.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button">
            Batal
          </Button>
          <Button type="submit">
            Buat Pengiriman
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ShipmentForm;
