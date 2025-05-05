import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TrackingNumberSettings from '@/components/settings/TrackingNumberSettings';
import VolumeSettings from '@/components/settings/VolumeSettings';

const Settings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Pengaturan</h1>
      
      <Tabs defaultValue="tracking">
        <TabsList>
          <TabsTrigger value="tracking">Format Nomor Resi</TabsTrigger>
          <TabsTrigger value="volume">Berat & Tarif</TabsTrigger>
        </TabsList>
        <TabsContent value="tracking">
          <TrackingNumberSettings />
        </TabsContent>
        <TabsContent value="volume">
          <VolumeSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
