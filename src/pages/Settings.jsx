import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingNumberSettings from '@/components/settings/TrackingNumberSettings';
import VolumeSettings from '@/components/settings/VolumeSettings';
import CompanyProfileSettings from '@/components/settings/CompanyProfileSettings';
import { Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-[#FF6B2C]/10">
              <SettingsIcon className="h-6 w-6 text-[#FF6B2C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#0C4A6E]">
                Pengaturan
              </h1>
              <p className="text-[#0C4A6E]/70 mt-1">
                Kelola pengaturan sistem sesuai kebutuhan Anda
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-[0_0_40px_-10px_rgba(0,0,0,0.1)]">
        <Tabs defaultValue="tracking" className="w-full">
          <div className="px-6 pt-6">
            <TabsList className="inline-flex p-1 gap-1 bg-gray-100/80 rounded-lg">
              <TabsTrigger
                value="tracking"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Format Nomor Resi
              </TabsTrigger>
              <TabsTrigger
                value="volume"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Berat & Tarif
              </TabsTrigger>
              <TabsTrigger
                value="company"
                className="px-6 py-2.5 rounded-md text-sm font-medium transition-all duration-200
                  data-[state=active]:bg-[#FF6B2C] data-[state=active]:text-white
                  data-[state=inactive]:text-gray-600 data-[state=inactive]:hover:text-[#FF6B2C]"
              >
                Profil Perusahaan
              </TabsTrigger>
            </TabsList>
          </div>
          <div className="px-6 py-6">
            <TabsContent value="tracking" className="mt-0">
              <TrackingNumberSettings />
            </TabsContent>
            <TabsContent value="volume" className="mt-0">
              <VolumeSettings />
            </TabsContent>
            <TabsContent value="company" className="mt-0">
              <CompanyProfileSettings />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
