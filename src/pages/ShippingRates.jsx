import React, { useState } from 'react';
import { Package, Pencil, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from '@/components/ui/card';

// Data kota (contoh)
const cities = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Medan",
  "Semarang",
  "Makassar",
  "Palembang",
  "Tangerang",
  "Depok",
  "Bekasi"
];

// Data tarif pengiriman (contoh)
const initialRates = [
  { id: 1, origin: "Jakarta", destination: "Surabaya", price: 15000 },
  { id: 2, origin: "Jakarta", destination: "Bandung", price: 12000 },
  { id: 3, origin: "Jakarta", destination: "Medan", price: 25000 },
  { id: 4, origin: "Surabaya", destination: "Jakarta", price: 15000 },
  { id: 5, origin: "Bandung", destination: "Jakarta", price: 12000 },
];

const ShippingRates = () => {
  const [rates, setRates] = useState(initialRates);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [newRate, setNewRate] = useState({
    id: null,
    origin: '',
    destination: '',
    price: ''
  });

  const handleAddOrUpdateRate = () => {
    if (!newRate.origin || !newRate.destination || !newRate.price) {
      // TODO: Show error toast
      return;
    }

    if (isEditing) {
      // Update existing rate
      setRates(rates.map(rate => 
        rate.id === newRate.id ? { ...newRate, price: Number(newRate.price) } : rate
      ));
      setIsEditing(false);
    } else {
      // Add new rate
      const newId = Math.max(...rates.map(rate => rate.id), 0) + 1;
      setRates([...rates, { ...newRate, id: newId, price: Number(newRate.price) }]);
    }

    // Reset form
    setNewRate({
      id: null,
      origin: '',
      destination: '',
      price: ''
    });
  };

  const handleEditRate = (rate) => {
    setNewRate({
      id: rate.id,
      origin: rate.origin,
      destination: rate.destination,
      price: rate.price.toString()
    });
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setNewRate({
      id: null,
      origin: '',
      destination: '',
      price: ''
    });
  };

  const handleDeleteRate = (id) => {
    setRates(rates.filter(rate => rate.id !== id));
  };

  const filteredRates = rates.filter(rate => 
    rate.origin.toLowerCase().includes(search.toLowerCase()) ||
    rate.destination.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
            <Package className="h-6 w-6 text-[#FF6B2C]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#0C4A6E]">Manajemen Ongkir</h1>
            <p className="text-[#0C4A6E]/70 mt-1">
              Tetapkan tarif pengiriman antara kota asal dan tujuan
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Tambah/Edit Ongkir */}
        <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-[#0C4A6E] block mb-1.5">
                  Kota Asal
                </label>
                <Select
                  value={newRate.origin}
                  onValueChange={(value) => setNewRate({ ...newRate, origin: value })}
                >
                  <SelectTrigger className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="Pilih kota asal" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#0C4A6E] block mb-1.5">
                  Kota Tujuan
                </label>
                <Select
                  value={newRate.destination}
                  onValueChange={(value) => setNewRate({ ...newRate, destination: value })}
                >
                  <SelectTrigger className="w-full bg-white border-gray-200">
                    <SelectValue placeholder="Pilih kota tujuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-[#0C4A6E] block mb-1.5">
                  Harga per Kg (Rp)
                </label>
                <Input
                  type="number"
                  placeholder="Masukkan harga per kg"
                  value={newRate.price}
                  onChange={(e) => setNewRate({ ...newRate, price: e.target.value })}
                  className="bg-white border-gray-200"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
                  onClick={handleAddOrUpdateRate}
                >
                  {isEditing ? 'Update Ongkir' : 'Tambah Ongkir'}
                </Button>
                {isEditing && (
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleCancelEdit}
                  >
                    Batal
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabel Ongkir */}
        <Card className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100">
          <CardContent className="p-6">
            <div className="mb-4">
              <Input
                placeholder="Cari kota..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm bg-gray-50/80 border-0"
              />
            </div>
            
            <div className="rounded-lg border border-gray-100">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="text-[#0C4A6E]/70 font-medium">Kota Asal</TableHead>
                    <TableHead className="text-[#0C4A6E]/70 font-medium">Kota Tujuan</TableHead>
                    <TableHead className="text-[#0C4A6E]/70 font-medium">Harga per Kg (Rp)</TableHead>
                    <TableHead className="text-right text-[#0C4A6E]/70 font-medium">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell className="font-medium text-[#0C4A6E]">{rate.origin}</TableCell>
                      <TableCell className="text-[#0C4A6E]/80">{rate.destination}</TableCell>
                      <TableCell className="text-[#0C4A6E]/80">{rate.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-[#0C4A6E]/70 hover:text-[#0C4A6E] hover:bg-gray-100"
                            onClick={() => handleEditRate(rate)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600/70 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteRate(rate.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingRates; 