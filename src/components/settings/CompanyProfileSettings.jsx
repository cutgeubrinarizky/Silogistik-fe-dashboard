import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Pencil, Save, X, Building2, Mail, Phone, Globe, MapPin } from 'lucide-react';
import { toast } from 'sonner';

const CompanyProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
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

  // Simulasi mengambil data dari API
  useEffect(() => {
    // TODO: Ganti dengan API call yang sebenarnya
    const fetchCompanyData = async () => {
      try {
        // Simulasi data dari API
        const data = {
          companyName: 'PT Contoh Perusahaan',
          subdomain: 'contoh',
          email: 'info@contoh.com',
          name: 'John Doe',
          phone: '081234567890',
          address: 'Jl. Contoh No. 123, Jakarta',
          website: 'www.contoh.com',
          logo: null
        };
        setFormData(data);
      } catch (error) {
        toast.error('Gagal mengambil data perusahaan');
      }
    };

    fetchCompanyData();
  }, []);

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

  const handleSave = async () => {
    try {
      // TODO: Implementasi API call untuk menyimpan data
      toast.success('Data perusahaan berhasil disimpan');
      setIsEditing(false);
    } catch (error) {
      toast.error('Gagal menyimpan data perusahaan');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form ke data awal
    // TODO: Implementasi reset form
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-[#0C4A6E]">Profil Perusahaan</h3>
          <p className="text-sm text-[#0C4A6E]/70 mt-1">
            Kelola informasi dan pengaturan profil perusahaan Anda
          </p>
        </div>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Profil
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C] hover:text-white"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button
              onClick={handleSave}
              className="bg-[#FF6B2C] hover:bg-[#FF6B2C]/90 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Simpan
            </Button>
          </div>
        )}
      </div>

      <Card className="border-none shadow-none">
        <CardContent className="p-0">
          {/* Logo Upload Section */}
          <div className="flex flex-col items-center space-y-4 mb-8 bg-[#FF6B2C]/5 p-8 rounded-xl">
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage src={logoPreview} />
              <AvatarFallback className="bg-[#FF6B2C]/10 text-[#FF6B2C] text-2xl">
                Logo
              </AvatarFallback>
            </Avatar>
            {isEditing && (
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
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="companyName" className="text-[#0C4A6E] flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nama Perusahaan
              </Label>
              {isEditing ? (
                <Input 
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Masukkan nama perusahaan"
                  className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                />
              ) : (
                <div className="text-[#0C4A6E] p-2 bg-gray-50 rounded-md">{formData.companyName}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subdomain" className="text-[#0C4A6E] flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Subdomain
              </Label>
              {isEditing ? (
                <Input 
                  id="subdomain"
                  value={formData.subdomain}
                  onChange={(e) => setFormData(prev => ({ ...prev, subdomain: e.target.value }))}
                  placeholder="Masukkan subdomain"
                  className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                />
              ) : (
                <div className="text-[#0C4A6E] p-2 bg-gray-50 rounded-md">{formData.subdomain}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0C4A6E] flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              {isEditing ? (
                <Input 
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Masukkan email perusahaan"
                  className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                />
              ) : (
                <div className="text-[#0C4A6E] p-2 bg-gray-50 rounded-md">{formData.email}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#0C4A6E] flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Nama
              </Label>
              {isEditing ? (
                <Input 
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Masukkan nama"
                  className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                />
              ) : (
                <div className="text-[#0C4A6E] p-2 bg-gray-50 rounded-md">{formData.name}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#0C4A6E] flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Nomor HP
              </Label>
              {isEditing ? (
                <Input 
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Masukkan nomor HP"
                  className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                />
              ) : (
                <div className="text-[#0C4A6E] p-2 bg-gray-50 rounded-md">{formData.phone}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="website" className="text-[#0C4A6E] flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Website
              </Label>
              {isEditing ? (
                <Input 
                  id="website"
                  value={formData.website}
                  onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="Masukkan website perusahaan"
                  className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                />
              ) : (
                <div className="text-[#0C4A6E] p-2 bg-gray-50 rounded-md">{formData.website || '-'}</div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address" className="text-[#0C4A6E] flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Alamat
              </Label>
              {isEditing ? (
                <Input 
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Masukkan alamat perusahaan"
                  className="border-gray-200 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]/20"
                />
              ) : (
                <div className="text-[#0C4A6E] p-2 bg-gray-50 rounded-md">{formData.address}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompanyProfileSettings; 