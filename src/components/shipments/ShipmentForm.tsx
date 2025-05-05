
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

interface PackageDetails {
  length: string;
  width: string;
  height: string;
  weight: string;
  count: string;
}

const ShipmentForm = () => {
  // Form state
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [shipmentType, setShipmentType] = useState('pickup');
  const [courier, setCourier] = useState('');
  const [ratePerKg, setRatePerKg] = useState('10000');
  const [packageDetails, setPackageDetails] = useState<PackageDetails>({
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
  
  function calculateVolumeWeight(): number {
    const length = parseFloat(packageDetails.length) || 0;
    const width = parseFloat(packageDetails.width) || 0;
    const height = parseFloat(packageDetails.height) || 0;
    
    return (length * width * height) / DEFAULT_DIVISOR;
  }
  
  function calculateTotalCost(): number {
    const rate = parseFloat(ratePerKg) || 0;
    return chargeableWeight * rate * totalPackages;
  }
  
  const handlePackageDetailChange = (field: keyof PackageDetails, value: string) => {
    setPackageDetails(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Pengiriman berhasil dibuat!', {
      description: `Nomor resi: ${trackingNumber}`
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Pengiriman Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sender" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="sender">Data Pengirim & Penerima</TabsTrigger>
                <TabsTrigger value="package">Detail Paket</TabsTrigger>
                <TabsTrigger value="shipping">Ongkir & Kurir</TabsTrigger>
              </TabsList>
              
              <TabsContent value="sender">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="sender">Nama Pengirim</Label>
                    <Input 
                      id="sender" 
                      value={sender} 
                      onChange={(e) => setSender(e.target.value)} 
                      placeholder="Nama lengkap pengirim" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="recipient">Nama Penerima</Label>
                    <Input 
                      id="recipient" 
                      value={recipient} 
                      onChange={(e) => setRecipient(e.target.value)} 
                      placeholder="Nama lengkap penerima" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Alamat Tujuan</Label>
                    <Input 
                      id="address" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)} 
                      placeholder="Alamat lengkap tujuan pengiriman" 
                      required 
                    />
                  </div>
                  
                  <div>
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
              
              <TabsContent value="package">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="shipment-type">Jenis Pengiriman</Label>
                    <Select 
                      value={shipmentType} 
                      onValueChange={setShipmentType}
                    >
                      <SelectTrigger id="shipment-type">
                        <SelectValue placeholder="Pilih jenis pengiriman" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="dropoff">Drop-off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="package-count">Jumlah Paket</Label>
                    <Input 
                      id="package-count" 
                      type="number" 
                      min="1" 
                      value={packageDetails.count} 
                      onChange={(e) => handlePackageDetailChange('count', e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="length">Panjang (cm)</Label>
                    <Input 
                      id="length" 
                      type="number" 
                      min="1" 
                      value={packageDetails.length} 
                      onChange={(e) => handlePackageDetailChange('length', e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="width">Lebar (cm)</Label>
                    <Input 
                      id="width" 
                      type="number" 
                      min="1" 
                      value={packageDetails.width} 
                      onChange={(e) => handlePackageDetailChange('width', e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="height">Tinggi (cm)</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      min="1" 
                      value={packageDetails.height} 
                      onChange={(e) => handlePackageDetailChange('height', e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="weight">Berat Aktual (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      min="0.1" 
                      step="0.1" 
                      value={packageDetails.weight} 
                      onChange={(e) => handlePackageDetailChange('weight', e.target.value)} 
                      required 
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="shipping">
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="courier">Kurir</Label>
                    <Select 
                      value={courier} 
                      onValueChange={setCourier}
                    >
                      <SelectTrigger id="courier">
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
                  
                  <div>
                    <Label htmlFor="rate">Ongkir per kg (Rp)</Label>
                    <Input 
                      id="rate" 
                      type="number" 
                      min="0" 
                      value={ratePerKg} 
                      onChange={(e) => setRatePerKg(e.target.value)} 
                      required 
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md mt-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <span className="text-sm font-medium text-gray-500">Berat Volume:</span>
                        <p className="text-sm font-semibold">{volumeWeight.toFixed(2)} kg</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Berat Aktual:</span>
                        <p className="text-sm font-semibold">{actualWeight.toFixed(2)} kg</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Berat Terpakai:</span>
                        <p className="text-sm font-semibold">{chargeableWeight.toFixed(2)} kg</p>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-500">Jumlah Paket:</span>
                        <p className="text-sm font-semibold">{totalPackages}</p>
                      </div>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nomor Resi:</span>
                      <p className="text-base font-semibold">{trackingNumber}</p>
                    </div>
                    
                    <Separator className="my-4" />
                    
                    <div>
                      <span className="text-sm font-medium text-gray-500">Total Ongkir:</span>
                      <p className="text-lg font-bold text-logistics-700">Rp {totalShippingCost.toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button">
              Batal
            </Button>
            <Button type="submit">
              Buat Pengiriman
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  );
};

export default ShipmentForm;
