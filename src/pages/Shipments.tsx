
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShipmentList from '@/components/shipments/ShipmentList';
import ShipmentForm from '@/components/shipments/ShipmentForm';
import { useParams, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Shipments = () => {
  const { id } = useParams();
  const location = useLocation();

  // Check if we're on the new shipment page
  const isNewShipment = location.pathname.includes('new');

  if (isNewShipment) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Button variant="ghost" asChild size="sm">
            <Link to="/shipments">
              <ArrowLeft size={16} className="mr-2" /> Kembali
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Pengiriman Baru</h1>
        </div>
        <ShipmentForm />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Manajemen Pengiriman</h1>
      <ShipmentList />
    </div>
  );
};

export default Shipments;
