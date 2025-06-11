import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";

const initialData = {
  company_name: "",
  subdomain: "",
  website: "",
  email: "",
  name: "",
  phone: "",
  address: "",
  logo: null,
};

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { saveCompanyProfile } = useCompanyProfile();
  const [formData, setFormData] = useState(initialData);
  const [logoPreview, setLogoPreview] = useState(null);
  const [tab, setTab] = useState("umum");

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        setFormData((prev) => ({ ...prev, logo: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validasi sederhana
    if (
      !formData.company_name ||
      !formData.subdomain ||
      !formData.email ||
      !formData.name ||
      !formData.phone ||
      !formData.address
    ) {
      toast.error("Mohon lengkapi semua data yang diperlukan");
      return;
    }
    // Simpan
    const success = await saveCompanyProfile(formData);
    if (success) {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        {/* Logo di atas */}
        <div className="flex flex-col items-center mb-4">
          <img
            src="/images/logosilogistik.png"
            alt="SiLogistik Logo"
            className="h-16 mb-2"
            onError={(e) => {
              e.target.src =
                "https://placehold.co/200x80/FF6B2C/white?text=SiLogistik";
            }}
          />
        </div>
        <h2 className="text-2xl font-bold text-[#0C4A6E] mb-2 text-center">
          Lengkapi Profil Perusahaan
        </h2>
        <p className="text-center text-[#0C4A6E]/70 mb-6">
          Mohon lengkapi data berikut untuk melanjutkan ke dashboard
        </p>
        <form onSubmit={handleSubmit}>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="flex justify-center mb-6 gap-2 bg-gray-100 rounded-lg">
              <TabsTrigger value="umum" className="px-4 py-2 rounded-md">
                Informasi Umum
              </TabsTrigger>
              <TabsTrigger value="kontak" className="px-4 py-2 rounded-md">
                Kontak
              </TabsTrigger>
              <TabsTrigger value="branding" className="px-4 py-2 rounded-md">
                Branding
              </TabsTrigger>
            </TabsList>

            {/* Tab Informasi Umum */}
            <TabsContent value="umum">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="company_name">Nama Perusahaan *</Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleChange}
                    placeholder="PT Logistik Cepat"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="subdomain">Subdomain *</Label>
                  <Input
                    id="subdomain"
                    name="subdomain"
                    value={formData.subdomain}
                    onChange={handleChange}
                    placeholder="logistikcepat"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://logistikcepat.com"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button
                  type="button"
                  onClick={() => setTab("kontak")}
                  className="bg-[#FF6B2C] text-white hover:bg-[#d4551a] transition-colors"
                >
                  Selanjutnya
                </Button>
              </div>
            </TabsContent>

            {/* Tab Kontak */}
            <TabsContent value="kontak">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@logistikcepat.com"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nama PIC *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Admin Logistik"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Nomor HP *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="08123456789"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="address">Alamat *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Jl. Contoh No. 123, Jakarta"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTab("umum")}
                  className="border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C] hover:text-white transition-colors"
                >
                  Sebelumnya
                </Button>
                <Button
                  type="button"
                  onClick={() => setTab("branding")}
                  className="bg-[#FF6B2C] text-white hover:bg-[#d4551a] transition-colors"
                >
                  Selanjutnya
                </Button>
              </div>
            </TabsContent>

            {/* Tab Branding */}
            <TabsContent value="branding">
              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-28 h-28 border-2 border-[#FF6B2C]/30">
                    <AvatarImage src={logoPreview} />
                    <AvatarFallback className="bg-[#FF6B2C]/10 text-[#FF6B2C] text-xl">
                      Logo
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="logo">
                      <Button
                        type="button"
                        asChild
                        variant="outline"
                        className="border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C] hover:text-white"
                      >
                        <span>Unggah Logo</span>
                      </Button>
                    </Label>
                    <Input
                      id="logo"
                      name="logo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setTab("kontak")}
                  className="border-[#FF6B2C] text-[#FF6B2C] hover:bg-[#FF6B2C] hover:text-white transition-colors"
                >
                  Sebelumnya
                </Button>
                <Button
                  type="submit"
                  className="bg-[#FF6B2C] text-white hover:bg-[#d4551a] transition-colors"
                >
                  Simpan & Lanjutkan
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
