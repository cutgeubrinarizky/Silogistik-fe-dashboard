import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';

const VolumeSettings = () => {
  const [volumeDivisor, setVolumeDivisor] = useState('6000');
  const [defaultRate, setDefaultRate] = useState('10000');
  
  const handleSaveSettings = () => {
    toast.success('Pengaturan berhasil disimpan');
  };
  
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengali Berat Volume</CardTitle>
          <CardDescription>
            Atur nilai pengali untuk menghitung berat volume paket
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="space-y-2">
              <Label htmlFor="volume-divisor">Nilai Pengali Volume</Label>
              <Input 
                id="volume-divisor" 
                value={volumeDivisor} 
                onChange={(e) => setVolumeDivisor(e.target.value)} 
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Formula: (P × L × T) ÷ {volumeDivisor} = Berat Volume (kg)
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium mb-2">Contoh Perhitungan:</p>
            <div className="text-sm">
              Paket dengan ukuran 30 × 20 × 15 cm
              <br />
              Berat Volume = (30 × 20 × 15) ÷ {volumeDivisor} = {((30 * 20 * 15) / parseInt(volumeDivisor)).toFixed(2)} kg
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings}>Simpan Pengaturan</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Tarif Default Ongkir</CardTitle>
          <CardDescription>
            Atur tarif default ongkir per kg untuk pengiriman
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="space-y-2">
              <Label htmlFor="default-rate">Tarif Default (Rp/kg)</Label>
              <Input 
                id="default-rate" 
                value={defaultRate} 
                onChange={(e) => setDefaultRate(e.target.value)} 
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Tarif ini akan digunakan sebagai nilai default saat membuat pengiriman baru
            </p>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="font-medium mb-2">Contoh Perhitungan:</p>
            <div className="text-sm">
              Berat Terpakai: 2.5 kg
              <br />
              Ongkir = 2.5 kg × Rp {parseInt(defaultRate).toLocaleString('id-ID')}/kg = Rp {(2.5 * parseInt(defaultRate)).toLocaleString('id-ID')}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveSettings}>Simpan Pengaturan</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VolumeSettings;
