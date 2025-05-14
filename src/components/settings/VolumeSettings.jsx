import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const VolumeSettings = () => {
  const [volumeDivisor, setVolumeDivisor] = useState('6000');
  const [defaultRate, setDefaultRate] = useState('10000');
  
  const handleSaveSettings = () => {
    toast.success('Pengaturan berhasil disimpan');
  };
  
  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-[#0C4A6E]">Pengali Berat Volume</h3>
              <p className="text-sm text-[#0C4A6E]/70 mt-1">
                Atur nilai pengali untuk menghitung berat volume paket
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="volume-divisor" className="text-[#0C4A6E]">Nilai Pengali Volume</Label>
                  <Input 
                    id="volume-divisor" 
                    value={volumeDivisor} 
                    onChange={(e) => setVolumeDivisor(e.target.value)}
                    className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                  />
                </div>
                <p className="text-sm text-[#0C4A6E]/70 mt-2">
                  Formula: (P × L × T) ÷ {volumeDivisor} = Berat Volume (kg)
                </p>
              </div>
              <div className="p-4 bg-[#FF6B2C]/5 rounded-lg border border-[#FF6B2C]/10">
                <p className="font-medium text-[#0C4A6E] mb-2">Contoh Perhitungan:</p>
                <div className="text-sm text-[#0C4A6E]/70">
                  Paket dengan ukuran 30 × 20 × 15 cm
                  <br />
                  Berat Volume = (30 × 20 × 15) ÷ {volumeDivisor} = {((30 * 20 * 15) / parseInt(volumeDivisor)).toFixed(2)} kg
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSaveSettings}
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
            >
              Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-[#0C4A6E]">Tarif Default Ongkir</h3>
              <p className="text-sm text-[#0C4A6E]/70 mt-1">
                Atur tarif default ongkir per kg untuk pengiriman
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <div className="space-y-2">
                  <Label htmlFor="default-rate" className="text-[#0C4A6E]">Tarif Default (Rp/kg)</Label>
                  <Input 
                    id="default-rate" 
                    value={defaultRate} 
                    onChange={(e) => setDefaultRate(e.target.value)}
                    className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                  />
                </div>
                <p className="text-sm text-[#0C4A6E]/70 mt-2">
                  Tarif ini akan digunakan sebagai nilai default saat membuat pengiriman baru
                </p>
              </div>
              <div className="p-4 bg-[#FF6B2C]/5 rounded-lg border border-[#FF6B2C]/10">
                <p className="font-medium text-[#0C4A6E] mb-2">Contoh Perhitungan:</p>
                <div className="text-sm text-[#0C4A6E]/70">
                  Berat Terpakai: 2.5 kg
                  <br />
                  Ongkir = 2.5 kg × Rp {parseInt(defaultRate).toLocaleString('id-ID')}/kg = Rp {(2.5 * parseInt(defaultRate)).toLocaleString('id-ID')}
                </div>
              </div>
            </div>
            <Button 
              onClick={handleSaveSettings}
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
            >
              Simpan Pengaturan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VolumeSettings;
