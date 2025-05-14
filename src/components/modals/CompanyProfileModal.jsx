import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const CompanyProfileModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    subdomain: '',
    email: '',
    name: '',
    phone: '',
    address: '',
    website: '',
    logo: null
  });

  const [logoPreview, setLogoPreview] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData(prev => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!formData.companyName || !formData.subdomain || !formData.email || !formData.name || !formData.phone || !formData.address) {
      toast.error('Mohon lengkapi semua data yang diperlukan');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-[#0C4A6E]">
            Lengkapi Data Perusahaan
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload Section */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-32 h-32 border-2 border-[#FF6B2C]/20">
              <AvatarImage src={logoPreview} />
              <AvatarFallback className="bg-[#FF6B2C]/10 text-[#FF6B2C] text-2xl">
                Logo
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-center space-y-2">
              <Label htmlFor="logo" className="cursor-pointer">
                <Button 
                  variant="outline" 
                  className="border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C] hover:text-white"
                  asChild
                >
                  <span>Unggah Logo</span>
                </Button>
              </Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-[#0C4A6E]">Nama Perusahaan *</Label>
              <Input 
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Masukkan nama perusahaan"
                className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subdomain" className="text-[#0C4A6E]">Subdomain *</Label>
              <Input 
                id="subdomain"
                value={formData.subdomain}
                onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                placeholder="Masukkan subdomain"
                className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0C4A6E]">Email *</Label>
              <Input 
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Masukkan email perusahaan"
                className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0C4A6E]">Nama *</Label>
              <Input 
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Masukkan nama"
                className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#0C4A6E]">Nomor HP *</Label>
              <Input 
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Masukkan nomor HP"
                className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="text-[#0C4A6E]">Website (Opsional)</Label>
              <Input 
                id="website"
                value={formData.website}
                onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                placeholder="Masukkan website perusahaan"
                className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address" className="text-[#0C4A6E]">Alamat *</Label>
              <Input 
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder="Masukkan alamat perusahaan"
                className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C] hover:text-white"
            >
              Lewati
            </Button>
            <Button 
              type="submit"
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
            >
              Simpan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyProfileModal; 