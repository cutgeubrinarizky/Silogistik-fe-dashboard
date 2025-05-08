import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Trash2, Edit, Archive, ArrowLeft, Package } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

// Volume calculation constants
const DEFAULT_DIVISOR = 6000;

// Data tarif pengiriman (contoh)
const shippingRates = [
  { id: 1, origin: "Jakarta", destination: "Surabaya", price: 15000 },
  { id: 2, origin: "Jakarta", destination: "Bandung", price: 12000 },
  { id: 3, origin: "Jakarta", destination: "Medan", price: 25000 },
  { id: 4, origin: "Surabaya", destination: "Jakarta", price: 15000 },
  { id: 5, origin: "Bandung", destination: "Jakarta", price: 12000 },
];

const ShipmentForm = () => {
  const location = useLocation();
  const shipmentData = location.state?.shipment;
  const isDuplicate = location.state?.duplicate;

  const defaultSender = { name: '', phone: '', address: { province: '', city: '', district: '' } };
  const defaultRecipient = { name: '', phone: '', address: { province: '', city: '', district: '', street: '' } };

  // Inisialisasi state
  const [sender, setSender] = useState(
    shipmentData && shipmentData.sender
      ? { ...defaultSender, ...shipmentData.sender, address: { ...defaultSender.address, ...shipmentData.sender.address } }
      : defaultSender
  );
  const [recipient, setRecipient] = useState(
    shipmentData && shipmentData.recipient
      ? { ...defaultRecipient, ...shipmentData.recipient, address: { ...defaultRecipient.address, ...shipmentData.recipient.address } }
      : defaultRecipient
  );
  const [items, setItems] = useState(
    shipmentData && Array.isArray(shipmentData.items) ? shipmentData.items : []
  );
  const [currentItem, setCurrentItem] = useState({ 
    name: '', 
    weight: '', 
    quantity: '1', 
    length: '', 
    width: '', 
    height: '',
    volumeWeight: 0,
    totalWeight: 0
  });
  const [shipmentType, setShipmentType] = useState(shipmentData ? shipmentData.shipmentType : 'pickup');
  const [courier, setCourier] = useState(shipmentData ? shipmentData.courier : '');
  const [marketing, setMarketing] = useState(shipmentData ? shipmentData.marketing : '');
  const [discount, setDiscount] = useState(shipmentData ? shipmentData.discount : 0);
  const [trackingNumber, setTrackingNumber] = useState(
    isDuplicate || !shipmentData?.trackingNumber
      ? 'CGO' + Math.floor(100000 + Math.random() * 900000)
      : shipmentData.trackingNumber
  );
  const [addressDialogType, setAddressDialogType] = useState('sender');
  const [senderDialogOpen, setSenderDialogOpen] = useState(false);
  const [recipientDialogOpen, setRecipientDialogOpen] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  // State untuk biaya pengiriman
  const [shippingRate, setShippingRate] = useState({
    ratePerKg: 0,
    totalCost: 0,
    discount: 0,
    finalCost: 0
  });

  // Jika shipmentData berubah (navigasi dari arsip), update state form
  useEffect(() => {
    if (shipmentData) {
      setSender(
        shipmentData.sender
          ? { ...defaultSender, ...shipmentData.sender, address: { ...defaultSender.address, ...shipmentData.sender.address } }
          : defaultSender
      );
      setRecipient(
        shipmentData.recipient
          ? { ...defaultRecipient, ...shipmentData.recipient, address: { ...defaultRecipient.address, ...shipmentData.recipient.address } }
          : defaultRecipient
      );
      setShipmentType(shipmentData.shipmentType);
      setCourier(shipmentData.courier);
      setMarketing(shipmentData.marketing);
      setDiscount(shipmentData.discount);
      const itemsWithWeight = Array.isArray(shipmentData.items)
        ? shipmentData.items.map(item => ({
            ...item,
            volumeWeight: item.volumeWeight ?? calculateVolumeWeight(item),
            totalWeight: item.totalWeight ?? calculateTotalWeight(item),
          }))
        : [];
      setItems(itemsWithWeight);
      if (isDuplicate) {
        setTrackingNumber('CGO' + Math.floor(100000 + Math.random() * 900000));
      } else {
        setTrackingNumber(shipmentData.trackingNumber);
      }
    }
  }, [shipmentData, isDuplicate]);

  const calculateVolumeWeight = (item) => {
    const length = parseFloat(item.length) || 0;
    const width = parseFloat(item.width) || 0;
    const height = parseFloat(item.height) || 0;
    return (length * width * height) / DEFAULT_DIVISOR;
  };

  const calculateTotalWeight = (item) => {
    const volumeWeight = calculateVolumeWeight(item);
    const actualWeight = parseFloat(item.weight) || 0;
    return Math.max(volumeWeight, actualWeight) * parseInt(item.quantity || 1);
  };

  // Menggunakan useMemo untuk menghitung total weight
  const totalWeight = useMemo(() => {
    return items.reduce((sum, item) => {
      const itemTotalWeight = item.totalWeight || calculateTotalWeight(item);
      return sum + itemTotalWeight;
    }, 0);
  }, [items]);

  // Effect untuk menghitung biaya pengiriman otomatis
  useEffect(() => {
    if (sender.address.city && recipient.address.city && totalWeight > 0) {
      const rate = shippingRates.find(
        rate => rate.origin === sender.address.city && 
                rate.destination === recipient.address.city
      );

      if (rate) {
        const ratePerKg = rate.price;
        const totalCost = ratePerKg * totalWeight;
        const discountAmount = parseFloat(discount) || 0;
        const finalCost = Math.max(0, totalCost - discountAmount);
        
        setShippingRate({
          ratePerKg,
          totalCost,
          discount: discountAmount,
          finalCost
        });
      } else {
        setShippingRate({
          ratePerKg: 0,
          totalCost: 0,
          discount: 0,
          finalCost: 0
        });
        toast.error('Tarif untuk rute ini belum tersedia');
      }
    }
  }, [sender.address.city, recipient.address.city, totalWeight, discount]);

  const handleAddItem = () => {
    if (!currentItem.name || !currentItem.weight) {
      toast.error('Nama dan berat barang harus diisi');
      return;
    }

    const volumeWeight = calculateVolumeWeight(currentItem);
    const totalWeight = calculateTotalWeight(currentItem);

    const newItem = {
      ...currentItem,
      id: Date.now(),
      volumeWeight,
      totalWeight
    };

    setItems([...items, newItem]);
    setCurrentItem({
      name: '',
      weight: '',
      quantity: '1',
      length: '',
      width: '',
      height: '',
      volumeWeight: 0,
      totalWeight: 0
    });
  };

  const handleRemoveItem = (itemId) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleEditItem = (item) => {
    setCurrentItem({
      ...item,
      volumeWeight: item.volumeWeight || 0,
      totalWeight: item.totalWeight || 0
    });
    handleRemoveItem(item.id);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Minimal satu barang harus ditambahkan');
      return;
    }
    toast.success('Pengiriman berhasil dibuat!', {
      description: `Nomor resi: ${trackingNumber}`
    });
  };

  const formatAddress = (address) => {
    const parts = [
      address.province,
      address.city,
      address.district
    ].filter(Boolean);
    return parts.join(', ') || 'Klik untuk mengisi alamat';
  };

  const formatRecipientAddress = (address) => {
    const parts = [
      address.province,
      address.city,
      address.district,
      address.street
    ].filter(Boolean);
    return parts.join(', ') || 'Klik untuk mengisi alamat';
  };

  const handleArchive = () => {
    setIsArchived(true);
    toast.success('Pengiriman berhasil diarsipkan');
  };

  const handleUnarchive = () => {
    setIsArchived(false);
    toast.success('Pengiriman berhasil dibatalkan arsip');
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
              <Package className="h-6 w-6 text-[#FF6B2C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0C4A6E]">Pengiriman Baru</h1>
              <p className="text-[#0C4A6E]/70 mt-1">
                Isi formulir di bawah untuk membuat pengiriman baru
              </p>
            </div>
          </div>
          <Link to="/shipments">
            <Button 
              variant="outline" 
              className="text-[#0C4A6E] border-[#0C4A6E]/20 hover:bg-[#0C4A6E]/5"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Daftar
            </Button>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informasi Barang */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-[#0C4A6E]">Informasi Barang</h3>
              <p className="text-[#0C4A6E]/70 mt-1">Detail barang yang akan dikirim</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Input Barang */}
                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <div className="space-y-2">
                    <Label htmlFor="item-name">Nama/Isi Barang</Label>
                    <Input 
                      id="item-name" 
                      value={currentItem.name}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nama barang"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item-weight">Berat (kg)</Label>
                    <Input 
                      id="item-weight" 
                      type="number"
                      value={currentItem.weight}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="Berat dalam kg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="item-quantity">Jumlah</Label>
                    <Input 
                      id="item-quantity" 
                      type="number"
                      value={currentItem.quantity}
                      onChange={(e) => setCurrentItem(prev => ({ ...prev, quantity: e.target.value }))}
                      placeholder="Jumlah barang"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="item-length">Panjang (cm)</Label>
                      <Input 
                        id="item-length" 
                        type="number"
                        value={currentItem.length}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, length: e.target.value }))}
                        placeholder="P"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-width">Lebar (cm)</Label>
                      <Input 
                        id="item-width" 
                        type="number"
                        value={currentItem.width}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, width: e.target.value }))}
                        placeholder="L"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="item-height">Tinggi (cm)</Label>
                      <Input 
                        id="item-height" 
                        type="number"
                        value={currentItem.height}
                        onChange={(e) => setCurrentItem(prev => ({ ...prev, height: e.target.value }))}
                        placeholder="T"
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={handleAddItem} className="w-full bg-[#0C4A6E] hover:bg-[#0C4A6E]/90">
                    <Plus className="mr-2 h-4 w-4" /> Tambah Barang
                  </Button>
                </div>

                {/* Tabel Barang */}
                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama</TableHead>
                        <TableHead>Berat</TableHead>
                        <TableHead>Jumlah</TableHead>
                        <TableHead>Berat Volume</TableHead>
                        <TableHead>Berat Total</TableHead>
                        <TableHead>Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.weight} kg</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.volumeWeight !== undefined ? Number(item.volumeWeight).toFixed(2) : '0.00'} kg</TableCell>
                          <TableCell>{item.totalWeight !== undefined ? Number(item.totalWeight).toFixed(2) : '0.00'} kg</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveItem(item.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {items.length > 0 && (
                        <TableRow>
                          <TableCell colSpan={4} className="text-right font-bold">
                            Total Berat Keseluruhan:
                          </TableCell>
                          <TableCell colSpan={2} className="font-bold">
                            {Number(totalWeight).toFixed(2)} kg
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Pengiriman */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-[#0C4A6E]">Informasi Pengiriman</h3>
              <p className="text-[#0C4A6E]/70 mt-1">Data pengirim dan penerima</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Pengirim */}
                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <h4 className="font-medium text-[#0C4A6E]">Data Pengirim</h4>
                  <div className="space-y-2">
                    <Label htmlFor="sender-name">Nama Pengirim</Label>
                    <Input 
                      id="sender-name" 
                      value={sender.name}
                      onChange={(e) => setSender(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nama lengkap pengirim"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sender-phone">No. Telp Pengirim</Label>
                    <Input 
                      id="sender-phone" 
                      value={sender.phone}
                      onChange={(e) => setSender(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Format: 08xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alamat Pengirim</Label>
                    <Dialog open={senderDialogOpen} onOpenChange={setSenderDialogOpen}>
                      <DialogTrigger asChild>
                        <Input 
                          value={formatAddress(sender.address)}
                          readOnly
                          className="bg-background cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="text-left">
                          <DialogTitle className="text-left">Alamat Pengirim</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="sender-province">Provinsi</Label>
                            <Input 
                              id="sender-province" 
                              value={sender.address.province}
                              onChange={(e) => setSender(prev => ({
                                ...prev,
                                address: { ...prev.address, province: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sender-city">Kota</Label>
                            <Input 
                              id="sender-city" 
                              value={sender.address.city}
                              onChange={(e) => setSender(prev => ({
                                ...prev,
                                address: { ...prev.address, city: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="sender-district">Kecamatan</Label>
                            <Input 
                              id="sender-district" 
                              value={sender.address.district}
                              onChange={(e) => setSender(prev => ({
                                ...prev,
                                address: { ...prev.address, district: e.target.value }
                              }))}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            type="button"
                            onClick={() => setSenderDialogOpen(false)}
                          >
                            Simpan
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                {/* Form Penerima */}
                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <h4 className="font-medium text-[#0C4A6E]">Data Penerima</h4>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-name">Nama Penerima</Label>
                    <Input 
                      id="recipient-name" 
                      value={recipient.name}
                      onChange={(e) => setRecipient(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nama lengkap penerima"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-phone">No. Telp Penerima</Label>
                    <Input 
                      id="recipient-phone" 
                      value={recipient.phone}
                      onChange={(e) => setRecipient(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Format: 08xxxx"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Alamat Penerima</Label>
                    <Dialog open={recipientDialogOpen} onOpenChange={setRecipientDialogOpen}>
                      <DialogTrigger asChild>
                        <Input 
                          value={formatRecipientAddress(recipient.address)}
                          readOnly
                          className="bg-background cursor-pointer"
                        />
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader className="text-left">
                          <DialogTitle className="text-left">Alamat Penerima</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="recipient-province">Provinsi</Label>
                            <Input 
                              id="recipient-province" 
                              value={recipient.address.province}
                              onChange={(e) => setRecipient(prev => ({
                                ...prev,
                                address: { ...prev.address, province: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="recipient-city">Kota</Label>
                            <Input 
                              id="recipient-city" 
                              value={recipient.address.city}
                              onChange={(e) => setRecipient(prev => ({
                                ...prev,
                                address: { ...prev.address, city: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="recipient-district">Kecamatan</Label>
                            <Input 
                              id="recipient-district" 
                              value={recipient.address.district}
                              onChange={(e) => setRecipient(prev => ({
                                ...prev,
                                address: { ...prev.address, district: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="recipient-street">Nama Jalan</Label>
                            <Input 
                              id="recipient-street" 
                              value={recipient.address.street}
                              onChange={(e) => setRecipient(prev => ({
                                ...prev,
                                address: { ...prev.address, street: e.target.value }
                              }))}
                            />
                          </div>
                        </div>
                        <div className="flex justify-end mt-4">
                          <Button
                            type="button"
                            onClick={() => setRecipientDialogOpen(false)}
                          >
                            Simpan
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Biaya */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-[#0C4A6E]">Informasi Biaya</h3>
              <p className="text-[#0C4A6E]/70 mt-1">Rincian biaya pengiriman</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <div className="space-y-2">
                    <Label className="text-[#0C4A6E]">Tarif per Kg</Label>
                    <Input 
                      value={`Rp ${shippingRate.ratePerKg.toLocaleString('id-ID')}`}
                      readOnly
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#0C4A6E]">Total Berat</Label>
                    <Input 
                      value={`${Number(totalWeight).toFixed(2)} kg`}
                      readOnly
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#0C4A6E]">Total Biaya Pengiriman</Label>
                    <Input 
                      value={`Rp ${shippingRate.totalCost.toLocaleString('id-ID')}`}
                      readOnly
                      className="bg-white border-gray-200 font-semibold text-[#0C4A6E]"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <div className="space-y-2">
                    <Label htmlFor="discount" className="text-[#0C4A6E]">Diskon/Potongan (Rp)</Label>
                    <Input 
                      id="discount" 
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="Jumlah diskon"
                      className="bg-white border-gray-200"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[#0C4A6E]">Total Biaya Setelah Diskon</Label>
                    <Input 
                      value={`Rp ${shippingRate.finalCost.toLocaleString('id-ID')}`}
                      readOnly
                      className="bg-white border-gray-200 font-semibold text-[#FF6B2C]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informasi Tambahan */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="px-6 pt-6">
              <h3 className="text-lg font-semibold text-[#0C4A6E]">Informasi Tambahan</h3>
              <p className="text-[#0C4A6E]/70 mt-1">Data pendukung pengiriman</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <div className="space-y-2">
                    <Label htmlFor="shipment-type" className="text-[#0C4A6E]">Jenis Kiriman</Label>
                    <Select 
                      value={shipmentType} 
                      onValueChange={setShipmentType}
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Pilih jenis kiriman" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pickup">Pickup</SelectItem>
                        <SelectItem value="dropoff">Drop-off</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="courier" className="text-[#0C4A6E]">Kurir</Label>
                    <Select 
                      value={courier} 
                      onValueChange={setCourier}
                    >
                      <SelectTrigger className="bg-white border-gray-200">
                        <SelectValue placeholder="Pilih kurir" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Agus Subagyo</SelectItem>
                        <SelectItem value="2">Budi Santoso</SelectItem>
                        <SelectItem value="3">Citra Dewi</SelectItem>
                        <SelectItem value="4">Dian Pratama</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4 bg-gray-50/80 p-6 rounded-xl">
                  <div className="space-y-2">
                    <Label htmlFor="marketing" className="text-[#0C4A6E]">Marketing</Label>
                    <Input 
                      id="marketing" 
                      value={marketing}
                      onChange={(e) => setMarketing(e.target.value)}
                      placeholder="Nama marketing"
                      className="bg-white border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tracking-number" className="text-[#0C4A6E]">Nomor Resi</Label>
                    <Input 
                      id="tracking-number" 
                      value={trackingNumber}
                      readOnly
                      className="bg-white border-gray-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex justify-between">
            <Link to="/shipments">
              <Button 
                variant="outline" 
                type="button"
                className="text-[#0C4A6E] border-[#0C4A6E]/20 hover:bg-[#0C4A6E]/5"
              >
                Batal
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={isArchived ? "outline" : "secondary"}
                onClick={isArchived ? handleUnarchive : handleArchive}
                className="flex items-center gap-2 bg-[#0C4A6E]/10 text-[#0C4A6E] hover:bg-[#0C4A6E]/20"
              >
                <Archive className="h-4 w-4" />
                {isArchived ? 'Batalkan Arsip' : 'Arsipkan'}
              </Button>
              <Button 
                type="submit"
                className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90"
              >
                Buat Pengiriman
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShipmentForm;
